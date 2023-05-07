import { createResolveLocalizedStringFactory } from "./LocalizedString";

/** @see <https://docs.i18nifty.dev/api-reference/localizedstring> */
export const { createResolveLocalizedString } =
    createResolveLocalizedStringFactory<never>({
        "createJsxElement": () => {
            throw new Error("No react");
        }
    });
