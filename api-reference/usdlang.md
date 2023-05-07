---
description: Set the language at any time, from anywhere.
---

# $lang

`evtLang` enable you to  switch the language without using `useLang` that can only be used in a react component. &#x20;

```tsx
import { $lang } from "i18n";

setTimeout(
    ()=> {
        console.log(`The app is currently in ${evtLang.state}`);
        console.log("We switch to fr now!");
        //This will trigger components to re-render.
        $lang.current= "fr";
    },
    30_000
);
```

Have a global callback that is invoked whenever the language is changed.

```typescript
import { $lang } from "i18n";

evtLang
    .subscribe(lang=> console.log(`The app has just beed switched to ${lang}`));

```
