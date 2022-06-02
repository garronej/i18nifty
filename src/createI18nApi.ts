/* eslint-disable @typescript-eslint/no-empty-function */
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulEvt } from "evt";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { symToStr } from "tsafe/symToStr";
import type {
    ComponentKeyToRecord,
    WithOptionalKeys,
    TranslationFunction,
} from "./typeUtils";
import { id } from "tsafe/id";

/** @see <https://docs.i18nifty.dev> */
export function createI18nApi<
    ComponentKey extends [string, string | [string, Record<string, any>]],
>() {
    return function <
        Language extends string,
        FallbackLanguage extends Language,
        Translations extends {
            [L in Language]: L extends FallbackLanguage
                ? ComponentKeyToRecord<ComponentKey>
                : WithOptionalKeys<ComponentKeyToRecord<ComponentKey>>;
        },
    >(
        params: {
            languages: readonly Language[];
            fallbackLanguage: FallbackLanguage;
            doPersistLanguageInLocalStorage: boolean;
        },
        translations: Translations,
    ) {
        const { languages, fallbackLanguage, doPersistLanguageInLocalStorage } =
            params;

        const { useLang, evtLang } = createUseGlobalState({
            "name": "lang",
            "initialState": (): Language => {
                const iso2LanguageLike = navigator.language
                    .split("-")[0]
                    .toLowerCase();

                const lang = languages.find(lang =>
                    lang.toLowerCase().includes(iso2LanguageLike),
                );

                if (lang !== undefined) {
                    return lang;
                }

                return fallbackLanguage;
            },
            "doPersistAcrossReloads": doPersistLanguageInLocalStorage,
        });

        evtLang.attach(lang =>
            document.documentElement.setAttribute("lang", lang),
        );

        function useResolveLocalizedString() {
            const { lang } = useLang();

            const { resolveLocalizedString } = useGuaranteedMemo(() => {
                const { resolveLocalizedString } = createResolveLocalizedString(
                    {
                        "currentLanguage": lang,
                        fallbackLanguage,
                    },
                );

                return { resolveLocalizedString };
            }, [lang]);

            return { resolveLocalizedString };
        }

        function useTranslation<ComponentName extends ComponentKey[0]>(
            componentNameAsKey: Record<ComponentName, unknown>,
        ): {
            t: TranslationFunction<
                ComponentName,
                ComponentKey,
                Language,
                FallbackLanguage,
                Translations
            >;
        } {
            const { lang } = useLang();

            const componentName = symToStr(componentNameAsKey);

            const t = useGuaranteedMemo(
                (): any => (key: string, params?: Record<string, any>) => {
                    const getStrOrFn = (lang: string) =>
                        (translations as any)[lang][componentName][key];

                    let strOrFn = getStrOrFn(lang);

                    if (strOrFn === undefined) {
                        strOrFn = getStrOrFn(fallbackLanguage);
                    }

                    return params === undefined ? strOrFn : strOrFn(params);
                },
                [lang, componentName],
            );

            return { t };
        }

        function resolveLocalizedString(
            localizedString: LocalizedString<Language>,
        ): string {
            return createResolveLocalizedString({
                "currentLanguage": evtLang.state,
                fallbackLanguage,
            }).resolveLocalizedString(localizedString);
        }

        return {
            useLang,
            useTranslation,
            useResolveLocalizedString,
            resolveLocalizedString,
            //NOTE: We need to redeclare StatefulEvt
            "evtLang": id<StatefulEvt<Language>>(evtLang),
        };
    };
}
