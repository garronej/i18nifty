import type { ReactNode } from "react";

export type KeyToRecord<Key extends string | [string, Record<string, any>]> = {
    [K in Extract<Key, string>]: string;
} & {
    [K in Exclude<Key, string>[0]]: (
        params: Extract<Key, [K, any]>[1],
    ) => ReactNode;
};

export type ComponentKeyToRecord<
    ComponentKey extends [string, string | [string, Record<string, any>]],
> = {
    [ComponentName in ComponentKey[0]]: KeyToRecord<
        Extract<ComponentKey, [ComponentName, any]>[1]
    >;
};

export type WithOptionalKeys<Declaration> = {
    [ComponentName in keyof Declaration]: {
        [Key in keyof Declaration[ComponentName]]:
            | Declaration[ComponentName][Key]
            | undefined;
    };
};

export type TranslationFunction<
    ComponentName extends string,
    ComponentKey extends [string, string | [string, Record<string, any>]],
    Language extends string,
    FallbackLanguage extends Language,
    Translations extends {
        [L in Language]: L extends FallbackLanguage
            ? ComponentKeyToRecord<ComponentKey>
            : WithOptionalKeys<ComponentKeyToRecord<ComponentKey>>;
    },
> = {
    (
        key: Extract<Extract<ComponentKey, [ComponentName, any]>[1], string>,
    ): string;
    <
        K extends Exclude<
            Extract<ComponentKey, [ComponentName, any]>[1],
            string
        >[0],
    >(
        key: K,
        params: Translations[FallbackLanguage][ComponentName][K] extends (
            params: infer Params,
        ) => any
            ? Params
            : never,
    ): ReturnType<Exclude<Translations[Language][ComponentName][K], undefined>>;
};
