export type TranslationFunction<
    ComponentName extends string,
    ComponentKey extends [string, string | { K: string }]
> = {
    <
        K extends HelperFlatKeyNoParams<
            HelperExtractKey<ComponentKey, ComponentName>
        >
    >(
        key: K
    ): HelperR<HelperExtractKey<ComponentKey, ComponentName>, K>;
    <
        K extends HelperFlatKeyWithParams<
            HelperExtractKey<ComponentKey, ComponentName>
        >
    >(
        key: K,
        params: HelperP<HelperExtractKey<ComponentKey, ComponentName>, K>
    ): HelperR<HelperExtractKey<ComponentKey, ComponentName>, K>;
};

//NOTE: We need to extract this type because we get ts(2536) with typescript 4.7.3
type HelperROrString<Key extends { K: string }> = Key extends { R: any }
    ? Key["R"]
    : string;

type HelperR<
    Key extends string | { K: string },
    K extends string
> = Key extends { K: string }
    ? Key extends { K: K }
        ? HelperROrString<Key>
        : never
    : Key extends K
    ? string
    : never;

type HelperExtractKey<
    ComponentKey extends [string, string | { K: string }],
    ComponentName extends string
> = Extract<ComponentKey, [ComponentName, any]>[1];

type HelperFlatKeyNoParams<Key extends string | { K: string }> = Key extends {
    K: string;
}
    ? Key extends { P: any }
        ? never
        : Key["K"]
    : Key;

type HelperFlatKeyWithParams<Key extends string | { K: string }> = Key extends {
    K: string;
}
    ? Key extends { P: any }
        ? Key["K"]
        : never
    : never;

type HelperPOrVoid<Key extends { K: string }> = Key extends { P: any }
    ? Key["P"]
    : void;

type HelperP<
    Key extends string | { K: string },
    K extends string
> = Key extends { K: string }
    ? Key extends { K: K }
        ? HelperPOrVoid<Key>
        : never
    : Key extends K
    ? void
    : never;
