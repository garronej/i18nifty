# LocalizedString

A localized string is a common type that represent either a plain string or a map lang -> text.

```typescript
type LocalizedString = string | Partial<Record<"en" | "fr", string>>;

//You can import your tailor-made localized string with
import type { LocalizedString } from "i18n";

//Example of LocalizedStrings:

const name: LocalizedString = "A text always in english";

const description: LocalizedString = {
    "en": "TypeScript module for internationalization",
    "fr": "Module TypeScript pour l'internationalisation"
};
```

### resolveLocalizedString

```typescript
import { resolveLocalizedString, type LocalizedString } from "i18n";

{

//Usually received from an API
const localizedString: LocalizedString = {
    "en": "Hello",
    "fr": "Bonjour"
};

//Assuming the current lang is "en" text will be "Hello"
const text = resolveLocalizedString(localizedString);

}

{

const localizedString: LocalizedString = "Hello";

//The text will be "Hello"
const text = resolveLocalizedString(localizedString);

}


{

//Usually received from an API
const localizedString: LocalizedString = {
    "en": "Hello",
    "fr": "Bonjour"
};

//Assuming the current lang is "en"
//node === <>Hello</>
//Assuming the current lang is "fr"
//node === <>Bonjour</>
//Assuming the current lang is "it" and the fallback language is "en"
//node === <span lang="en">Hello</span>
const node = resolveLocalizedString(
    localizedString, 
    { "labelWhenMismatchingLanguage": true }
);


}

{

//Usually received from an API
const localizedString: LocalizedString = "Hello";

//Assuming the current lang is "en" and the fallback lang is "en"
//node === <>Hello</>
//Assuming the current lang is not "en" and the fallback lang is not "en"
//node === <span lang="en">Hello</>
const node = resolveLocalizedString(
    localizedString, 
    { "labelWhenMismatchingLanguage": true }
);

//NOTE: By default when the localizedString is a plain string we assume
// it's in the fallbackLanguage. You can configure this behavior by using:
// { "labelWhenMismatchingLanguage": { "ifStringAssumeLanguage": "it" } }
// In this case we assume all non-internationalized strings are in italian
// and we must label them as such whenever the current language isn't Italian.

}


```

{% hint style="warning" %}
Do not use resolveLocalizedString in a react component. When the language changes the component won't be rerendered. Use [useResolveLocalizedString](localizedstring.md#useresolvelocalizedstring) instead.
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

    //NOTE: Optionally useResolveLocalizedString accept 
    // { labelWhenMismatchingLanguage: boolean | { ifStringAssumeLanguage: Language; }}
    // as argument, see above section for more details.  
    const { resolveLocalizedString } = useResolveLocalizedString();

    return (
        <span>{resolveLocalizedString(description)}</span>
    );
    
}
```
