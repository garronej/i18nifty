import { memo } from "react";
import { declareComponentKeys } from "../..";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import type { ReactNode } from "react";

export const MyComponent = memo(() => {
    return null;
});

{
    const { i18n } = declareComponentKeys<
        | "one thing"
        | "something else"
        | ["yet another thing", { x: number; name: string }]
    >()({ MyComponent });

    type Expected = {
        MyComponent: Record<"one thing", string> &
            Record<"something else", string> &
            Record<
                "yet another thing",
                (params: { x: number; name: string }) => string
            >;
    };

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}

{
    const { i18n } = declareComponentKeys<"one thing" | "something else">()({
        MyComponent,
    });

    type Expected = {
        MyComponent: Record<"one thing", string> &
            Record<"something else", string>;
    };

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}

{
    const { i18n } = declareComponentKeys<
        | "one thing"
        | "something else"
        | ["yet another thing", { node: JSX.Element }]
    >()({ MyComponent });

    type Expected = {
        MyComponent: Record<"one thing", string> &
            Record<"something else", string> &
            Record<
                "yet another thing",
                (params: { node: JSX.Element }) => JSX.Element
            >;
    };

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}

{
    const { i18n } = declareComponentKeys<
        | "one thing"
        | "something else"
        | ["yet another thing", { node: ReactNode; x: number }]
    >()({ MyComponent });

    type Expected = {
        MyComponent: Record<"one thing", string> &
            Record<"something else", string> &
            Record<
                "yet another thing",
                (params: { node: ReactNode; x: number }) => JSX.Element
            >;
    };

    type Got = typeof i18n;

    assert<Equals<Got, Expected>>();
}
