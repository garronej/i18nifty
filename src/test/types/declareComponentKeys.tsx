import { memo } from "react";
import { declareComponentKeys } from "../..";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";

export const MyComponent = memo(() => {
    return null;
});

{
    const { i18n } = declareComponentKeys<
        | "one thing"
        | "something else"
        | ["yet another thing", { x: number; name: string }]
    >()({ MyComponent });

    type Expected = [
        "MyComponent",
        (
            | "one thing"
            | "something else"
            | ["yet another thing", { x: number; name: string }]
        ),
    ];

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}

{
    const { i18n } = declareComponentKeys<"one thing" | "something else">()({
        MyComponent,
    });

    type Expected = ["MyComponent", "one thing" | "something else"];

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}
