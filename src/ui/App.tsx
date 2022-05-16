import { useEffect, useMemo, memo } from "react";
import { useRoute } from "./router";
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
import bannerDarkUrl from "ui/assets/banner_dark.png";
import bannerLightUrl from "ui/assets/banner_light.png";


const githubRepoUrl = "https://github.com/garronej/i18nifty";

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

    const pageNode = useMemo(() => {
        {
            const Page = Home;

            if (Page.routeGroup.has(route)) {
                return <Page />;
            }
        }

        return <FourOhFour />;
    }, [route]);

    const { classes, theme } = useStyles();

    return (
        <GlTemplate
            header={
                <GlHeader
                    title={<GlLogo logoUrl={theme.isDarkModeEnabled ? bannerDarkUrl : bannerLightUrl} width={100} />}
                    links={[
                        {
                            "label": "GitHub",
                            "href": githubRepoUrl
                        },
                        {
                            "label": t("documentation"),
                            "href": "https://docs.i18nifty.dev",
                        },
                        {
                            "label": t("try it"),
                            "href": "https://stackblitz.com/edit/react-ts-m4d8w7?file=components/LanguageSwitch.tsx",
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
        >
            {pageNode}
        </GlTemplate>
    );
});

export const { i18n } = declareComponentKeys<
    | "documentation" 
    | "try it" 
>()({ App });

const useStyles = makeStyles({ "name": { App } })(theme => ({
    "languageSelect": {
        "marginLeft": theme.spacing(3),
        "display": (() => {

            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return undefined;
            }

            return "none";

        })()
    }
}));
