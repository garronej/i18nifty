/* eslint-disable @typescript-eslint/no-empty-function */
import type { ReactElement } from "react";
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
import type {
    StatefulObservable,
    StatefulReadonlyObservable
} from "powerhooks/tools/StatefulObservable";
import { assert } from "tsafe/assert";
import { objectKeys } from "tsafe/objectKeys";
import { createStatefulObservable } from "powerhooks/tools/StatefulObservable/StatefulObservable";
import { exclude } from "tsafe/exclude";
import { createUseLang } from "./useLang";
import { useConstCallback } from "powerhooks/useConstCallback";
import { id } from "tsafe/id";

namespace JSX {
    export interface Element extends ReactElement<any, any> {}
}

type UseTranslation<ComponentKey extends [string, string | { K: string }]> = {
    <ComponentName extends ComponentKey[0]>(
        wrappedComponentName: Record<ComponentName, unknown>
    ): {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
    <ComponentName extends ComponentKey[0]>(componentName: ComponentName): {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
};

type I18nApi<
    ComponentKey extends [string, string | { K: string }],
    Language extends string
> = {
    useLang: () => {
        lang: Language;
        setLang: Dispatch<SetStateAction<Language>>;
    };
    $lang: StatefulObservable<Language>;
    useTranslation: UseTranslation<ComponentKey>;

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

    getTranslation: <ComponentName extends ComponentKey[0]>(
        componentName: ComponentName
    ) => {
        t: TranslationFunction<ComponentName, ComponentKey>;
    };
    $readyLang: StatefulReadonlyObservable<Language | undefined>;
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
        FallbackLanguage extends Language
    >(
        params: {
            languages: readonly Language[];
            fallbackLanguage: FallbackLanguage;
        },
        translations: {
            [L in Language]: ValueOrAsyncGetter<
                GenericTranslations<ComponentKey, Language, FallbackLanguage, L>
            >;
        }
    ) {
        const { languages, fallbackLanguage } = params;

        const fallbackEnabledLanguage = languages.includes(fallbackLanguage)
            ? fallbackLanguage
            : languages[0];

        const $isFetchingOrNeverFetched = createStatefulObservable(() => true);

        let prFetched: Promise<void> | undefined = undefined;
        {
            const next = (isFetchingOrNeverFetched: boolean) => {
                if (isFetchingOrNeverFetched) {
                    if (prFetched !== undefined) {
                        return;
                    }
                    prFetched = new Promise<void>(resolve => {
                        const { unsubscribe } =
                            $isFetchingOrNeverFetched.subscribe(
                                isFetchingOrNeverFetched => {
                                    if (isFetchingOrNeverFetched) {
                                        return;
                                    }
                                    prFetched = undefined;
                                    unsubscribe();
                                    resolve();
                                }
                            );
                    });
                }
            };
            next($isFetchingOrNeverFetched.current);
            $isFetchingOrNeverFetched.subscribe(next);
        }

        const { useLang, $lang } = (() => {
            const { useLang: useLang_noSuspense, $lang } = createUseLang({
                languages,
                fallbackEnabledLanguage
            });

            function useLang() {
                if ($isFetchingOrNeverFetched.current) {
                    assert(prFetched !== undefined, "20220220");
                    throw prFetched;
                }

                const { lang, setLang: setLang_sync } = useLang_noSuspense();

                const setLang = useConstCallback(
                    id<typeof setLang_sync>((...args) => {
                        // NOTE: React will give a warning and nudge us to use startTransition
                        // but we precisely want to re-mount the components when we fetch new language.
                        Promise.resolve().then(() => {
                            setLang_sync(...args);
                        });
                    })
                );

                return { lang, setLang };
            }

            return { useLang, $lang };
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

        const $readyLang = createStatefulObservable<Language | undefined>(
            () => {
                $isFetchingOrNeverFetched.subscribe(
                    isFetchingOrNeverFetched => {
                        if (isFetchingOrNeverFetched) {
                            $readyLang.current = undefined;
                        } else {
                            $readyLang.current = $lang.current;
                        }
                    }
                );

                if (!$isFetchingOrNeverFetched.current) {
                    return $lang.current;
                }

                return undefined;
            }
        );

        {
            const next = (lang: Language) => {
                if (fetchedTranslations[lang] !== undefined) {
                    $isFetchingOrNeverFetched.current = false;
                    return;
                }

                if (fetchingTranslations[lang] !== undefined) {
                    return;
                }

                const fetchTranslations = translations[lang];

                assert(typeof fetchTranslations === "function", "303392");

                $isFetchingOrNeverFetched.current = true;

                const pr = fetchTranslations();

                fetchingTranslations[lang] = pr;

                pr.then(translation => {
                    fetchingTranslations[lang] = undefined;

                    fetchedTranslations[lang] = translation;

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
                        "fallbackLanguage": fallbackEnabledLanguage,
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
            componentName: ComponentName | Record<ComponentName, unknown>
        ): { t: TranslationFunction<ComponentName, ComponentKey> } {
            const { lang } = useLang();

            const componentName_str =
                typeof componentName === "string"
                    ? componentName
                    : symToStr(componentName);

            const { t } = useGuaranteedMemo(
                () =>
                    getTranslationForLanguage({
                        "getLang": () => lang,
                        "componentName": componentName_str
                    }),
                [lang, componentName_str]
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
                "fallbackLanguage": fallbackEnabledLanguage,
                "labelWhenMismatchingLanguage":
                    labelWhenMismatchingLanguage === true
                        ? {
                              "ifStringAssumeLanguage": languages[0]
                          }
                        : (labelWhenMismatchingLanguage as any)
            });

            return resolveLocalizedString(localizedString);
        }

        const i18nApi: I18nApi<ComponentKey, Language> = {
            useLang,
            useTranslation,
            useResolveLocalizedString,
            resolveLocalizedString,
            $lang,
            getTranslation,
            $readyLang
        };

        return i18nApi;
    };
}
