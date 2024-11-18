import { assert, is } from "tsafe/assert";
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
            langAttrValue: Language | undefined;
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
            langAttrValue: Language | undefined;
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
            langAttrValue: Language | undefined;
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
                        "langAttrValue": undefined
                    };
                }

                return {
                    "str": localizedString,
                    "langAttrValue": ifStringAssumeLanguage
                };
            }

            localizedString = noUndefined(localizedString);

            {
                const text = localizedString[currentLanguage];

                if (typeof text === "string") {
                    return {
                        "str": text,
                        "langAttrValue": undefined
                    };
                }
            }

            {
                const text = localizedString[fallbackLanguage];

                if (typeof text === "string") {
                    return {
                        "str": text,
                        "langAttrValue": fallbackLanguage
                    };
                }
            }

            const [lang, text] = Object.entries(localizedString)[0] ?? [];

            assert(typeof text === "string", "Must contain at least one value");

            assert(is<Language>(lang));

            return {
                "str": text,
                "langAttrValue": lang
            };
        }

        function resolveLocalizedString(
            localizedString: LocalizedString
        ): string | JSXElement {
            const { str, langAttrValue } =
                resolveLocalizedStringDetailed(localizedString);

            return labelWhenMismatchingLanguage !== false
                ? createJsxElement({ "text": str, "lang": langAttrValue })
                : str;
        }

        return { resolveLocalizedString, resolveLocalizedStringDetailed };
    }

    return { createResolveLocalizedString };
}
