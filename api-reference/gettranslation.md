---
description: Use the translation function outside of React components.
---

# getTranslation

It's like useTranslation but it's not a hook, it can be used outside of React. &#x20;

```typescript
const { getTranslation } = createI18nApi(...);

const { t } = getTranslation("MyComponent");  

t("greating", { "who": "Jhon" });
```

{% hint style="warning" %}
Be mindfull, local resources are downloaded lazyly in with [asynchronous locale download](../asynchronous-locale-resources-download.md).\
If the resources aren't downloaded yet you'll get empty strings.  \
Also you have to subscribe to language changes to get the updated values.
{% endhint %}
