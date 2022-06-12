
import { createI18nApi, declareComponentKeys } from "i18nifty";
import { languages, fallbackLanguage } from "./type";
export { declareComponentKeys };


export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
  useTranslation,
  resolveLocalizedString,
  useLang,
  $lang,
  useResolveLocalizedString,
  useIsI18nFetching
} = createI18nApi<
  | typeof import('../components/MyComponent').i18n
  | typeof import('../components/MyOtherComponent').i18n
>()(
  {
    languages,
    fallbackLanguage
  },
  {
    "en": ()=>import("./resources/en").then(({ translations }) => translations),
    "fr": () => import("./resources/fr").then(({ translations }) => translations),
    "zh-CN": () => import("./resources/zh-CN").then(({ translations }) => translations)
  }
);
