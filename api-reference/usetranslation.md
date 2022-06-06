---
description: Returns the usual t function
---

# useTranslation

```tsx
 import { declareComponentKeys } from "i18nifty";
 import { useTranslation } from "i18n"; 

 type Props = {
     name: string;
 };

 function MyComponent(props: Props) {
     const { name } = props;
     
     const { t } = useTranslatation({ MyComponent });
     
     return (
         <>
            <h1>{t("greeting", { who: name })}</h1>
            <h3>{t("how are you")}</h3>
            <p>{t("learn more", { href: "https://example.com" })}</p>
         </>
     );
 }

 export const { i18n } = declareComponentKeys<
     | ["geeting", { who: string; }]
     | "how are you"
     | [ "learn more", { href: string; }]
 >()({ MyComponent });
```

{% hint style="info" %}
See [Quick start](../) for more details.
{% endhint %}
