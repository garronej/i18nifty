import type { ReactNode } from "react";
import type {
    KeyToRecord,
    ComponentKeyToRecord,
    TranslationFunction,
} from "../../typeUtils";
import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import type { Equals } from "tsafe";

{
    type Input = "key1" | "key2" | ["key3", { x: number }];

    type ExpectedOutput = {
        key1: ReactNode;
        key2: ReactNode;
        key3: (params: { x: number }) => ReactNode;
    };

    type Output = KeyToRecord<Input>;

    assert<Equals<Output, ExpectedOutput>>();
}

{
    type Input =
        | ["MyComponent1", "key1" | "key2" | ["key3", { x: number }]]
        | ["MyComponent2", "keyA" | ["keyB", { str: string }] | "keyC"];

    type ExpectedOutput = {
        MyComponent1: {
            key1: ReactNode;
            key2: ReactNode;
        } & {
            key3: (params: { x: number }) => ReactNode;
        };
        MyComponent2: {
            keyA: ReactNode;
            keyC: ReactNode;
        } & {
            keyB: (params: { str: string }) => ReactNode;
        };
    };

    type Output = ComponentKeyToRecord<Input>;

    assert<Equals<Output, ExpectedOutput>>();
}

{
    type ComponentName = "MyComponent1";

    type ComponentKey =
        | ["MyComponent1", "key1" | "key2" | ["key3", { x: number }]]
        | ["MyComponent2", "keyA" | ["keyB", { str: string }] | "keyC"];

    type Language = "en" | "fr";

    type FallbackLanguage = "en";

    const translation = {
        "en": {
            "MyComponent1": {
                "key1": Reflect<string>(),
                "key2": Reflect<JSX.Element>(),
                "key3": Reflect<(params: { x: number }) => JSX.Element>(),
            },
            "MyComponent2": {
                "keyA": Reflect<string>(),
                "keyB": Reflect<(params: { str: string }) => JSX.Element>(),
                "keyC": Reflect<string>(),
            },
        },
        "fr": {
            "MyComponent1": {
                "key1": Reflect<string>(),
                "key2": Reflect<string>(),
                "key3": Reflect<(params: { x: number }) => string>(),
            },
            "MyComponent2": {
                "keyA": Reflect<string>(),
                "keyB": Reflect<(params: { str: string }) => JSX.Element>(),
                "keyC": Reflect<string>(),
            },
        },
    };

    const t: TranslationFunction<
        ComponentName,
        ComponentKey,
        Language,
        FallbackLanguage,
        typeof translation
    > = null as any;

    {
        const got = t("key1");

        type Expected = string;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key2");

        type Expected = JSX.Element | string;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key3", { "x": Reflect<number>() });

        type Expected = string | JSX.Element;

        assert<Equals<typeof got, Expected>>();
    }

    // @ts-expect-error
    t(null as any as string);
}
