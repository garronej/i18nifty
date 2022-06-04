import { createI18nApiFactory } from "./createI18nApi";
import { createUseLang } from "./useLang_ssr";
import type { NextComponentType } from "next";
import type DefaultApp from "next/app";

export const { createI18nApi } = createI18nApiFactory<{
    type: "ssr";
    NextComponentType: NextComponentType<any, any, any>;
    DefaultAppType: typeof DefaultApp;
}>({
    createUseLang,
});
