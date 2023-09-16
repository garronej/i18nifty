/** @see <https://docs.i18nifty.dev> */
export function declareComponentKeys<Key extends string | { K: string }>(): {
    <ComponentName extends string>(
        wrappedComponentName: Record<ComponentName, Function>
    ): {
        i18n: [ComponentName, Key];
    };
    <ComponentName extends string>(componentName: ComponentName): {
        i18n: [ComponentName, Key];
    };
} {
    // @ts-expect-error: We know better
    return () => ({ "i18n": null });
}
