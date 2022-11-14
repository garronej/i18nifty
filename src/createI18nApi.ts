/* eslint-disable @typescript-eslint/no-empty-function */
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { symToStr } from "tsafe/symToStr";
import type {
    ComponentKeyToRecord,
    WithOptionalKeys,
    TranslationFunction
} from "./typeUtils";
import type { Dispatch, SetStateAction } from "react";
import { StatefulObservable } from "powerhooks/tools/StatefulObservable";
import { assert } from "tsafe/assert";
import { objectKeys } from "tsafe/objectKeys";
import {
    createStatefulObservable,
    useRerenderOnChange
} from "powerhooks/tools/StatefulObservable";
import { exclude } from "tsafe/exclude";

type I18nApi<
    ComponentKey extends [string, string | { K: string }],
    Language extends string
> = {
    useLang: () => {
        lang: Language;
        setLang: Dispatch<SetStateAction<Language>>;
    };
    $lang: StatefulObservable<Language>;
    useTranslation: <ComponentName extends ComponentKey[0]>(
        componentNameAsKey: Record<ComponentName, unknown>
    ) => {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
    useResolveLocalizedString: () => {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => string;
    };
    resolveLocalizedString: (
        localizedString: LocalizedString<Language>
    ) => string;
    useIsI18nFetching: () => boolean;
    getTranslation: <ComponentName extends ComponentKey[0]>(
        componentName: ComponentName
    ) => {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
};

export type GenericTranslations<
    ComponentKey extends [string, string | { K: string }],
    Language extends string,
    FallbackLanguage extends Language,
    L extends Language
> = L extends FallbackLanguage
    ? ComponentKeyToRecord<ComponentKey>
    : WithOptionalKeys<ComponentKeyToRecord<ComponentKey>>;

type ValueOrAsyncGetter<T> = T | (() => Promise<T>);

export function createI18nApiFactory<
    AppType extends
        | { type: "ssr"; NextComponentType: any; DefaultAppType: any }
        | { type: "spa" }
>(params: {
    createUseLang: <Language extends string>(params: {
        languages: readonly Language[];
        fallbackLanguage: Language;
    }) => {
        useLang: () => {
            lang: Language;
            setLang: Dispatch<SetStateAction<Language>>;
        };
        $lang: StatefulObservable<Language>;
    };
}): {
    createI18nApi: <
        ComponentKey extends [string, string | { K: string }]
    >() => <Language extends string, FallbackLanguage extends Language>(
        params: {
            languages: readonly Language[];
            fallbackLanguage: FallbackLanguage;
        },
        translations: {
            [L in Language]: ValueOrAsyncGetter<
                GenericTranslations<ComponentKey, Language, FallbackLanguage, L>
            >;
        }
    ) => I18nApi<ComponentKey, Language> &
        (AppType extends { type: "spa" }
            ? unknown
            : AppType extends { type: "ssr" }
            ? {
                  withLang: <AppComponent extends AppType["NextComponentType"]>(
                      App: AppComponent
                  ) => AppComponent;
              }
            : never);
} {
    const { createUseLang } = params;

    /** @see <https://docs.i18nifty.dev> */
    function createI18nApi<
        ComponentKey extends [string, string | { K: string }]
    >() {
        return function <
            Language extends string,
            FallbackLanguage extends Language,
            Translations extends {
                [L in Language]: ValueOrAsyncGetter<
                    GenericTranslations<
                        ComponentKey,
                        Language,
                        FallbackLanguage,
                        L
                    >
                >;
            }
        >(
            params: {
                languages: readonly Language[];
                fallbackLanguage: FallbackLanguage;
            },
            translations: Translations
        ) {
            const { languages, fallbackLanguage } = params;

            const { useLang, $lang, withLang } = (() => {
                const result = createUseLang({
                    languages,
                    fallbackLanguage
                });

                const { useLang, $lang } = result;
                const { withLang } = result as any;

                return { useLang, $lang, withLang };
            })();

            const fetchingTranslations: {
                [L in Language]?: Promise<
                    GenericTranslations<
                        ComponentKey,
                        Language,
                        FallbackLanguage,
                        L
                    >
                >;
            } = {};

            const fetchedTranslations: {
                [L in Language]?: GenericTranslations<
                    ComponentKey,
                    Language,
                    FallbackLanguage,
                    L
                >;
            } = Object.fromEntries(
                Object.entries(translations).filter(
                    ([, value]) => typeof value !== "function"
                )
            ) as any;

            const $isFetching = createStatefulObservable<boolean>(() => false);

            function useIsI18nFetching() {
                useRerenderOnChange($isFetching);

                return $isFetching.current;
            }

            const $translationFetched = createStatefulObservable<number>(
                () => 0
            );

            lazy_fetch: {
                if (withLang !== undefined) {
                    //TODO: Support lazy fetching for SSR
                    break lazy_fetch;
                }

                const next = (lang: Language) => {
                    if (fetchedTranslations[lang] !== undefined) {
                        return;
                    }

                    const fetchTranslations = translations[lang];

                    assert(typeof fetchTranslations === "function");

                    $isFetching.current = true;

                    const pr = fetchTranslations();

                    fetchingTranslations[lang] = pr;

                    pr.then(translation => {
                        fetchingTranslations[lang] = undefined;

                        fetchedTranslations[lang] = translation;

                        $translationFetched.current++;

                        const notifyIfNoLongerFetchingIfItsTheCase = () => {
                            if (
                                objectKeys(fetchingTranslations)
                                    .map(lang => fetchingTranslations[lang])
                                    .filter(exclude(undefined)).length !== 0
                            ) {
                                return;
                            }

                            $isFetching.current = false;
                        };

                        if (
                            lang === fallbackLanguage ||
                            fetchedTranslations[fallbackLanguage] !== undefined
                        ) {
                            notifyIfNoLongerFetchingIfItsTheCase();
                            return;
                        }

                        if (
                            objectKeys(translation)
                                .map(
                                    componentName => translation[componentName]
                                )
                                .map(componentTranslation =>
                                    objectKeys(componentTranslation)
                                        .map(key => componentTranslation[key])
                                        .includes(undefined as any)
                                )
                                .flat()
                                .includes(true)
                        ) {
                            next(fallbackLanguage);
                        } else {
                            notifyIfNoLongerFetchingIfItsTheCase();
                        }
                    });
                };

                next($lang.current);

                $lang.subscribe(next);
            }

            function useResolveLocalizedString() {
                const { lang } = useLang();

                const { resolveLocalizedString } = useGuaranteedMemo(() => {
                    const { resolveLocalizedString } =
                        createResolveLocalizedString({
                            "currentLanguage": lang,
                            fallbackLanguage
                        });

                    return { resolveLocalizedString };
                }, [lang]);

                return { resolveLocalizedString };
            }

            function getTranslationForLanguage<
                ComponentName extends ComponentKey[0]
            >(params: {
                componentName: ComponentName;
                getLang: () => Language;
            }): { t: TranslationFunction<ComponentName, ComponentKey> } {
                const { componentName, getLang } = params;

                const t = (key: string, params?: Record<string, any>) => {
                    const lang = getLang();

                    if ((fetchedTranslations as any)[lang] === undefined) {
                        return "";
                    }

                    const getStrOrFn = (lang: string) => {
                        //return (fetchedTranslations as any)[lang][componentName][key];
                        const translation = (fetchedTranslations as any)[lang];

                        if (translation === undefined) {
                            return "";
                        }

                        return translation[componentName][key];
                    };

                    let strOrFn = getStrOrFn(lang);

                    if (strOrFn === undefined) {
                        strOrFn = getStrOrFn(fallbackLanguage);
                    }

                    return params === undefined ? strOrFn : strOrFn(params);
                };

                return { t };
            }

            function useTranslation<ComponentName extends ComponentKey[0]>(
                componentNameAsKey: Record<ComponentName, unknown>
            ): { t: TranslationFunction<ComponentName, ComponentKey> } {
                const { lang } = useLang();

                useRerenderOnChange($translationFetched);

                const componentName = symToStr(componentNameAsKey);

                const { t } = useGuaranteedMemo(
                    () =>
                        getTranslationForLanguage({
                            "getLang": () => lang,
                            componentName
                        }),
                    [lang, componentName]
                );

                return { t };
            }

            function getTranslation<ComponentName extends ComponentKey[0]>(
                componentName: ComponentName
            ): { t: TranslationFunction<ComponentName, ComponentKey> } {
                const { t } = getTranslationForLanguage({
                    componentName,
                    "getLang": () => $lang.current
                });

                return { t };
            }

            function resolveLocalizedString(
                localizedString: LocalizedString<Language>
            ): string {
                return createResolveLocalizedString({
                    "currentLanguage": $lang.current,
                    fallbackLanguage
                }).resolveLocalizedString(localizedString);
            }

            const i18nApi: I18nApi<ComponentKey, Language> = {
                useLang,
                useTranslation,
                useResolveLocalizedString,
                resolveLocalizedString,
                $lang,
                useIsI18nFetching,
                getTranslation
            };

            return {
                ...i18nApi,
                withLang
            } as any;
        };
    }

    return { createI18nApi };
}
