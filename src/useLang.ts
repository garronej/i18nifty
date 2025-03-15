import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulObservable } from "powerhooks/useGlobalState";
import { updateSearchBarUrl } from "powerhooks/tools/updateSearchBar";
import {
    addOrUpdateSearchParam,
    getSearchParam
} from "powerhooks/tools/urlSearchParams";
import { id } from "tsafe/id";
import { symToStr } from "tsafe/symToStr";
import { typeGuard } from "tsafe/typeGuard";
export type { StatefulObservable };

const GLOBAL_CONTEXT_KEY = "__i18nifty.useLang.globalContext";

declare global {
    interface Window {
        [GLOBAL_CONTEXT_KEY]: {
            initialLocationHref: string;
        };
    }
}

window[GLOBAL_CONTEXT_KEY] ??= {
    initialLocationHref: window.location.href
};

const globalContext = window[GLOBAL_CONTEXT_KEY];

const { initialLocationHref } = globalContext;

export function createUseLang<Language extends string>(params: {
    languages: readonly Language[];
    /* NOTE: fallbackEnabledLanguage is expected to be in languages */
    fallbackEnabledLanguage: Language;
}) {
    const { languages, fallbackEnabledLanguage } = params;

    const name = "lang";

    const getInitialState = () => {
        const lang = getLanguageBestApprox<Language>({
            "languageLike": navigator.language,
            languages
        });

        if (lang === undefined) {
            return fallbackEnabledLanguage;
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
        const result = getSearchParam({
            "url": initialLocationHref,
            name
        });

        if (result.wasPresent) {
            {
                const { wasPresent, url_withoutTheParam } = getSearchParam({
                    "url": window.location.href,
                    name
                });

                if (wasPresent) {
                    updateSearchBarUrl(url_withoutTheParam);
                }
            }

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
                : addOrUpdateSearchParam({
                      "url": window.location.href,
                      name,
                      "value": lang,
                      "encodeMethod": "encodeURIComponent"
                  });

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
