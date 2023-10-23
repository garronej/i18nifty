import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulObservable } from "powerhooks/useGlobalState";
import {
    updateSearchBarUrl,
    retrieveParamFromUrl,
    addParamToUrl
} from "powerhooks/tools/urlSearchParams";
import { id } from "tsafe/id";
import { symToStr } from "tsafe/symToStr";
import { typeGuard } from "tsafe/typeGuard";
export type { StatefulObservable };

export function createUseLang<Language extends string>(params: {
    languages: readonly Language[];
    fallbackLanguage: Language;
}) {
    const { languages, fallbackLanguage } = params;

    const name = "lang";

    const getInitialState = () => {
        const lang = getLanguageBestApprox<Language>({
            "languageLike": navigator.language,
            languages
        });

        if (lang === undefined) {
            return languages.includes(fallbackLanguage)
                ? fallbackLanguage
                : languages[0];
        }

        return lang;
    };

    const { useLang, $lang } = createUseGlobalState({
        name,
        "initialState": getInitialState,
        "doPersistAcrossReloads": true
    });

    // If the language has support has been removed or
    // if we are on another website using i18nifty on the same host.
    if (!languages.includes($lang.current)) {
        $lang.current = getInitialState();
    }

    {
        const next = (lang: Language) =>
            document.documentElement.setAttribute(name, lang);

        next($lang.current);

        $lang.subscribe(next);
    }

    read_url: {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            name
        });

        if (result.wasPresent) {
            updateSearchBarUrl(result.newUrl);

            if (
                !typeGuard<Language>(
                    result.value,
                    id<readonly string[]>(languages).includes(result.value)
                )
            ) {
                break read_url;
            }

            $lang.current = result.value;
        }
    }

    [...languages, undefined].forEach(lang => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = lang === undefined ? "x-default" : lang;
        link.href =
            lang === undefined
                ? window.location.href
                : addParamToUrl({
                      "url": window.location.href,
                      name,
                      "value": lang
                  }).newUrl;

        document.getElementsByTagName("head")[0].appendChild(link);
    });

    function getLanguageBestApprox<Language extends string>(params: {
        languages: readonly Language[];
        languageLike: string;
    }): Language | undefined {
        const { languages, languageLike } = params;

        scope: {
            const lang = languages.find(
                lang => lang.toLowerCase() === languageLike.toLowerCase()
            );

            if (lang === undefined) {
                break scope;
            }

            return lang;
        }

        scope: {
            const iso2LanguageLike = languageLike.split("-")[0].toLowerCase();

            const lang = languages.find(lang =>
                lang.toLowerCase().includes(iso2LanguageLike)
            );

            if (lang === undefined) {
                break scope;
            }

            return lang;
        }

        return undefined;
    }

    return {
        useLang,
        [symToStr({ $lang })]: id<StatefulObservable<Language>>($lang)
    };
}
