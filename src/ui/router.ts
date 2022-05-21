import { createRouter, defineRoute } from "type-route";
import { makeThisModuleAnExecutableRouteLister } from "github-pages-plugin-for-type-route";

export const routeDefs = {
    "home": defineRoute("/"),
};

makeThisModuleAnExecutableRouteLister(routeDefs);

export const { RouteProvider, useRoute, routes } = createRouter(
    { "scrollToTop": false },
    routeDefs,
);


export const githubRepoUrl = "https://github.com/garronej/i18nifty";

export const docsUrl = "https://docs.i18nifty.dev";

export const playgroundUrl = "https://stackblitz.com/edit/react-ts-m4d8w7?file=components/MyComponent.tsx";