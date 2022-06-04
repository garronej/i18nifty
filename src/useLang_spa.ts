import { createUseGlobalState } from "powerhooks/useGlobalState";
import {
    updateSearchBarUrl,
    retrieveParamFromUrl,
    addParamToUrl,
} from "powerhooks/tools/urlSearchParams";
import type { StatefulEvt } from "evt";
import { id } from "tsafe/id";
import { symToStr } from "tsafe/symToStr";

export function createUseLang<Language extends string>(params: {
    languages: readonly Language[];
    fallbackLanguage: Language;
}) {
    const { languages, fallbackLanguage } = params;

    const name = "lang";

    const { useLang, evtLang } = createUseGlobalState({
        name,
        "initialState": (() => {
            const lang = getLanguageBestApprox<Language>({
                "languageLike": navigator.language,
                languages,
            });

            if (lang === undefined) {
                return fallbackLanguage;
            }

            return lang;
        })(),
        "doPersistAcrossReloads": true,
    });

    evtLang.attach(lang => document.documentElement.setAttribute(name, lang));

    {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            name,
        });

        if (result.wasPresent) {
            updateSearchBarUrl(result.newUrl);
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
                      "value": lang,
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
                lang => lang.toLowerCase() === languageLike.toLowerCase(),
            );

            if (lang === undefined) {
                break scope;
            }

            return lang;
        }

        scope: {
            const iso2LanguageLike = languageLike.split("-")[0].toLowerCase();

            const lang = languages.find(lang =>
                lang.toLowerCase().includes(iso2LanguageLike),
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
        [symToStr({ evtLang })]: id<StatefulEvt<Language>>(evtLang),
    };
}
