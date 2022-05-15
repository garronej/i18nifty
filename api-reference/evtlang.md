---
description: Set the language at any time, from anywhere.
---

# evtLang

`evtLang` enable you to  switch the language without using `useLang` that can only be used in a react component. &#x20;

```tsx
import { evtLang } from "i18n";

setTimeout(
    ()=> {
        console.log(`The app is currently in ${evtLang.state}`);
        console.log("We switch to fr now!");
        //This will trigger components to re-render.
        evtLang.state= "fr";
    },
    30_000
);
```

Have a global callback that is invoked whenever the language is switched.

```typescript
import { evtLang } from "i18n";

evtLang
    .toStateless() //If you remove that line the callback will be called with the initial value
    .attach(lang=> console.log(`The app has just beed switched to ${lang}`));

```

{% hint style="info" %}
`evtLang` is an instance of `StatefulEvt<Language>`. Learn more about [EVT](https://evt.land).
{% endhint %}
