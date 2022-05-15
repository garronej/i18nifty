import { createI18nApi } from "../../createI18nApi";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Reflect } from "tsafe/Reflect";

{
    const i18n: ["MyComponent", ["the key", { x: number }]] = null as any;

    const { useTranslation } = createI18nApi<typeof i18n>()(
        {
            "languages": ["en"] as const,
            "fallbackLanguage": "en",
            "doPersistLanguageInLocalStorage": false,
        },
        {
            "en": {
                "MyComponent": {
                    "the key": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<string>();
                    },
                },
            },
        },
    );

    const { t } = useTranslation({ "MyComponent": null });

    const out = t("the key", { "x": Reflect<number>() });

    assert<Equals<typeof out, string>>();
}

{
    const { useTranslation } = createI18nApi<
        | ["MyComponent1", "key1" | "key2" | ["key3", { x: number }]]
        | ["MyComponent2", "keyA" | ["keyB", { str: string }] | "keyC"]
    >()(
        {
            "languages": ["en", "fr"] as const,
            "fallbackLanguage": "en" as const,
            "doPersistLanguageInLocalStorage": false,
        },
        {
            "en": {
                "MyComponent1": {
                    "key1": Reflect<string>(),
                    "key2": Reflect<string>(),
                    "key3": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<JSX.Element>();
                    },
                },
                "MyComponent2": {
                    "keyA": Reflect<string>(),
                    "keyB": ({ str }) => {
                        assert<Equals<typeof str, string>>();
                        return Reflect<JSX.Element>();
                    },
                    "keyC": Reflect<string>(),
                },
            },
            "fr": {
                "MyComponent1": {
                    "key1": Reflect<string>(),
                    "key2": Reflect<string>(),
                    "key3": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<string>();
                    },
                },
                "MyComponent2": {
                    "keyA": Reflect<string>(),
                    "keyB": ({ str }) => {
                        assert<Equals<typeof str, string>>();
                        return Reflect<JSX.Element>();
                    },
                    "keyC": undefined,
                },
            },
        },
    );

    {
        const { t } = useTranslation({ "MyComponent1": null });

        {
            const text = t("key1");

            assert<Equals<typeof text, string>>();
        }

        {
            const text = t("key2");

            assert<Equals<typeof text, string>>();
        }

        {
            const text = t("key3", { "x": Reflect<number>() });

            assert<Equals<typeof text, string | JSX.Element>>();
        }
    }

    {
        const { t } = useTranslation({ "MyComponent2": null });

        {
            const text = t("keyA");

            assert<Equals<typeof text, string>>();
        }

        {
            const text = t("keyB", { "str": Reflect<string>() });

            assert<Equals<typeof text, JSX.Element>>();
        }

        {
            const text = t("keyC");

            assert<Equals<typeof text, string>>();
        }
    }
}
