import { useEffect } from "react";
import { createUseSsrGlobalState } from "powerhooks/useSsrGlobalState";
import type { StatefulObservable } from "powerhooks/useGlobalState";
import Head from "next/head";
import {
    updateSearchBarUrl,
    retrieveParamFromUrl,
    addParamToUrl,
} from "powerhooks/tools/urlSearchParams";
import { assert } from "tsafe/assert";
import { getLanguageBestApprox } from "./getLanguageBestApprox";
import { id } from "tsafe/id";
import { symToStr } from "tsafe/symToStr";
export type { StatefulObservable };

export function createUseLang<Language extends string>(params: {
    languages: readonly Language[];
    fallbackLanguage: Language;
}) {
    const { languages, fallbackLanguage } = params;

    const name = "lang";

    //NOTE: We remove the param from the url ASAP client side
    if (typeof window !== "undefined") {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            name,
        });

        if (result.wasPresent) {
            updateSearchBarUrl(result.newUrl);
        }
    }

    const { useLang, $lang, withLang } = createUseSsrGlobalState({
        name,
        "getStateSeverSide": appContext => {
            const { [name]: value } = appContext.router.query;

            if (typeof value !== "string") {
                return undefined;
            }

            const lang = getLanguageBestApprox({
                languages,
                "languageLike": value,
            });

            if (lang === undefined) {
                return undefined;
            }

            return { "value": lang };
        },
        "getInitialStateServerSide": appContext => {
            let languageLike: string;

            try {
                const tmp =
                    appContext.ctx.req?.headers["accept-language"]?.split(
                        /[,;]/,
                    )[1];

                assert(typeof tmp === "string");

                languageLike = tmp;
            } catch {
                return {
                    "doFallbackToGetInitialValueClientSide": true,
                    "initialValue": fallbackLanguage,
                } as const;
            }

            const lang = getLanguageBestApprox<Language>({
                languageLike,
                languages,
            });

            if (lang === undefined) {
                return {
                    "doFallbackToGetInitialValueClientSide": true,
                    "initialValue": fallbackLanguage,
                } as const;
            }

            return { "initialValue": lang };
        },
        "getInitialStateClientSide": () => {
            const lang = getLanguageBestApprox<Language>({
                "languageLike": navigator.language,
                languages,
            });

            if (lang === undefined) {
                return fallbackLanguage;
            }

            return lang;
        },
        "Head": ({ lang, headers, pathname, query }) => {
            useEffect(() => {
                document.documentElement.setAttribute(name, lang);
            }, [lang]);

            return (
                <Head>
                    {[...languages, undefined].map(lang => (
                        <link
                            key={lang ?? "default"}
                            rel="alternate"
                            hrefLang={lang === undefined ? "x-default" : lang}
                            href={Object.entries(
                                (() => {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    const { lang: _, ...rest } = query;

                                    return {
                                        ...rest,
                                        ...(lang === undefined ? {} : { lang }),
                                    };
                                })(),
                            ).reduce((url, [name, value]) => {
                                if (typeof value !== "string") {
                                    console.warn(
                                        "TODO: Fix hrefLang generator",
                                    );
                                    return url;
                                }

                                const { newUrl } = addParamToUrl({
                                    url,
                                    name,
                                    value,
                                });

                                return newUrl;
                            }, `${headers.host}${pathname}`)}
                        />
                    ))}
                </Head>
            );
        },
    });

    return {
        useLang,
        [symToStr({ $lang })]: id<StatefulObservable<Language>>($lang),
        withLang,
    };
}
