import { memo } from "react";
import { useTranslation } from "ui/i18n";
import { makeStyles, Text } from "../theme";
import { declareComponentKeys } from "i18nifty";

export const FourOhFour = memo(() => {
    const { t } = useTranslation({ FourOhFour });

    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Text typo="page heading">{t("not found")} 😥</Text>
        </div>
    );
});

const useStyles = makeStyles({ "name": { FourOhFour } })(theme => ({
    "root": {
        "height": "100%",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "backgroundColor": theme.colors.useCases.surfaces.background,
    },
}));

export const { i18n } = declareComponentKeys<
    "not found"
>()({ FourOhFour });
