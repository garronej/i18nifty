
import { createI18nApi } from "i18nts";

export const languages = ["en", "fr"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export const { useTranslation } = createI18nApi<
	typeof import("./Component1").i18nDeclaration |
	typeof import("./Component2").i18nDeclaration
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
			}
		}
	}
);


const x = useTranslation("MyComponent1");
