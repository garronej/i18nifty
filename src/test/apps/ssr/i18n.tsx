
import { Fragment } from "react";
import { createI18nApi } from "i18nifty/ssr";

//List the languages you with to support
export const languages = ["en", "fr"] as const;

//If the user's browser language doesn't match any
//of the languages above specify the language to fallback to:
export const fallbackLanguage = 'en';

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
  useTranslation,
  resolveLocalizedString,
  useLang,
  evtLang,
  useResolveLocalizedString,
  withLang
} = createI18nApi<
  | typeof import('./components/MyComponent').i18n
  | typeof import('./components/MyOtherComponent').i18n
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
        "learn more": ({ href }) => (
          <Fragment>
            Learn more about&nbsp;
            <a href={href}>this website</a>.
          </Fragment>
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
        "how are you": "Comment vous sentez vous au jour d'hui?",
        "learn more": ({ href }) => (
          <Fragment>
            En savoir plus à propos de&nbsp;
            <a href={href}>ce site web</a>.
          </Fragment>
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
    }
  }
);
