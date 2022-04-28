import type { UnionToIntersection } from "./tools/UnionToIntersection";

type ParamsToCallback<Params> = (
    params: Params,
) => JSX.Element extends Params[keyof Params] ? JSX.Element : string;

export type I18nDeclaration<
    ComponentName extends string,
    Key extends string | [string, Record<string, any>],
> = Record<
    ComponentName,
    UnionToIntersection<
        Key extends string
            ? Record<Key, string>
            : Record<Key[0], ParamsToCallback<Key[1]>>
    >
>;

export function i18nDeclare<
    Key extends string | [string, Record<string, any>],
>() {
    return function <ComponentName extends string>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _wrappedComponent: Record<ComponentName, any>,
    ): {
        i18nDeclaration: I18nDeclaration<ComponentName, Key>;
    } {
        return null as any;
    };
}

/*

{
	type Got = ParamsToCallback<{ node: JSX.Element }>;
	type Expected = (params: { node: JSX.Element })=> JSX.Element;

	assert<Equals<Got, Expected>>();

}

{
	type Got = ParamsToCallback<{ str: string }>;
	type Expected = (params: { str: string })=> string;

	assert<Equals<Got, Expected>>();

}

{
	type Got = ParamsToCallback<{ node: React.ReactNode; x: string; }>;
	type Expected = (params: { node: React.ReactNode; x: string; })=> JSX.Element;

	assert<Equals<Got, Expected>>();

}
*/
