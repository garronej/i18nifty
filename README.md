<div align="center">

![Logo Dark](https://user-images.githubusercontent.com/6702424/172086369-292a3ada-8294-4328-bbb0-336061cbf830.png#gh-dark-mode-only)

</div>

<div align="center">

![Logo Light](https://user-images.githubusercontent.com/6702424/172086583-2014cf56-6deb-466d-b4d4-df80b6e85a1e.png#gh-light-mode-only)

</div>

<p align="center">
    <i>Type-safe internationalization and translation React library</i>
    <br>
    <br>
    <a href="https://github.com/garronej/i18nifty/actions">
      <img src="https://github.com/garronej/i18nifty/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/i18nifty">
      <img src="https://img.shields.io/bundlephobia/minzip/i18nifty">
    </a>
    <a href="https://www.npmjs.com/package/i18nifty">
      <img src="https://img.shields.io/npm/dm/i18nifty">
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

## What do I expect from my i18n library

-   [x] I want **true type safety**, If I forgot something I want to be warned about it at **compile time**. I want to be guided by intelisence
        through and through so I can focus on my content.
-   [x] I want to be able to **explicitly fallback to English** when I can't translate myself.
-   [x] I want it to be **easy for non-tech peoples** to provide missing translations.
-   [x] I want to be able to [use React components](https://github.com/garronej/i18nifty/blob/216d90bfa80741c2dc39b79ff7965d18af0bc258/src/test/apps/spa/src/i18n.tsx#L35-L40) and [involve JS logic](https://github.com/garronej/i18nifty/blob/216d90bfa80741c2dc39b79ff7965d18af0bc258/src/test/apps/spa/src/i18n.tsx#L45-L53) in my translations.
-   [x] I want the language to **default to the browser preference**.
-   [x] I want the language preferences to be **persistant across reloads**.
-   [x] **SEO**: I want to let Google know that my website is available in multiple languages.
-   [x] I want all this to work with **server side rendering**.
-   [x] I want to be able to change the language of my app by adding `?lang=xx` to the URL without involving my routing library.

`i18nifty` is the first i18n library that checks all the boxes. [Discover](https://www.i18nifty.dev).

<div align="center">  
    
![demo_1_gh](https://user-images.githubusercontent.com/6702424/172532135-26ac05a4-695b-49b1-94a7-d84ab534d113.gif)
![demo_2_gh](https://user-images.githubusercontent.com/6702424/172532593-b702e3a2-1792-48f5-bc4a-e41bf4c9899c.gif)
![demo_3](https://user-images.githubusercontent.com/6702424/172604440-509f0d8e-6241-4131-b32b-dbdb7149aeb1.gif)

</div>

## Roadmap

-   [ ] React Native support.
-   [ ] SSG Support.
-   [ ] Support lazy loading of resources files by language.
-   [ ] Reduce bundle size.
