import { createI18nApi, declareComponentKeys } from "i18nifty";
export { declareComponentKeys };

//List the languages you with to support
export const languages = ["en", "fr", "zh-CN"] as const;

//If the user's browser language doesn't match any
//of the languages above specify the language to fallback to:
export const fallbackLanguage = "en";

export type Language = (typeof languages)[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
    useTranslation,
    resolveLocalizedString,
    useLang,
    $lang,
    useResolveLocalizedString,
    /** For use outside of React */
    getTranslation
} = createI18nApi<
    | typeof import("./components/MyComponent").i18n
    | typeof import("./components/MyOtherComponent").i18n
>()(
    {
        languages,
        fallbackLanguage
    },
    {
        "en": {
            "MyComponent": {
                "greeting": ({ who }) => `Hello ${who}`,
                "how are you": "How are you feeling today?",
                "any questions ?": (
                    <>
                        Any <b>questions</b>?
                    </>
                ),
                "learn more": ({ href }) => (
                    <>
                        Learn more about&nbsp;
                        <a href={href}>this website</a>.
                    </>
                )
            },
            "MyOtherComponent": {
                "open": "Open",
                "delete": "Delete (not yet translated)",
                "unread messages": ({ howMany }) => {
                    switch (howMany) {
                        case 0:
                            return "You don't have any new message";
                        case 1:
                            return "You have a new message";
                        default:
                            return `You have ${howMany} new messages`;
                    }
                }
            }
        },
        "fr": {
            /* spell-checker: disable */
            "MyComponent": {
                "greeting": ({ who }) => `Bonjour ${who}`,
                "any questions ?": (
                    <>
                        Des <b>questions</b>?
                    </>
                ),
                "how are you": "Comment vous sentez vous au jour d'hui?",
                "learn more": ({ href }) => (
                    <>
                        En savoir plus à propos de&nbsp;
                        <a href={href}>ce site web</a>.
                    </>
                )
            },
            "MyOtherComponent": {
                "open": "Ouvrir",
                //We will translate this later, for now, fallback to english
                "delete": undefined,
                "unread messages": ({ howMany }) => {
                    switch (howMany) {
                        case 0:
                            return "Vous n'avez pas de nouveau message";
                        case 1:
                            return "Vous avez un nouveau message";
                        default:
                            return `Vous avez ${howMany} nouveau messages`;
                    }
                }
            }
            /* spell-checker: enable */
        },
        //We are waiting for the Chinese translation
        "zh-CN": {
            "MyComponent": {
                "greeting": undefined,
                "any questions ?": undefined,
                "how are you": undefined,
                "learn more": undefined
            },
            "MyOtherComponent": {
                "open": undefined,
                "delete": undefined,
                "unread messages": undefined
            }
        }
    }
);
