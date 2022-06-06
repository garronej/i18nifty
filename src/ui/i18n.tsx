/* eslint-disable no-template-curly-in-string */
import { createI18nApi } from "i18nifty";

export const languages = ["en", "fr"] as const;

export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
	useTranslation,
	resolveLocalizedString,
	useLang,
	useResolveLocalizedString,
} = createI18nApi<
	| typeof import("./App").i18n
	| typeof import("./pages/Home").i18n
	| typeof import("./pages/FourOhFour").i18n
>()(
	{
		languages,
		fallbackLanguage,
	},
	{
		"en": {
			"App": {
				"documentation": "Documentation",
				"try it": "Try it",
				"edit this website": "Edit this website"
			},
			"Home": {
				"hero text subtext":
					"Type-safe internationalization and translation in React",
				"subTitle":
					"A i18n library designed to leverage TypeScript's type inference capability.",
				"article title":
					"Localization is much less of a chore when assisted by intellisense.",
				"article body": `TypeScript let you know where and what translations need to be provided while allowing you explicitly fallback to the default language.`,
				"try now": "Try in a playground",
				"bp title 1": "SSR Ready",
				"bp description 1": ({ nextUrl, demoNextUrl})=> `i18nifty features a great [Next.js](${nextUrl}) integration.  
					[See for yourself](${demoNextUrl}).`,
				"bp title 2": "Easy collaboration with non technical peoples",
				"bp description 2": `Everything is in a single file. 
            		Providing a translation is as easy as filling a form.`,
				"bp title 3": "React component and logic",
				"bp description 3": "Freely includes React components such as `<a/>` in your translations and involve JavaScript logic like ```message${plural?'s':''}```.",
				"bp title 4": "Language defaults to browser preference",
				"bp description 4": `Language default to \`navigator.language\` if your app is an SPA or to \`ACCEPT-LANGUAGE\`
            		HTTP Header if it's a Next.js app.`,
				"bp title 5": "SEO",
				"bp description 5": ({ hreflangImgUrl, youtubeVideoUrl }) => `i18nifty automatically generates [\`hreflang\` links in your \`<head>\`](${hreflangImgUrl}) 
            		to [let Google know](${youtubeVideoUrl}) that your site supports multiple languages.  
            		The \`?lang=xx\` URL parameter works out of the box.`,
				"bp title 6": "Selected language persisted across reloads",
				"bp description 6": `The language is persisted across reloads using \`localStorage\` for SPA and 
            		using cookie for Next.js apps.`
			},
			"FourOhFour": {
				"not found": "Page not found",
			},
		},
		/* spell-checker: disable */
		"fr": {
			"App": {
				"documentation": "Documentation",
				"try it": "Essayez",
				"edit this website": "Modifier ce site web"
			},
			"Home": {
				"hero text subtext":
					"Type-safe internationalisation et traduction en React",
				"subTitle":
					"Une libraire i18n conçu pour tirer profit des capacités d'inférence de TypeScript.",
				"article title":
					"Guidée par intllisense, la localisation n'est plus autant une corvée.",
				"article body": `TypeScripTypeScript vous fait savoir où et quelle traduction son manquante tout en vous laissant la possibilité de fournir certaines traductions plus tard.`,
				"try now": "Essayez dans une sandbox",
				"bp title 1": "Compatible avec le SSR",
				"bp description 1": undefined,
				"bp title 2": undefined,
				"bp description 2": undefined,
				"bp title 3": undefined,
				"bp description 3": undefined,
				"bp title 4": undefined,
				"bp description 4": undefined,
				"bp title 5": undefined,
				"bp description 5": undefined,
				"bp title 6": undefined,
				"bp description 6": undefined
			},
			"FourOhFour": {
				"not found": "Page non trouvée",
			},
		},
	},
	/* spell-checker: enable */
);
