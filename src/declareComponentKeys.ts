import { Reflect } from "tsafe/Reflect";

/** @see <https://docs.i18nifty.dev> */
export function declareComponentKeys<
    Key extends string | [string, Record<string, any>],
>() {
    return function <ComponentName extends string>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        componentNameAsKey: Record<ComponentName, unknown>,
    ) {
        //NOTE: Just to prevent unused warning.
        componentNameAsKey;

        return {
            "i18n": Reflect<[ComponentName, Key]>(),
        };
    };
}
