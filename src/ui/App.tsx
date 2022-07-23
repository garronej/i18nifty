import { useEffect, memo } from "react";
import { useRoute, githubRepoUrl, docsUrl, playgroundUrl } from "./router";
import { FourOhFour } from "./pages/FourOhFour";
import { GlTemplate } from "gitlanding/GlTemplate";
import { useSplashScreen } from "onyxia-ui";
import { Home } from "./pages/Home";
import { GlHeader } from "gitlanding/GlHeader";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "ui/theme";
import { LanguageSelect } from "ui/theme";
import { useLang } from "ui/i18n";
import { breakpointsValues } from "onyxia-ui";
import { declareComponentKeys } from "i18nifty";
import { GlLogo } from "gitlanding/utils/GlLogo";
import { GlFooter } from "gitlanding/GlFooter";
import bannerDarkUrl from "ui/assets/banner_dark.png";
import bannerLightUrl from "ui/assets/banner_light.png";

/* spell-checker: disable */
export const App = memo(() => {
    const route = useRoute();

    const { lang, setLang } = useLang();

    {
        const { hideRootSplashScreen } = useSplashScreen();

        useEffect(() => {
            hideRootSplashScreen();
        }, []);
    }

    const { t } = useTranslation({ App });

    const { classes, theme } = useStyles();

    return (
        <GlTemplate
            header={
                <GlHeader
                    title={
                        <GlLogo
                            logoUrl={
                                theme.isDarkModeEnabled ? bannerDarkUrl : bannerLightUrl
                            }
                            width={150}
                        />
                    }
                    links={[
                        {
                            "label": "GitHub",
                            "href": githubRepoUrl,
                        },
                        {
                            "label": t("documentation"),
                            "href": docsUrl,
                        },
                        {
                            "label": t("try it"),
                            "href": playgroundUrl,
                        },
                    ]}
                    enableDarkModeSwitch={true}
                    githubRepoUrl={githubRepoUrl}
                    githubButtonSize="large"
                    showGithubStarCount={true}
                    customItemEnd={
                        <LanguageSelect
                            className={classes.languageSelect}
                            language={lang}
                            onLanguageChange={setLang}
                            variant="big"
                        />
                    }
                />
            }
            headerOptions={{
                "position": "sticky",
                "isRetracted": "smart",
            }}
            footer={
                <GlFooter
                    bottomDivContent={`[GitHub](${githubRepoUrl}) - [Documentation](${docsUrl}) - [${t(
                        "edit this website",
                    )}](${githubRepoUrl}/blob/landingpage/src/ui/i18n.tsx)`}
                    links={[
                        {
                            "href": "https://www.npmjs.com/package/i18nifty",
                            "label": (
                                <img
                                    src="https://img.shields.io/npm/dw/i18nifty"
                                    alt=""
                                />
                            ),
                        },
                        {
                            "href": `${githubRepoUrl}/blob/main/LICENSE`,
                            "label": (
                                <img src="https://img.shields.io/npm/l/i18nifty" alt="" />
                            ),
                        },
                    ]}
                />
            }
        >
            {(() => {
                {
                    const Page = Home;

                    if (Page.routeGroup.has(route)) {
                        return <Page />;
                    }
                }

                return <FourOhFour />;
            })()}
        </GlTemplate>
    );
});

export const { i18n } = declareComponentKeys<
    "documentation" | "try it" | "edit this website"
>()({
    App,
});

const useStyles = makeStyles({ name: { App } })(theme => ({
    languageSelect: {
        display: (() => {
            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return undefined;
            }

            return "none";
        })(),
    },
}));
