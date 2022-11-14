export function getLanguageBestApprox<Language extends string>(params: {
    languages: readonly Language[];
    languageLike: string;
}): Language | undefined {
    const { languages, languageLike } = params;

    scope: {
        const lang = languages.find(
            lang => lang.toLowerCase() === languageLike.toLowerCase()
        );

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    scope: {
        const iso2LanguageLike = languageLike.split("-")[0].toLowerCase();

        const lang = languages.find(lang =>
            lang.toLowerCase().includes(iso2LanguageLike)
        );

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    return undefined;
}
