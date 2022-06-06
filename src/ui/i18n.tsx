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
        en: {
            App: {
                documentation: "Documentation",
                "try it": "Try it",
            },
            Home: {
                "hero text subtext":
                    "Type-safe internationalization and translation in React",
                subTitle:
                    "A i18n library designed to leverage TypeScript's type inference capability.",
                "article title":
                    "Localization is much less of a chore when assisted by intellisense.",
                "article body": `TypeScript let you know where and what translations need to be provided while allowing you explicitly fallback to the default language.`,
                "try now": "Try in a playground",
            },
            FourOhFour: {
                "not found": "Page not found",
            },
        },
        /* spell-checker: disable */
        fr: {
            App: {
                documentation: "Documentation",
                "try it": "Essayez",
            },
            Home: {
                "hero text subtext":
                    "Type-safe internationalisation et traduction en React",
                subTitle:
                    "Une libraire i18n conçu pour tirer profit des capacités d'inférence de TypeScript.",
                "article title":
                    "Guidée par intllisense, la localisation n'est plus autant une corvée.",
                "article body": `TypeScripTypeScript vous fait savoir où et quelle traduction son manquante tout en vous laissant la possibilité de fournir certaines traductions plus tard.`,
                "try now": "Essayez dans une sandbox",
            },
            FourOhFour: {
                "not found": "Page non trouvée",
            },
        },
    },
    /* spell-checker: enable */
);
