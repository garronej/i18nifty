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
                "edit this website": "Edit this website",
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
                "article 2 title": "Enable Copilot!",
                "article 2 body": ({ copilotUrl }) =>
                    `With [GitHub Copilot](${copilotUrl}) enabled, translation is mostly a matter of supervision, even when there is logic involved!`,
                "see documentation": "Documentation",
                "production ready": "Production ready",
                "bp title 1": "SSR Ready",
                "bp description 1": ({
                    nextUrl,
                    demoNextUrl,
                }) => `i18nifty features a great [Next.js](${nextUrl}) integration.  
					First print in the user's language read from HTTP header Accept-Language [See for yourself](${demoNextUrl}).`,
                "bp title 2": "Only the user's language translations downloaded",
                "bp description 2": ({
                    playgroundUrl,
                }) => `i18nifty provide an option for implementing [code splitting](${playgroundUrl}), so that you avoid bundling every all translations for all languages
				in the main JS bundle. (Currently only available for SPAs).`,
                "bp title 3": "React component and JS logic",
                "bp description 3":
                    "Freely includes React components such as `<a/>` in your translations and involve JavaScript logic like ```message${plural?'s':''}```.",
                "bp title 4": "Language defaults to browser preference",
                "bp description 4": `Language default to \`navigator.language\` if your app is an SPA or to \`ACCEPT-LANGUAGE\`
            		HTTP Header if it's a Next.js app.`,
                "bp title 5": "SEO",
                "bp description 5": ({
                    hreflangImgUrl,
                    youtubeVideoUrl,
                }) => `i18nifty automatically generates [\`hreflang\` links in your \`<head>\`](${hreflangImgUrl}) 
            		to [let Google know](${youtubeVideoUrl}) that your site supports multiple languages.  
            		The \`?lang=xx\` URL parameter works out of the box.`,
                "bp title 6": "Selected language persisted across reloads",
                "bp description 6": `The language is persisted across reloads using \`localStorage\` for SPA and 
            		using cookie for Next.js apps.`,
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
                "edit this website": "Modifier ce site web",
            },
            "Home": {
                "hero text subtext":
                    "Type-safe internationalisation et traduction en React",
                "subTitle":
                    "Une librairie i18n conçue pour tirer profit des capacités d'inférence de TypeScript.",
                "article title":
                    "Guidée par IntelliSense, la localisation n'est plus autant une corvée.",
                "article body": `TypeScript vous permet de savoir où et quelles traductions sont manquantes, tout en vous laissant la possibilité de fournir certaines traductions plus tard`,
                "try now": "Essayez dans une sandbox",
                "article 2 title": "Activez Copilot!",
                "article 2 body": ({ copilotUrl }) =>
                    `Avec [GitHub Copilot](${copilotUrl}) activé, la traduction est généralement un travail de supervision, même quand il y a de la logique JavaScript!`,
                "see documentation": "Documentation",
                "production ready": "Prêt pour la prod",
                "bp title 1": "Compatible avec le SSR",
                "bp description 1": ({
                    nextUrl,
                    demoNextUrl,
                }) => `i18nifty s'intègre parfaitement avec [Next.js](${nextUrl}).  
					Premier print dans la langue de l'utilisateur lu depuis le HTTP header Accept-Language.
					[Jugez vous-même](${demoNextUrl}).`,
                "bp title 2":
                    "Selement les traductions pour une langue sont téléchargées",
                "bp description 2": ({
                    playgroundUrl,
                }) => `i18nifty permet de mettre en œuvre le [code splitting](${playgroundUrl}) afin d'éviter que toutes les traductions
				dans toutes les langues soit incluse dans le bundle JS principale (Seulement pour les SPA pour l'instant).`,
                "bp title 3": "Composants React et logique JS",
                "bp description 3":
                    "Utilisez librement des composants tels que `<a/>` dans vos traductions et faites intervenir de la logique JS tels que ```message${plural?'s':''}```.",
                "bp title 4": "Langue par défaut selon les préférences navigateur.",
                "bp description 4": `\`navigator.language\` est la langue par défaut si votre app est une SPA,
					sinon, le Header HTTP \`ACCEPT-LANGUAGE\` sera utilisé si vous utilisez Next.js.`,
                "bp title 5": "SEO",
                "bp description 5": ({
                    hreflangImgUrl,
                    youtubeVideoUrl,
                }) => `i18nifty génère automatiquement des liens [\`hreflang\` dans votre \`<head>\`](${hreflangImgUrl}) 
            		afin de [faire savoir a Google](${youtubeVideoUrl}) que votre site est disponible dans plusieurs langues.  
            		Le paramètre d'URL \`?lang=xx\` fonctionne par défaut.`,
                "bp title 6":
                    "Les rechargements de pages n'affectent pas le choix de la langue",
                "bp description 6": `La langue sélectionnée est conservée via le \`localStorage\` dans les SPA
				et par le biais de cookies pour Next.js`,
            },
            "FourOhFour": {
                "not found": "Page non trouvée",
            },
        },
    },
    /* spell-checker: enable */
);
