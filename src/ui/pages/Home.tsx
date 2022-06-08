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
import demo3Mp4Url from "ui/assets/demo_3.mp4";
import demo3WebmUrl from "ui/assets/demo_3.webm";
import { GlArticle } from "gitlanding/GlArticle";
import { playgroundUrl, docsUrl } from "../router";
import { GlCheckList } from "gitlanding/GlCheckList";
import { GlSectionDivider } from "gitlanding/GlSectionDivider";


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
                            "type": "video/mp4",
                        },
                        {
                            "src": demo1WebmUrl,
                            "type": "video/webm",
                        },
                    ],
                    "hasShadow": true,
                }}
                hasLinkToSectionBellow={true}
                classes={{
                    "subtitle": classes.heroSubtitle,
                    "imageWrapper": classes.heroImageWrapper,
                    "textWrapper": classes.heroTextWrapper,
                    "illustration": classes.heroIllustration,
                }}
            />
            <GlArticle
                id="firstSection"
                title={t("article title")}
                body={t("article body")}
                buttonLabel={t("try now") + " 🚀"}
                buttonLink={{ href: playgroundUrl }}
                classes={{
                    video: classes.articleVideo,
                }}
                illustration={{
                    type: "video",
                    sources: [
                        {
                            "src": demo2Mp4Url,
                            "type": "video/mp4",
                        },
                        {
                            "src": demo2WebmUrl,
                            "type": "video/webm",
                        },
                    ],
                }}
                hasAnimation={true}
                illustrationPosition="left"
            />
            <GlArticle
                title={t("article 2 title") + " 🦾"}
                body={t("article 2 body", { "copilotUrl": "https://copilot.github.com/" })}
                buttonLabel={t("see documentation")}
                buttonLink={{ "href": docsUrl }}
                classes={{
                    "video": classes.articleVideo2,
                }}
                illustration={{
                    type: "video",
                    sources: [
                        {
                            "src": demo3Mp4Url,
                            "type": "video/mp4",
                        },
                        {
                            "src": demo3WebmUrl,
                            "type": "video/webm",
                        },
                    ],
                }}
                hasAnimation={true}
                illustrationPosition="right"
            />
            <GlSectionDivider />
            <GlCheckList
                heading={t("production ready")}
                hasAnimation={true}
                elements={[
                    {
                        "title": t("bp title 1"),
                        "description": t("bp description 1", { "nextUrl": "https://nextjs.org/", "demoNextUrl": "https://ssr.i18nifty.dev" })
                    },
                    {
                        "title": t("bp title 2"),
                        "description": t("bp description 2")
                    },
                    {
                        "title": t("bp title 3"),
                        "description": t("bp description 3")
                    },
                    {
                        "title": t("bp title 4"),
                        "description": t("bp description 4")
                    },
                    {
                        "title": t("bp title 5"),
                        "description": t("bp description 5", { "hreflangImgUrl":"https://user-images.githubusercontent.com/6702424/172121583-524a83d1-7283-4964-8fd1-a447f1a20be1.png",
                        "youtubeVideoUrl": "https://youtu.be/isW-Ke-AJJU?t=3356"
                      })
                    },
                    {
                        "title": t("bp title 6"),
                        "description": t("bp description 6")
                    },
                ]}
            />
        </>
    );
}

export const { i18n } = declareComponentKeys<
    | "hero text subtext" 
    | "subTitle" 
    | "article title" 
    | "article body" 
    | "try now"
    | "article 2 title" 
    | { K: "article 2 body"; P: { copilotUrl: string; }; }
    | "see documentation"
    | "production ready"
    | "bp title 1"
    | { K: "bp description 1"; P: { nextUrl: string; demoNextUrl: string; }  }
    | "bp title 2"
    | "bp description 2"
    | "bp title 3"
    | "bp description 3"
    | "bp title 4"
    | "bp description 4"
    | "bp title 5"
    | { K: "bp description 5"; P: { hreflangImgUrl: string; youtubeVideoUrl: string; } }
    | "bp title 6"
    | "bp description 6"
>()({ Home });

const useStyles = makeStyles({ name: { Home } })(theme => ({
    "heroIllustration": {
        "borderRadius": 10,
        //TODO: Remove once gitlanding fixed
        "width": (()=>{

            if( theme.windowInnerWidth > 535 ){
                return 450;
            }

            return undefined;


        })()
    },
    "articleVideo": {
        "maxWidth": 500,
        "borderRadius": 10,
    },
    "articleVideo2": {
        "maxWidth": 700,
        "borderRadius": 10,
    },
    "title2": {
        "color": theme.colors.useCases.typography.textFocus,
        "fontStyle": "italic",
    },
    "heroSubtitle": {
        "color": theme.colors.useCases.typography.textPrimary,
    },
    "heroImageWrapper": {
        ...(() => {
            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return {
                    "paddingRight": 30,
                    "paddingLeft": 30,
                };
            }

            return {};
        })(),
    },
    "heroTextWrapper": {
        ...(() => {
            if (theme.windowInnerWidth >= breakpointsValues.lg) {
                return {
                    "marginLeft": 70,
                };
            }

            return {};
        })(),
    },
}));
