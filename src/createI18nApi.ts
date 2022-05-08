/* eslint-disable @typescript-eslint/no-empty-function */
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulEvt } from "evt";
import { Reflect } from "tsafe/Reflect";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { symToStr } from "tsafe/symToStr";
import type {
    ComponentKeyToRecord,
    WithOptionalKeys,
    TranslationFunction,
} from "./typeUtils";

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
        },
        translations: Translations,
    ) {
        const { languages, fallbackLanguage } = params;

        const { useLng, propertyEvtLng } = (() => {
            const wrap = createUseGlobalState("lng", (): Language => {
                const iso2LanguageLike = navigator.language
                    .split("-")[0]
                    .toLowerCase();

                const lng = languages.find(lng =>
                    lng.toLowerCase().includes(iso2LanguageLike),
                );

                if (lng !== undefined) {
                    return lng;
                }

                return fallbackLanguage;
            });

            const { useLng } = wrap;

            const propertyEvtLng = [
                "evtLng",
                { "get": () => wrap.evtLng },
            ] as const;

            return { useLng, propertyEvtLng };
        })();

        function useResolveLocalizedString() {
            const { lng } = useLng();

            const { resolveLocalizedString } = useGuaranteedMemo(() => {
                const { resolveLocalizedString } = createResolveLocalizedString(
                    {
                        "currentLanguage": lng,
                        fallbackLanguage,
                    },
                );

                return { resolveLocalizedString };
            }, [lng]);

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
            const { lng } = useLng();

            const componentName = symToStr(componentNameAsKey);

            const t = useGuaranteedMemo(
                (): any => (key: string, params?: Record<string, any>) => {
                    const getStrOrFn = (lng: string) =>
                        (translations as any)[lng][componentName][key];

                    let strOrFn = getStrOrFn(lng);

                    if (strOrFn === undefined) {
                        strOrFn = getStrOrFn(fallbackLanguage);
                    }

                    return params === undefined ? strOrFn : strOrFn(params);
                },
                [lng, componentName],
            );

            return { t };
        }

        function resolveLocalizedString(
            localizedString: LocalizedString<Language>,
        ): string {
            return createResolveLocalizedString({
                "currentLanguage": propertyEvtLng[1].get().state,
                fallbackLanguage,
            }).resolveLocalizedString(localizedString);
        }

        return Object.defineProperty(
            {
                useLng,
                useTranslation,
                useResolveLocalizedString,
                resolveLocalizedString,
                "evtLng": Reflect<StatefulEvt<Language>>(),
            },
            ...propertyEvtLng,
        );
    };
}
