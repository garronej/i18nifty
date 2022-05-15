import { createGroup } from "type-route";
import { routes } from "../router";
import { GlHero } from "gitlanding/GlHero";
import { GlHeroText } from "gitlanding/GlHero/GlHeroText";
import dragonHoldingComputerSvgUrl from "ui/assets/svg/DragonHoldingComputer.svg";
import { Text } from "ui/theme";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "../theme";
import { breakpointsValues } from "onyxia-ui";
import { GlArticle } from "gitlanding/GlArticle";
import { GlIllustration } from "gitlanding/GlIllustration";
import toilLightPngUrl from "ui/assets/img/ToilLight.png";
import { declareComponentKeys } from "i18nifty";

Home.routeGroup = createGroup([routes.home]);

export function Home() {
    const { t } = useTranslation({ Home });
    const { classes, theme } = useStyles();

    return (
        <>
            <GlHero
                title={
                    <>
                        <GlHeroText>{t("hero text")}</GlHeroText>
                        <Text typo="display heading" className={classes.title2}>{t("hero text subtext")}</Text>
                    </>
                }
                subTitle={t("subTitle")}
                illustration={{
                    "type": "image",
                    "imageSrc": dragonHoldingComputerSvgUrl
                }}
                hasLinkToSectionBellow={true}
                hasIllustrationShadow={false}
                classes={{
                    "subtitle": classes.subtitle,
                    "imageWrapper": classes.imageWrapper,
                    "textWrapper": classes.textWrapper,
                }}
            />
            <GlArticle
                id="firstSection"
                title={t("what is onyxia title")}
                body={t("what is onyxia body")}
                buttonLabel={t("install now")}
                buttonLink={{ "href": "https://install.onyxia.sh" }}
                illustration={
                    <GlIllustration
                        hasShadow={false}
                        type="image"
                        url={theme.isDarkModeEnabled ? toilLightPngUrl : toilLightPngUrl}
                    />
                }
                hasAnimation={true}
                illustrationPosition="right"
            />
        </>

    );
}



const useStyles = makeStyles({ "name": { Home } })(theme => ({
    "title2": {
        "color": theme.colors.useCases.typography.textFocus,
        "fontStyle": "italic"
    },
    "subtitle": {
        "color": theme.colors.useCases.typography.textPrimary
    },
    "imageWrapper": {
        ...(() => {

            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return {
                    "paddingRight": 30,
                    "paddingLeft": 30
                };

            }

            return {};

        })()
    },
    "textWrapper": {
        ...(() => {

            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return {
                    "marginLeft": 70
                };

            }

            return {};

        })()
    }
}));

export const { i18n } = declareComponentKeys<
    "hero text" | 
    "hero text subtext" | 
    "subTitle" |
    "what is onyxia title" |
    "what is onyxia body" |
    "install now"
>()({ Home });
