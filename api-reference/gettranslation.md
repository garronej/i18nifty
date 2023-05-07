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
