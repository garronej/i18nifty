import type { UnionToIntersection } from "./tools/UnionToIntersection";
import { Reflect } from "tsafe/Reflect";

type ParamsToCallback<Params> = (
    params: Params,
) => JSX.Element extends Params[keyof Params] ? JSX.Element : string;

type MessageByKey<Key extends string | [string, Record<string, any>]> =
    UnionToIntersection<
        Key extends string
            ? Record<Key, string>
            : Record<Key[0], ParamsToCallback<Key[1]>>
    >;

export type I18nDeclaration<
    ComponentName extends string,
    Key extends string | [string, Record<string, any>],
> = Record<ComponentName, MessageByKey<Key>>;

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
            "i18n": Reflect<I18nDeclaration<ComponentName, Key>>(),
        };
    };
}
