
import { createI18nApi } from "i18nifty";

export const languages = ["en", "fr"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export const { useTranslation, resolveLocalizedString, useLng, useResolveLocalizedString } = createI18nApi<
	typeof import("./Component1").i18n |
	typeof import("./Component2").i18n
>()(
	{
		languages,
		fallbackLanguage,
	},
	{
		"en": {
			"MyComponent1": {
				"one thing": "one thing",
				"something else": "something else",
				"yet another thing": ({ name, x }) => `yet another thing ${name} ${x}`,

			},
			"MyComponent2": {
				"ready": "ready",
				"something else": "something else",
				"i am ready to fight": ({ link, x }) => <>i am ready to fight {link} {x}</>,
			}
		},
		"fr": {
			"MyComponent1": {
				"one thing": "une chose",
				"something else": "autre chose",
				"yet another thing": ({ name, x }) => `autre chose ${name} ${x}`,
			},
			"MyComponent2": {
				"ready": "prêt",
				"something else": "autre chose",
				"i am ready to fight": undefined
			}
		}
	}
);



