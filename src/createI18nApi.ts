/* eslint-disable @typescript-eslint/no-empty-function */
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import type { StatefulEvt } from "evt";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { symToStr } from "tsafe/symToStr";
import type {
    ComponentKeyToRecord,
    WithOptionalKeys,
    TranslationFunction,
} from "./typeUtils";
import type { Dispatch, SetStateAction } from "react";

type I18nApi<
    ComponentKey extends [string, string | { K: string }],
    Language extends string,
> = {
    useLang: () => {
        lang: Language;
        setLang: Dispatch<SetStateAction<Language>>;
    };
    evtLang: StatefulEvt<Language>;
    useTranslation: <ComponentName extends ComponentKey[0]>(
        componentNameAsKey: Record<ComponentName, unknown>,
    ) => {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
    useResolveLocalizedString: () => {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>,
        ) => string;
    };
    resolveLocalizedString: (
        localizedString: LocalizedString<Language>,
    ) => string;
};

export function createI18nApiFactory<
    AppType extends
        | { type: "ssr"; NextComponentType: any; DefaultAppType: any }
        | { type: "spa" },
>(params: {
    createUseLang: <Language extends string>(params: {
        languages: readonly Language[];
        fallbackLanguage: Language;
    }) => {
        useLang: () => {
            lang: Language;
            setLang: Dispatch<SetStateAction<Language>>;
        };
        evtLang: StatefulEvt<Language>;
    };
}): {
    createI18nApi: <
        ComponentKey extends [string, string | { K: string }],
    >() => <
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
        },
        translations: Translations,
    ) => I18nApi<ComponentKey, Language> &
        (AppType extends { type: "spa" }
            ? unknown
            : AppType extends { type: "ssr" }
            ? {
                  withLang: {
                      <AppComponent extends AppType["NextComponentType"]>(
                          App: AppComponent,
                      ): AppComponent;
                      (): AppType["DefaultAppType"];
                  };
              }
            : never);
} {
    const { createUseLang } = params;

    /** @see <https://docs.i18nifty.dev> */
    function createI18nApi<
        ComponentKey extends [string, string | { K: string }],
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
            },
            translations: Translations,
        ) {
            const { languages, fallbackLanguage } = params;

            const { useLang, evtLang, withLang } = (() => {
                const result = createUseLang({
                    languages,
                    fallbackLanguage,
                });

                const { useLang, evtLang } = result;
                const { withLang } = result as any;

                return { useLang, evtLang, withLang };
            })();

            function useResolveLocalizedString() {
                const { lang } = useLang();

                const { resolveLocalizedString } = useGuaranteedMemo(() => {
                    const { resolveLocalizedString } =
                        createResolveLocalizedString({
                            "currentLanguage": lang,
                            fallbackLanguage,
                        });

                    return { resolveLocalizedString };
                }, [lang]);

                return { resolveLocalizedString };
            }

            function useTranslation<ComponentName extends ComponentKey[0]>(
                componentNameAsKey: Record<ComponentName, unknown>,
            ): {
                t: TranslationFunction<ComponentName, ComponentKey>;
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

            const i18nApi: I18nApi<ComponentKey, Language> = {
                useLang,
                useTranslation,
                useResolveLocalizedString,
                resolveLocalizedString,
                evtLang,
            };

            return {
                ...i18nApi,
                withLang,
            } as any;
        };
    }

    return { createI18nApi };
}
