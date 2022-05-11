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

        const { useLng, evtLng } = createUseGlobalState("lng", (): Language => {
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
                "currentLanguage": evtLng.state,
                fallbackLanguage,
            }).resolveLocalizedString(localizedString);
        }

        return {
            useLng,
            useTranslation,
            useResolveLocalizedString,
            resolveLocalizedString,
            //NOTE: We need to redeclare StatefulEvt
            "evtLng": id<StatefulEvt<Language>>(evtLng),
        };
    };
}
