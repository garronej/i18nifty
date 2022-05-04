import type { ReactNode } from "react";
import { createI18nApi } from "../../createI18nApi";
import { declareComponentKeys } from "../../declareComponentKeys";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Reflect } from "tsafe/Reflect";

{
    const { i18n: i18nMyComponent1 } = declareComponentKeys<
        | "one thing"
        | "something else"
        | ["yet another thing", { x: number; name: string }]
    >()({ "MyComponent1": null });

    const i18nMyComponent1_expected: {
        MyComponent1: Record<"one thing", string> &
            Record<"something else", string> &
            Record<
                "yet another thing",
                (params: { name: string; x: number }) => string
            >;
    } = null as any;

    assert<Equals<typeof i18nMyComponent1, typeof i18nMyComponent1_expected>>();

    const { i18n: i18nMyComponent2 } = declareComponentKeys<
        | "ready"
        | "something else"
        | ["i am ready to fight", { link: React.ReactNode; x: string }]
    >()({ "MyComponent2": null });

    const i18nMyComponent2_expected: {
        MyComponent2: Record<"ready", string> &
            Record<"something else", string> &
            Record<
                "i am ready to fight",
                (params: { link: React.ReactNode; x: string }) => JSX.Element
            >;
    } = null as any;

    assert<Equals<typeof i18nMyComponent2, typeof i18nMyComponent2_expected>>();

    const { useTranslation } = createI18nApi<
        typeof i18nMyComponent1 | typeof i18nMyComponent2
    >()(
        {
            "languages": ["en", "fr"] as const,
            "fallbackLanguage": "en",
        },
        {
            "en": {
                "MyComponent1": {
                    "one thing": "one thing",
                    "something else": "something else",
                    "yet another thing": ({ name, x }) =>
                        `yet another thing ${name} ${x}`,
                },
                "MyComponent2": {
                    "ready": "ready",
                    "something else": "something else",
                    "i am ready to fight": ({ link, x }) => (
                        <>
                            i am ready to fight {link} {x}
                        </>
                    ),
                },
            },
            "fr": {
                "MyComponent1": {
                    "one thing": "une chose",
                    "something else": "autre chose",
                    "yet another thing": ({ name, x }) =>
                        `autre chose ${name} ${x}`,
                },
                "MyComponent2": {
                    "ready": "prêt",
                    "something else": "autre chose",
                    "i am ready to fight": undefined,
                },
            },
        },
    );

    const { t } = useTranslation({ "MyComponent2": null });

    const out = t("i am ready to fight", {
        "link": Reflect<React.ReactNode>(),
        "x": Reflect<string>(),
    });

    assert<Equals<typeof out, JSX.Element>>();
}

{
    const { i18n: i18nMyComponent1 } = declareComponentKeys<
        ["the key", { x: number }]
    >()({ "MyComponent1": null });

    const { useTranslation } = createI18nApi<typeof i18nMyComponent1>()(
        {
            "languages": ["en"] as const,
            "fallbackLanguage": "en",
        },
        {
            "en": {
                "MyComponent1": {
                    "the key": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<string>();
                    },
                },
            },
        },
    );

    const { t } = useTranslation({ "MyComponent1": null });

    const out = t("the key", { "x": Reflect<number>() });

    assert<Equals<typeof out, string>>();
}

{
    const { i18n: i18nMyComponent1 } = declareComponentKeys<
        ["the key", { x: ReactNode }]
    >()({ "MyComponent1": null });

    const { useTranslation } = createI18nApi<typeof i18nMyComponent1>()(
        {
            "languages": ["en"] as const,
            "fallbackLanguage": "en",
        },
        {
            "en": {
                "MyComponent1": {
                    "the key": ({ x }) => {
                        assert<Equals<typeof x, ReactNode>>();
                        return Reflect<JSX.Element>();
                    },
                },
            },
        },
    );

    const { t } = useTranslation({ "MyComponent1": null });

    const out = t("the key", { "x": Reflect<number>() });

    assert<Equals<typeof out, JSX.Element>>();
}
