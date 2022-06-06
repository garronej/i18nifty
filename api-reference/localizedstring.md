# LocalizedString

A localized string is a common type that represent either a plane string or a map lang -> text.

```typescript
type LocalizedString = string | Partial<Record<"en" | "fr", string>>;

//You can import your tailor localized string with
import type { LocalizedString } from "i18n";

//Example of LocalizedStrings:

const name: LocalizedString = "i18nifty";

const description: LocalizedString = {
    "en": "TypeScript module for internationalization",
    "fr": "Module TypeScript pour l'internationalisation"
};
```

### resolveLocalizedString

```typescript
import { resolveLocalizedString } from "i18n";

const text = resolveLocalizedString({
    "en": "Hello",
    "fr": "Bonjour"
});

//Assuming the current lang is "en" text will be "Hello"
```

{% hint style="warning" %}
Do not use resolveLocalizedString in a react component. Wen the language changes the component wont be rerendered. Use [useResolveLocalizedString](localizedstring.md#useresolvelocalizedstring) instead.
{% endhint %}

### useResolveLocalizedString

```tsx
import { useResolveLocalizedString } from "i18n";
import type { LocalizedString } from "i18n";

type Props= {
    description: LocalizedString;
};

export function MyComponent(props: Props){

    const { description } = props;

    const { resolveLocalizedString } = useResolveLocalizedString();

    return (
        <span>{resolveLocalizedString(description)}</span>
    );
    
}
```
