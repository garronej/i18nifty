import { memo } from "react";
import { declareComponentKeys } from "../../src/declareComponentKeys";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export const MyComponent = memo(() => {
    return null;
});

{
    const { i18n } = declareComponentKeys<
        | "one thing"
        | "something else"
        | {
              K: "yet another thing";
              P: { x: number; name: string };
              R: JSX.Element;
          }
    >()({ MyComponent });

    type Expected = [
        "MyComponent",
        (
            | "one thing"
            | "something else"
            | {
                  K: "yet another thing";
                  P: { x: number; name: string };
                  R: JSX.Element;
              }
        )
    ];

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}

{
    const { i18n } = declareComponentKeys<"one thing" | "something else">()({
        MyComponent
    });

    type Expected = ["MyComponent", "one thing" | "something else"];

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}
