import { createI18nApi } from "../../src/createI18nApi";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Reflect } from "tsafe/Reflect";

{
    const i18n = Reflect<
        [
            "MyComponent",
            {
                K: "the key";
                P: { x: number };
            }
        ]
    >();

    const {
        useTranslation,
        $lang,
        resolveLocalizedString,
        useLang,
        useResolveLocalizedString,
        useIsI18nFetching,
        getTranslation,
        ...rest
    } = createI18nApi<typeof i18n>()(
        {
            "languages": ["en"] as const,
            "fallbackLanguage": "en"
        },
        {
            "en": {
                "MyComponent": {
                    "the key": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<string>();
                    },
                    //@ts-expect-error: This key is not declared
                    "not a key": ""
                }
            }
        }
    );

    assert<Equals<typeof rest, {}>>();

    const { t } = useTranslation({ "MyComponent": null });

    const { t: t2 } = getTranslation("MyComponent");

    assert<Equals<typeof t, typeof t2>>();

    const out = t("the key", { "x": Reflect<number>() });

    assert<Equals<typeof out, string>>();
}

{
    const { useTranslation, getTranslation } = createI18nApi<
        | [
              "MyComponent1",
              (
                  | "key1"
                  | { K: "key2"; R: JSX.Element | string }
                  | { K: "key3"; P: { x: number }; R: JSX.Element | string }
              )
          ]
        | [
              "MyComponent2",
              (
                  | "keyA"
                  | { K: "keyB"; P: { str: string }; R: JSX.Element }
                  | "keyC"
              )
          ]
    >()(
        {
            "languages": ["en", "fr"] as const,
            "fallbackLanguage": "en" as const
        },
        {
            "en": () =>
                Promise.resolve({
                    "MyComponent1": {
                        "key1": Reflect<string>(),
                        "key2": Reflect<JSX.Element>(),
                        "key3": ({ x }) => {
                            assert<Equals<typeof x, number>>();
                            return Reflect<JSX.Element>();
                        }
                    },
                    "MyComponent2": {
                        "keyA": Reflect<string>(),
                        "keyB": ({ str }) => {
                            assert<Equals<typeof str, string>>();
                            return Reflect<JSX.Element>();
                        },
                        "keyC": Reflect<string>()
                    }
                }),
            "fr": {
                "MyComponent1": {
                    "key1": Reflect<string>(),
                    "key2": Reflect<string>(),
                    "key3": ({ x }) => {
                        assert<Equals<typeof x, number>>();
                        return Reflect<string>();
                    }
                },
                "MyComponent2": {
                    "keyA": Reflect<string>(),
                    "keyB": ({ str }) => {
                        assert<Equals<typeof str, string>>();
                        return Reflect<JSX.Element>();
                    },
                    "keyC": undefined
                }
            }
        }
    );

    {
        const { t } = useTranslation({ "MyComponent1": null });

        const { t: t2 } = getTranslation("MyComponent1");

        assert<Equals<typeof t, typeof t2>>();

        {
            const text = t("key1");

            assert<Equals<typeof text, string>>();
        }

        {
            const text = t("key2");

            assert<Equals<typeof text, string | JSX.Element>>();
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

    {
        const { t } = useTranslation("MyComponent1");

        const { t: t2 } = getTranslation("MyComponent1");

        assert<Equals<typeof t, typeof t2>>();

        {
            const text = t("key1");

            assert<Equals<typeof text, string>>();
        }

        {
            const text = t("key2");

            assert<Equals<typeof text, string | JSX.Element>>();
        }

        {
            const text = t("key3", { "x": Reflect<number>() });

            assert<Equals<typeof text, string | JSX.Element>>();
        }
    }

    {
        const { t } = useTranslation("MyComponent2");

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
