/* eslint-disable @typescript-eslint/no-empty-function */
import type { I18nDeclaration } from "./declareComponentKeys";
import type { UnionToIntersection } from "./tools/UnionToIntersection";
import { createResolveLocalizedString } from "./LocalizedString";
import type { LocalizedString } from "./LocalizedString";
import { createUseGlobalState } from "powerhooks/useGlobalState";
import type { StatefulEvt } from "evt";
import { Reflect } from "tsafe/Reflect";
import { useGuaranteedMemo } from "powerhooks/useGuaranteedMemo";
import { id } from "tsafe/id";
import { symToStr } from "tsafe/symToStr";

type WithOptionalKeys<Declaration> = {
    [ComponentName in keyof Declaration]: {
        [Key in keyof Declaration[ComponentName]]:
            | Declaration[ComponentName][Key]
            | undefined;
    };
};

export function createI18nApi<Declaration extends I18nDeclaration<any, any>>() {
    return function <
        Language extends string,
        FallbackLanguage extends Language,
    >(
        params: {
            languages: readonly Language[];
            fallbackLanguage: FallbackLanguage;
        },
        translations: {
            [L in Language]: L extends FallbackLanguage
                ? UnionToIntersection<Declaration>
                : WithOptionalKeys<UnionToIntersection<Declaration>>;
        },
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

        function useTranslation<
            ComponentName extends keyof UnionToIntersection<Declaration>,
        >(componentNameAsKey: Record<ComponentName, unknown>) {
            type MessageByKey = UnionToIntersection<Declaration>[ComponentName];

            type NoParamsKeys = NonNullable<
                {
                    [Key in keyof MessageByKey]: MessageByKey[Key] extends string
                        ? Key
                        : never;
                }[keyof MessageByKey]
            >;

            type TFunction = {
                (key: NoParamsKeys): string;
                <Key extends Exclude<keyof MessageByKey, NoParamsKeys>>(
                    key: Key,
                    params: MessageByKey[Key] extends (
                        param: infer Param,
                    ) => unknown
                        ? Param
                        : never,
                ): MessageByKey[Key] extends (...arg: any[]) => infer R
                    ? R
                    : never;
            };

            const { lng } = useLng();

            const componentName = symToStr(componentNameAsKey);

            const tImpl = useGuaranteedMemo(
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

            return {
                "t": id<TFunction>(tImpl),
            };
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
