# 🚄 Asynchronous locals download

To minimize the bundle size, especially as your application scales, you may want to take advantage of code splitting.&#x20;

For instance, if the user's default language is English, only the English text resources are initially downloaded. If the user switches to another language, such as French, the corresponding French text resources are then downloaded asynchronously.

Find 👉 [here](https://stackblitz.com/edit/react-ts-zgmo8u?file=i18n%2Fi18n.ts) 👈 a live example of how you should setup your repo to enable code splitting. &#x20;

