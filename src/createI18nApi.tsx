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
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { StatefulObservable } from "powerhooks/tools/StatefulObservable";
import { assert } from "tsafe/assert";
import { objectKeys } from "tsafe/objectKeys";
import {
    createStatefulObservable,
    useRerenderOnChange
} from "powerhooks/tools/StatefulObservable";
import { exclude } from "tsafe/exclude";
import { createUseLang } from "./useLang";

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

    useResolveLocalizedString(params?: {
        /** default: false */
        labelWhenMismatchingLanguage?: false;
    }): {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => string;
    };
    useResolveLocalizedString(params?: {
        /** default: false */
        labelWhenMismatchingLanguage:
            | true
            | {
                  /* if true fallbackLanguage */
                  ifStringAssumeLanguage: Language;
              };
    }): {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => JSX.Element;
        resolveLocalizedStringDetailed: (
            localizedString: LocalizedString<Language>
        ) => {
            langAttrValue: Language | undefined;
            str: string;
        };
    };

    resolveLocalizedString(
        localizedString: LocalizedString<Language>,
        options?: {
            /** default: false */
            labelWhenMismatchingLanguage?: false;
        }
    ): string;
    resolveLocalizedString(
        localizedString: LocalizedString<Language>,
        options?: {
            /** default: false */
            labelWhenMismatchingLanguage:
                | true
                | {
                      /* if true fallbackLanguage */
                      ifStringAssumeLanguage: Language;
                  };
        }
    ): JSX.Element;

    useIsI18nFetching: () => boolean;

    I18nResourcesDownloadingFallbackProvider: (props: {
        fallback?: ReactNode;
        children: ReactNode;
    }) => JSX.Element;

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

/** @see <https://docs.i18nifty.dev> */
export function createI18nApi<
    ComponentKey extends [string, string | { K: string }]
>() {
    return function <
        Language extends string,
        FallbackLanguage extends Language,
        Translations extends {
            [L in Language]: ValueOrAsyncGetter<
                GenericTranslations<ComponentKey, Language, FallbackLanguage, L>
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
                GenericTranslations<ComponentKey, Language, FallbackLanguage, L>
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

        const $isFetchingOrNeverFetched = createStatefulObservable(() => true);

        function useIsI18nFetching() {
            useRerenderOnChange($isFetchingOrNeverFetched);

            return $isFetchingOrNeverFetched.current;
        }

        function I18nResourcesDownloadingFallbackProvider(props: {
            fallback?: ReactNode;
            children: ReactNode;
        }) {
            const { fallback, children } = props;

            const isFetchingOrNeverFetched = useIsI18nFetching();

            return (
                <>{isFetchingOrNeverFetched ? fallback ?? null : children}</>
            );
        }

        const $translationFetched = createStatefulObservable<number>(() => 0);

        lazy_fetch: {
            if (withLang !== undefined) {
                //TODO: Support lazy fetching for SSR
                break lazy_fetch;
            }

            const next = (lang: Language) => {
                if (
                    fetchedTranslations[lang] !== undefined ||
                    fetchingTranslations[lang] !== undefined
                ) {
                    return;
                }

                const fetchTranslations = translations[lang];

                assert(typeof fetchTranslations === "function");

                $isFetchingOrNeverFetched.current = true;

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

                        $isFetchingOrNeverFetched.current = false;
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
                            .map(componentName => translation[componentName])
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

        function useResolveLocalizedString(params?: {
            /** default: false */
            labelWhenMismatchingLanguage?: false;
        }): {
            resolveLocalizedString: (
                localizedString: LocalizedString<Language>
            ) => string;
        };
        function useResolveLocalizedString(params?: {
            /** default: false */
            labelWhenMismatchingLanguage:
                | true
                | {
                      /* if true fallbackLanguage */
                      ifStringAssumeLanguage: Language;
                  };
        }): {
            resolveLocalizedString: (
                localizedString: LocalizedString<Language>
            ) => JSX.Element;
            resolveLocalizedStringDetailed: (
                localizedString: LocalizedString<Language>
            ) => {
                langAttrValue: Language | undefined;
                str: string;
            };
        };
        function useResolveLocalizedString(params?: {
            /** default: false */
            labelWhenMismatchingLanguage?:
                | boolean
                | { ifStringAssumeLanguage: Language };
        }): {
            resolveLocalizedString: (
                localizedString: LocalizedString<Language>
            ) => JSX.Element | string;
            resolveLocalizedStringDetailed?: (
                localizedString: LocalizedString<Language>
            ) => {
                langAttrValue: Language | undefined;
                str: string;
            };
        } {
            const { labelWhenMismatchingLanguage } = params ?? {};

            const { lang } = useLang();

            const { resolveLocalizedString, resolveLocalizedStringDetailed } =
                useGuaranteedMemo(() => {
                    const {
                        resolveLocalizedString,
                        resolveLocalizedStringDetailed
                    } = createResolveLocalizedString({
                        "currentLanguage": lang,
                        fallbackLanguage,
                        "labelWhenMismatchingLanguage":
                            labelWhenMismatchingLanguage as true
                    });

                    return {
                        resolveLocalizedString,
                        resolveLocalizedStringDetailed
                    };
                }, [
                    lang,
                    typeof labelWhenMismatchingLanguage === "object"
                        ? labelWhenMismatchingLanguage.ifStringAssumeLanguage
                        : labelWhenMismatchingLanguage
                ]);

            return {
                resolveLocalizedString,
                resolveLocalizedStringDetailed
            };
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
                [lang, componentName, $translationFetched.current]
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
            localizedString: LocalizedString<Language>,
            options?: {
                /** default: false */
                labelWhenMismatchingLanguage?: false;
            }
        ): string;
        function resolveLocalizedString(
            localizedString: LocalizedString<Language>,
            options?: {
                /** default: false */
                labelWhenMismatchingLanguage:
                    | true
                    | {
                          /* if true fallbackLanguage */
                          ifStringAssumeLanguage: Language;
                      };
            }
        ): JSX.Element;
        function resolveLocalizedString(
            localizedString: LocalizedString<Language>,
            options?: {
                /** default: false */
                labelWhenMismatchingLanguage?:
                    | boolean
                    | { ifStringAssumeLanguage: Language };
            }
        ): string | JSX.Element {
            const { labelWhenMismatchingLanguage } = options ?? {};

            const { resolveLocalizedString } = createResolveLocalizedString({
                "currentLanguage": $lang.current,
                fallbackLanguage,
                "labelWhenMismatchingLanguage":
                    labelWhenMismatchingLanguage as any
            });

            return resolveLocalizedString(localizedString);
        }

        const i18nApi: I18nApi<ComponentKey, Language> = {
            useLang,
            useTranslation,
            useResolveLocalizedString,
            resolveLocalizedString,
            $lang,
            useIsI18nFetching,
            getTranslation,
            I18nResourcesDownloadingFallbackProvider
        };

        return i18nApi;
    };
}
