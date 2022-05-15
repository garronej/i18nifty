import {
    createThemeProvider,
    defaultGetTypographyDesc
} from "onyxia-ui";
import { createIcon } from "onyxia-ui/Icon";
import { createIconButton } from "onyxia-ui/IconButton";
import { createButton } from "onyxia-ui/Button";
import { createText } from "onyxia-ui/Text";
import { createMakeStyles } from "tss-react/compat";
import type { ThemeProviderProps } from "onyxia-ui";
import { createPageHeader } from "onyxia-ui/PageHeader";
import type { Param0 } from "tsafe/Param0";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { createButtonBarButton } from "onyxia-ui/ButtonBarButton";
import { createLanguageSelect } from "onyxia-ui/LanguageSelect";
import type { Language } from "ui/i18n";
import { createOnyxiaSplashScreenLogo } from "onyxia-ui/lib/SplashScreen";

export const { ThemeProvider, useTheme } = createThemeProvider({
    "getTypographyDesc": params => ({
        ...defaultGetTypographyDesc(params),
        "fontFamily": '"Work Sans", sans-serif',
        //"fontFamily": 'Marianne, sans-serif',
    })
});

export const { makeStyles, useStyles } = createMakeStyles({ useTheme });

/** @see: <https://material-ui.com/components/material-icons/> */
export const { Icon } = createIcon({
    "accessTime": AccessTimeIcon,
    "sentimentSatisfied": SentimentSatisfiedIcon,
});

export type IconId = Param0<typeof Icon>["iconId"];

export const { IconButton } = createIconButton({ Icon });
export const { Button } = createButton({ Icon });
export const { Text } = createText({ useTheme });

const { OnyxiaSplashScreenLogo } = createOnyxiaSplashScreenLogo({ useTheme });

export const splashScreen: ThemeProviderProps["splashScreen"] = {
    "Logo": OnyxiaSplashScreenLogo,
    "minimumDisplayDuration": 0,
};

export const { PageHeader } = createPageHeader({ Icon });

export const { ButtonBarButton } = createButtonBarButton({ Icon });

export const { LanguageSelect } = createLanguageSelect<Language>({
    "languagesPrettyPrint": {
        "en": "English",
        "fr": "Français",
        "zh-CN": "简体中文"
    }
});
