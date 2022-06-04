import { createI18nApiFactory } from "./createI18nApi";
import { createUseLang } from "./useLang_spa";

export const { createI18nApi } = createI18nApiFactory<{ type: "spa" }>({
    createUseLang,
});
