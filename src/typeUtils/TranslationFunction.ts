export type TranslationFunction<
    ComponentName extends string,
    ComponentKey extends [string, string | { K: string }],
> = {
    <
        K extends HelperFlatKeyNoParams<
            HelperExtractKey<ComponentKey, ComponentName>
        >,
    >(
        key: K,
    ): HelperR<HelperExtractKey<ComponentKey, ComponentName>, K>;
    <
        K extends HelperFlatKeyWithParams<
            HelperExtractKey<ComponentKey, ComponentName>
        >,
    >(
        key: K,
        params: HelperP<HelperExtractKey<ComponentKey, ComponentName>, K>,
    ): HelperR<HelperExtractKey<ComponentKey, ComponentName>, K>;
};

type HelperR<
    Key extends string | { K: string },
    K extends string,
> = Key extends { K: string }
    ? Key extends { K: K }
        ? Key extends { R: any }
            ? Key["R"]
            : string
        : never
    : Key extends K
    ? string
    : never;

type HelperExtractKey<
    ComponentKey extends [string, string | { K: string }],
    ComponentName extends string,
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

type HelperP<
    Key extends string | { K: string },
    K extends string,
> = Key extends { K: string }
    ? Key extends { K: K }
        ? Key extends { P: any }
            ? Key["P"]
            : void
        : never
    : Key extends K
    ? void
    : never;
