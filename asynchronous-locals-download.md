# 🚄 Asynchronous locals download

{% hint style="info" %}
Only implement this if bundling all the i18n resources for every language you are supporting have a significant impact on the bundle size.

When the translations are split into multiple files GitHub Copilot doesn’t work as well as when all translations are in a single file.
{% endhint %}

In order to reduce the bundle size, as your app grow you might want to leverage code splitting. &#x20;

For example, the default language of the user is in english, we download only the english texts. If the user changes the language, let's say for french for example, we download the french texts asynchronously.  &#x20;

Find 👉 [here](https://stackblitz.com/edit/react-ts-zgmo8u?file=i18n%2Fi18n.ts) 👈 a live example of how you should setup your repo to enable code splitting (notice the use of `useIsI18nFetching` in the `index.tsx`). &#x20;

