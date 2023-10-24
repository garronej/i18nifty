<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/6702424/172086369-292a3ada-8294-4328-bbb0-336061cbf830.png">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/6702424/172086583-2014cf56-6deb-466d-b4d4-df80b6e85a1e.png">
    <img alt="i18nifty Logo" src="https://user-images.githubusercontent.com/6702424/172086583-2014cf56-6deb-466d-b4d4-df80b6e85a1e.png">
  </picture>
</div>

<p align="center">
    <i>Type-safe internationalization and translation React library fro SPAs</i>
    <br>
    <br>
    <a href="https://github.com/garronej/i18nifty/actions">
      <img src="https://github.com/garronej/i18nifty/actions/workflows/ci.yaml/badge.svg">
    </a>
    <a href="https://bundlephobia.com/package/i18nifty">
      <img src="https://img.shields.io/bundlephobia/minzip/i18nifty">
    </a>
    <a href="https://www.npmjs.com/package/i18nifty">
      <img src="https://img.shields.io/npm/dm/i18nifty">
    </a>
    <a href="https://www.npmjs.com/package/i18nifty">
      <img src="https://img.shields.io/npm/v/i18nifty?logo=npm">
    </a>
    <a href="https://github.com/garronej/i18nifty/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/i18nifty">
    </a>
</p>

<p align="center">
  <a href="https://www.i18nifty.dev">Home</a>
  -
  <a href="https://docs.i18nifty.dev">Documentation</a>
  -
  <a href="https://stackblitz.com/edit/react-ts-m4d8w7?file=components%2FMyComponent.tsx">Sandbox</a>
</p>

An internationalization and translation (i18n) library for React that focuses on the developer experience.  
With ChatGPT capable of producing high-quality translations, there's no longer a need to rely on third-party translation services.  
This allows us to shift our attention from making resource files editable in spreadsheet software to enhancing the developer experience.  
In i18nifty, everything is TypeScript and type-safe. You can define your translations as functions and return them as React nodes, making the process more expressive, easier to write, and simpler to maintain.

> `i18nifty` is intended for use in Single Page Application (SPA) projects, such as Vite or Create React App.
> It is not designed for use with Next.js or other SSR/SSG-enabled meta-frameworks.

## What do I expect from my i18n library

-   [x] I want **true type safety**, If I forgot something I want to be warned about it at **compile time**. I want to be guided by intelisence
        through and through so I can focus on my content.
-   [x] I want to be able to [use React components](https://github.com/garronej/i18nifty/blob/216d90bfa80741c2dc39b79ff7965d18af0bc258/src/test/apps/spa/src/i18n.tsx#L35-L40) and [involve JS logic](https://github.com/garronej/i18nifty/blob/216d90bfa80741c2dc39b79ff7965d18af0bc258/src/test/apps/spa/src/i18n.tsx#L45-L53) in my translations (even if it means giving up support for third part translations services like https://locize.com/).
-   [x] I want the language to **default to the browser preference**.
-   [x] I want the language preferences to be **persistent across reloads**.
-   [x] I want asynchronous loading of locales 
-   [x] **SEO**: I want to let Google know that my website is available in multiple languages.
-   [x] I want to be able to change the language of my app by adding `?lang=xx` to the URL without involving my routing library.
-   [x] I want to be able to **explicitly fallback to English** when I can't translate myself.
-   [x] a11y: When internationalized text received from the backend aren't in the language of the app [I want a label to be added](https://docs.i18nifty.dev/api-reference/localizedstring)

`i18nifty` is the first i18n library that checks all the boxes. [Discover](https://www.i18nifty.dev).

<div align="center">  
    
![demo_1_gh](https://user-images.githubusercontent.com/6702424/172532135-26ac05a4-695b-49b1-94a7-d84ab534d113.gif)
![demo_2_gh](https://user-images.githubusercontent.com/6702424/172532593-b702e3a2-1792-48f5-bc4a-e41bf4c9899c.gif)
![demo_3](https://user-images.githubusercontent.com/6702424/172604440-509f0d8e-6241-4131-b32b-dbdb7149aeb1.gif)

</div>

## Showcases

This library has been used to build the following projects:

<a href="https://youtu.be/FvpNfVrxBFM">
  <img width="1712" alt="image" src="https://user-images.githubusercontent.com/6702424/231314534-2eeb1ab5-5460-4caa-b78d-55afd400c9fc.png">
</a>

<a href="https://youtu.be/AT3CvmY_Y7M?si=Edkf0vRNjosGLA3R">
  <img width="1712" alt="image" src="https://github.com/garronej/i18nifty/assets/6702424/aa06cc30-b2bd-4c8b-b435-2f875f53175b">
</a>

## Contributing

```bash
git clone https://github.com/garronej/i18nifty
cd i18nifty
yarn

# Start the test app in watch mode
yarn start-test-app
# Start the alternative test app where resources are split into multiples files to enable lazy loading.
yarn start-test-app-lazy

# Link in an external app.
yarn link-in-app YOUR-APP # ../YOUR-APP is supposed to exist
npx tsc -w
```
