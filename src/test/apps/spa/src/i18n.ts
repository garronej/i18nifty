
import type { I18nDeclaration } from "i18n-react-ts";
import type { UnionToIntersection } from "i18n-react-ts/tools/UnionToIntersection";

export const languages = ["en", "fr"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export const { useTranslation, evtLanguage, useLanguage, resolveLocalizedString } = createI18nTools<
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



export function createI18nTools<Declaration extends I18nDeclaration<any,any >>() {
	return function <Language extends string, FallbackLanguage extends Language>(
		params: {
			languages: readonly Language[];
			fallbackLanguage: FallbackLanguage;
		},
		//translations: Record<Language, UnionToIntersection<Declaration>>,
		translations: { [L in Language]: L extends FallbackLanguage ? UnionToIntersection<Declaration> : Partial<UnionToIntersection<Declaration>> }
	) {

		function useTranslation() { }
		function evtLanguage() { }
		function useLanguage() { }
		function resolveLocalizedString() { }

		return { useTranslation, evtLanguage, useLanguage, resolveLocalizedString };

	}
}
