export type { LocalizedString } from "./LocalizedString";
import { createResolveLocalizedStringFactory } from "./LocalizedString";

/** @see <https://docs.i18nifty.dev/api-reference/localizedstring> */
export const { createResolveLocalizedString } =
    createResolveLocalizedStringFactory({
        "createJsxElement": ({ text, lang }) =>
            lang === undefined ? <>{text}</> : <span lang={lang}>{text}</span>
    });
