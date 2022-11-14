import type { KeyToRecord } from "./KeyToRecord";
export type { KeyToRecord };

export type { TranslationFunction } from "./TranslationFunction";

export type ComponentKeyToRecord<
    ComponentKey extends [string, string | { K: string }]
> = {
    [ComponentName in ComponentKey[0]]: KeyToRecord<
        Extract<ComponentKey, [ComponentName, any]>[1]
    >;
};

export type WithOptionalKeys<Declaration> = {
    [ComponentName in keyof Declaration]: {
        [Key in keyof Declaration[ComponentName]]:
            | Declaration[ComponentName][Key]
            | undefined;
    };
};
