import { createI18nApi } from "i18nifty";

export const languages = ["en", "fr"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const { useTranslation, resolveLocalizedString, useLang, useResolveLocalizedString } = createI18nApi<
	| typeof import("./App").i18n
	| typeof import("./pages/Home").i18n
	| typeof import("./pages/FourOhFour").i18n
	//| typeof import("./MyComponent").i18n
>()(
	{
		languages,
		fallbackLanguage,
		"doPersistLanguageInLocalStorage": true
	},
	{
		"en": {
			"App": {
				"documentation": "Documentation",
				"try it": "Try it",
			},
			"Home": {
				"hero text subtext": "Type-safe internationalization and translation in React",
				"subTitle": "A i18n library designed to leverage TypeScript's type inference capability.",
				"article title": "Localization is much less of a chore when assisted by intellisense.",
				"article body": `With i18nifty you get red squiggly lines wherever translations are missing.  
				When using the translation function you are provided with a list of available keys in the context of a given component.
				`,
				"try now": "Try in a playground"
			},
			"FourOhFour": {
				"not found": "Page not found"
			},
		},
		/* spell-checker: disable */
		"fr": {
			"App": {
				"documentation": "Documentation",
				"try it": "Essayez",
			},
			"Home": {
				"hero text subtext": "Type-safe internationalisation et traduction en React",
				"subTitle": "Une libraire i18n conçu pour tirer profit des capacités d'inférence de TypeScript.",
				"article title": "Guidée par intllisense, la localisation n'est plus autant une corvée.",
				"article body": `Avec i18n, partout où des traductions sont manquante vous aurez du rouge.  
				Quand vous utilisez la fonction de traduction, les clefs disponibles dans le context d'un composant donné vous seront proposé.`,
				"try now": "Essayez dans une sandbox"
			},
			"FourOhFour": {
				"not found": "Page non trouvée",
			},
		},
	}
	/* spell-checker: enable */
);





