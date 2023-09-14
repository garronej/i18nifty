import type { Translations } from "../types";

export const translations: Translations<"fr"> = {
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
};
