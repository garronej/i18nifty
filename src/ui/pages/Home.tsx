import { createGroup } from "type-route";
import { routes } from "../router";
import { GlHero } from "gitlanding/GlHero";
import { GlHeroText } from "gitlanding/GlHero/GlHeroText";
import { Text } from "ui/theme";
import { useTranslation } from "ui/i18n";
import { makeStyles } from "../theme";
import { breakpointsValues } from "onyxia-ui";
import { declareComponentKeys } from "i18nifty";
import demo1Mp4Url from "ui/assets/demo_1.mp4";
import demo1WebmUrl from "ui/assets/demo_1.webm";
import demo2Mp4Url from "ui/assets/demo_2.mp4";
import demo2WebmUrl from "ui/assets/demo_2.webm";
import { GlIllustration } from "gitlanding/GlIllustration";
import { GlArticle } from "gitlanding/GlArticle";
import { playgroundUrl } from "../router";

Home.routeGroup = createGroup([routes.home]);

export function Home() {
    const { t } = useTranslation({ Home });
    const { classes } = useStyles();


    return (
        <>
            <GlHero
                title={
                    <>
                        <GlHeroText>i18nifty</GlHeroText>
                        <Text typo="display heading" className={classes.title2}>
                            {t("hero text subtext")}
                        </Text>
                    </>
                }
                subTitle={t("subTitle")}
                illustration={{
                    "type": "video",
                    "sources": [
                        {
                            "src": demo1Mp4Url,
                            "type": 'video/mp4; codecs="hvc1"',
                        },
                        {
                            "src": demo1WebmUrl,
                            "type": "video/webm",
                        }
                    ]
                }}
                hasLinkToSectionBellow={true}
                hasIllustrationShadow={true}
                classes={{
                    "subtitle": classes.heroSubtitle,
                    "imageWrapper": classes.heroImageWrapper,
                    "textWrapper": classes.heroTextWrapper,
                    "image": classes.heroImage
                }}
            />
            <GlArticle
                id="firstSection"
                title={t("article title")}
                body={t("article body")}
                buttonLabel={t("try now")}
                buttonLink={{ "href": playgroundUrl }}
                illustration={
                    <GlIllustration
                        hasShadow={false}
                        type="video"
                        height={500}
                        sources={[
                            {
                                "src": demo2Mp4Url,
                                "type": 'video/mp4; codecs="hvc1"',
                            },
                            {
                                "src": demo2WebmUrl,
                                "type": "video/webm",
                            },
                        ]}
                    />
                }
                hasAnimation={true}
                illustrationPosition="right"
            />
        </>

    );
}




export const { i18n } = declareComponentKeys<
    "hero text subtext" |
    "subTitle" |
    "article title" |
    "article body" |
    "try now"
>()({ Home });

const useStyles = makeStyles({ "name": { Home } })(theme => ({
    "heroImage": {
        "borderRadius": 10
    },
    "title2": {
        "color": theme.colors.useCases.typography.textFocus,
        "fontStyle": "italic"
    },
    "heroSubtitle": {
        "color": theme.colors.useCases.typography.textPrimary
    },
    "heroImageWrapper": {
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
    "heroTextWrapper": {
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
