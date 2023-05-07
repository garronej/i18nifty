import { assert } from "tsafe/assert";
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
    } {
        const {
            currentLanguage,
            fallbackLanguage,
            labelWhenMismatchingLanguage = false
        } = params;

        type LocalizedString = string | Partial<Record<Language, string>>;

        function resolveLocalizedString(
            localizedString: LocalizedString
        ): string | JSXElement {
            if (typeof localizedString === "string") {
                if (labelWhenMismatchingLanguage === false) {
                    return localizedString;
                }

                const { ifStringAssumeLanguage } =
                    typeof labelWhenMismatchingLanguage === "object"
                        ? labelWhenMismatchingLanguage
                        : { ifStringAssumeLanguage: fallbackLanguage };

                if (currentLanguage === ifStringAssumeLanguage) {
                    return createJsxElement({ "text": localizedString });
                }

                return createJsxElement({
                    "text": localizedString,
                    "lang": ifStringAssumeLanguage
                });
            }

            localizedString = noUndefined(localizedString);

            {
                const text = localizedString[currentLanguage];

                if (typeof text === "string") {
                    return labelWhenMismatchingLanguage !== false
                        ? createJsxElement({ text })
                        : text;
                }
            }

            {
                const text = localizedString[fallbackLanguage];

                if (typeof text === "string") {
                    return labelWhenMismatchingLanguage !== false
                        ? createJsxElement({ text, "lang": fallbackLanguage })
                        : text;
                }
            }

            const [lang, text] = Object.entries(localizedString)[0] ?? [];

            assert(typeof text === "string", "Must contain at least one value");

            return labelWhenMismatchingLanguage !== false
                ? createJsxElement({ text, lang })
                : text;
        }

        return { resolveLocalizedString };
    }

    return { createResolveLocalizedString };
}
