import { assert } from "tsafe/assert";
import { is } from "tsafe/is";
import { noUndefined } from "tsafe/noUndefined";

export type LocalizedString<Language extends string> =
    | string
    | Partial<Record<Language, string>>;

/** Note react as dependency injection */
export function createResolveLocalizedStringFactory<JSXElement>(params: {
    createJsxElement: (params: { text: string; lang?: string }) => JSXElement;
}) {
    const { createJsxElement } = params;

    function createResolveLocalizedString<Language extends string>(params: {
        currentLanguage: Language;
        fallbackLanguage: Language;
        /** default: false */
        labelWhenMismatchingLanguage?: false;
    }): {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => string;
    };
    function createResolveLocalizedString<Language extends string>(params: {
        currentLanguage: Language;
        fallbackLanguage: Language;
        /** default: false */
        labelWhenMismatchingLanguage:
            | true
            | {
                  /* if true fallbackLanguage */
                  ifStringAssumeLanguage: Language;
              };
    }): {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => JSXElement;
        resolveLocalizedStringDetailed: (
            localizedString: LocalizedString<Language>
        ) => {
            spanLangAttrValue: Language | undefined;
            str: string;
        };
    };
    function createResolveLocalizedString<Language extends string>(params: {
        currentLanguage: Language;
        fallbackLanguage: Language;
        /** default: false */
        labelWhenMismatchingLanguage?:
            | boolean
            | { ifStringAssumeLanguage: Language };
    }): {
        resolveLocalizedString: (
            localizedString: LocalizedString<Language>
        ) => string | JSXElement;
        resolveLocalizedStringDetailed?: (
            localizedString: LocalizedString<Language>
        ) => {
            spanLangAttrValue: Language | undefined;
            str: string;
        };
    } {
        const {
            currentLanguage,
            fallbackLanguage,
            labelWhenMismatchingLanguage = false
        } = params;

        type LocalizedString = string | Partial<Record<Language, string>>;

        function resolveLocalizedStringDetailed(
            localizedString: LocalizedString
        ): {
            spanLangAttrValue: Language | undefined;
            str: string;
        } {
            if (typeof localizedString === "string") {
                const { ifStringAssumeLanguage } =
                    typeof labelWhenMismatchingLanguage === "object"
                        ? labelWhenMismatchingLanguage
                        : { ifStringAssumeLanguage: fallbackLanguage };

                if (currentLanguage === ifStringAssumeLanguage) {
                    return {
                        "str": localizedString,
                        "spanLangAttrValue": undefined
                    };
                }

                return {
                    "str": localizedString,
                    "spanLangAttrValue": ifStringAssumeLanguage
                };
            }

            localizedString = noUndefined(localizedString);

            {
                const text = localizedString[currentLanguage];

                if (typeof text === "string") {
                    return {
                        "str": text,
                        "spanLangAttrValue": undefined
                    };
                }
            }

            {
                const text = localizedString[fallbackLanguage];

                if (typeof text === "string") {
                    return {
                        "str": text,
                        "spanLangAttrValue": fallbackLanguage
                    };
                }
            }

            const [lang, text] = Object.entries(localizedString)[0] ?? [];

            assert(typeof text === "string", "Must contain at least one value");

            assert(is<Language>(lang));

            return {
                "str": text,
                "spanLangAttrValue": lang
            };
        }

        function resolveLocalizedString(
            localizedString: LocalizedString
        ): string | JSXElement {
            const { str, spanLangAttrValue } =
                resolveLocalizedStringDetailed(localizedString);

            return labelWhenMismatchingLanguage !== false
                ? createJsxElement({ "text": str, "lang": spanLangAttrValue })
                : str;
        }

        return { resolveLocalizedString, resolveLocalizedStringDetailed };
    }

    return { createResolveLocalizedString };
}
