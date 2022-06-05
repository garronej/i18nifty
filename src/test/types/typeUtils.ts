import type {
    KeyToRecord,
    ComponentKeyToRecord,
    TranslationFunction,
} from "../../typeUtils";
import { assert } from "tsafe/assert";
import { Reflect } from "tsafe/Reflect";
import type { Equals } from "tsafe";

{
    type Input =
        | "key1"
        | "key2"
        | { K: "key3"; P: { x: number } }
        | { K: "key4"; P: { y: string }; R: JSX.Element }
        | { K: "key5"; R: JSX.Element };

    type ExpectedOutput = {
        key1: string;
        key2: string;
        key3: (params: { x: number }) => string;
        key4: (params: { y: string }) => JSX.Element;
        key5: JSX.Element;
    };

    type Output = KeyToRecord<Input>;

    assert<Equals<Output, ExpectedOutput>>();
}

{
    type Input =
        | [
              "MyComponent1",

              (
                  | "key1"
                  | "key2"
                  | { K: "key3"; P: { x: number } }
                  | { K: "key4"; P: { y: string }; R: JSX.Element }
                  | { K: "key5"; R: JSX.Element }
              ),
          ]
        | [
              "MyComponent2",

              (
                  | "keyA"
                  | "keyB"
                  | { K: "keyC"; P: { x: number } }
                  | { K: "keyD"; P: { y: string }; R: JSX.Element }
                  | { K: "keyE"; R: JSX.Element }
              ),
          ];

    type ExpectedOutput = {
        MyComponent1: {
            key1: string;
            key2: string;
        } & {
            key3: (params: { x: number }) => string;
            key4: (params: { y: string }) => JSX.Element;
            key5: JSX.Element;
        };
        MyComponent2: {
            keyA: string;
            keyB: string;
        } & {
            keyC: (params: { x: number }) => string;
            keyD: (params: { y: string }) => JSX.Element;
            keyE: JSX.Element;
        };
    };

    type Output = ComponentKeyToRecord<Input>;

    assert<Equals<Output, ExpectedOutput>>();
}

{
    type ComponentName = "MyComponent1";

    type ComponentKey =
        | [
              "MyComponent1",

              (
                  | "key1"
                  | "key2"
                  | { K: "key3"; P: { x: number } }
                  | { K: "key4"; P: { y: string }; R: JSX.Element }
                  | { K: "key5"; R: JSX.Element }
              ),
          ]
        | [
              "MyComponent2",

              (
                  | "keyA"
                  | "keyB"
                  | { K: "keyC"; P: { x: number } }
                  | { K: "keyD"; P: { y: string }; R: JSX.Element }
                  | { K: "keyE"; R: JSX.Element }
              ),
          ];

    const t: TranslationFunction<ComponentName, ComponentKey> = null as any;

    {
        const got = t("key1");

        type Expected = string;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key2");

        type Expected = string;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key3", { "x": Reflect<number>() });

        type Expected = string;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key4", { "y": Reflect<string>() });

        type Expected = JSX.Element;

        assert<Equals<typeof got, Expected>>();
    }

    {
        const got = t("key5");

        type Expected = JSX.Element;

        assert<Equals<typeof got, Expected>>();
    }

    // @ts-expect-error
    t(null as any as string);
}
