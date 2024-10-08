# 🏁 Quick start

{% hint style="info" %}
This project is designed to be used in SPAs (Single page applications) with no server side rendering. &#x20;

If you're not using either Vite or Create-React-App, i18nifty is probably not the best choice for you. &#x20;
{% endhint %}

{% tabs %}
{% tab title="yarn" %}
```bash
yarn add --dev i18nifty
```
{% endtab %}

{% tab title="npm" %}
```bash
npm install --save-dev i18nifty
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev i18nifty
```
{% endtab %}

{% tab title="npmp" %}
```bash
pnpm add --save-dev i18nifty
```
{% endtab %}
{% endtabs %}

Before diving into the thick of things let's make sure you can do local imports relative to your src directory. It will prevent you from having to write imports like:

`import { useTranslations } from "../../../../i18n";`&#x20;

{% code title="tsconfig.json" %}
```diff
 {
     "compilerOptions": {
         "target": "es5",
+        "baseUrl": "src"
     // ...
     }
 }
```
{% endcode %}

If you are using Vite (If you're using CRA you don't need the vite-tsconfig-paths plugin):

{% tabs %}
{% tab title="yarn" %}
```bash
yarn add --dev vite-tsconfig-paths
```
{% endtab %}

{% tab title="npm" %}
```bash
npm install --save-dev vite-tsconfig-paths
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add --dev vite-tsconfig-paths
```
{% endtab %}

{% tab title="npmp" %}
```bash
pnpm add --save-dev vite-tsconfig-paths
```
{% endtab %}
{% endtabs %}

{% code title="vite.config.ts" %}
```diff
 import { defineConfig } from "vite";
 import tsconfigPaths from "vite-tsconfig-paths";
 import react from "@vitejs/plugin-react";

 // https://vitejs.dev/config/
 export default defineConfig({
    "plugins": [
        react(),
+       tsconfigPaths()
    ]
 });

```
{% endcode %}

Start by declaring the text keys you'll need in each component.&#x20;

`src/components/MyComponent.tsx`

```diff
+import { declareComponentKeys } from "i18nifty";

 type Props = {
     name: string;
 };

 export function MyComponent(props: Props) {
     const { name } = props;
     
     return (
         <>
             <h1>Hello {name}</h1>
             <h3>How are you feeling today?</h3>
             <p>
                 Click <a href="https://example.com">hrere</a> to 
                 learn more about this website
             </p>
         </>
     );
 }

+const { i18n } = declareComponentKeys<
+    | { K: "greating"; P: { who: string; } }
+    | "how are you"
+    | { K: "learn more"; P: { href: string; }; R: JSX.Element }
+>()({ MyComponent });
+export type I18n = typeof i18n;
```

`src/components/MyOtherComponent.tsx`

```diff
+import { declareComponentKeys } from "i18nifty";

 type Props = {
     messageCount: number;
 };

 export function MyOtherComponent(props: Props) {
     const { messageCount } = props;
     
     return (
         <>
             <span>You have {messageCount} unread messages.</span>
             <button>Open</button>
             <button>Delete</button>
         </>
     );
 }

+const { i18n } = declareComponentKeys<
+    | "open"
+    | "delete"
+    | { K: "unread messages"; P: { howMany: number; } }
+>()({ MyOtherComponent });
+export type I18n = typeof i18n;
```

then create your `src/i18n.tsx` file: &#x20;

```tsx
import { createI18nApi, declareComponentKeys } from "i18nifty";
export { declareComponentKeys };

//List the languages you with to support
export const languages = ["en", "fr"] as const;

//If the user's browser language doesn't match any 
//of the languages above specify the language to fallback to:  
export const fallbackLanguage = "en";

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const { 
	useTranslation, 
	resolveLocalizedString, 
	useLang, 
	$lang,
	useResolveLocalizedString,
	/** For use outside of React */
	getTranslation 
} = createI18nApi<
    | import ("components/MyComponent").I18n
    | import ("components/MyOtherComponent").I18n
>()(
    { 
      languages, 
      fallbackLanguage
    },
    {
        "en": {
            "MyComponent": {
                "greating": ({ who })=> `Hello ${who}`,
                "how are you": "How are you feeling today?",
                "learn more": ({ href }) => (
                    <>
                        Learn more about 
                        <a href={href}>this website</a>.
                    </>
                )
            },
            "MyOtherComponent": {
                "open": "Open",
                "delete": "Delete",
                "unread messages": ({ howMany })=> {
                    switch(howMany){
                        case 0: return `You don't have any new message`;
                        case 1: return `You have a new message`;
                        default: return `You have ${howMany} new messages`;
                    }
                }
            },
        },
	/* spell-checker: disable */
	"fr": {
            "MyComponent": {
                "greating": ({ who })=> `Bonjour ${who}`,
                "how are you": "Comment vous sentez vous au jour d'hui?",
                "learn more": ({ href }) => (
                    <>
                        En savoir plus à propos de  
                        <a href={href}>ce site web</a>.
                    </>
                )
            },
            "MyOtherComponent": {
                "open": "Ouvrir",
                "delete": "Supprimer",
                //We will translate this later, for now, fallback to english
                "unread messages": undefined
            },
        }
	/* spell-checker: enable */
    }
);
```

Now go back to your component and use the translation function: &#x20;

{% code title="MyComponent.ts" %}
```diff
+import { useTranslation, declareComponentKeys } from "i18n"; //You can import it like that thanks to baseUrl
   
 type Props = {
     name: string;
 };

 export function MyComponent(props: Props) {
     const { name } = props;
     
+    const { t } = useTranslation({ MyComponent });
     
     return (
         <>
-            <h1>Hello {name}</h1>
+            <h1>{t("greeting", { who: name })}</h1>
-            <h3>How are you feeling today?</h3>
+            <h3>{t("how are you")}</h3>
-            <p>
-                Click <a href="https://example.com">hrere</a> to 
-                learn more about this website
-            </p>
+            <p>{t("learn more", { href: "https://example.com" })}</p>
         </>
     );
 }

 const { i18n } = declareComponentKeys<
     | { K: "greating"; P: { who: string; } }
     | "how are you"
     | { K: "learn more"; P: { href: string; }; R: JSX.Element }
 >()({ MyComponent });
 export type I18n = typeof i18n;
```
{% endcode %}

And so forth for your other components.

Now this setup is great if you're supporting only a few languages and you're app does not contain a lot of text. As you app grow however, you probably want to enable only only the resources for a specific language to be dowloaded. &#x20;

## Eslit

You should add this rule to your eslint config: &#x20;

<pre class="language-javascript" data-title="eslit.config.js"><code class="lang-javascript">export default tseslint.config(
    rules: {
<strong>      "@typescript-eslint/no-unused-vars": [
</strong><strong>        "error",
</strong><strong>        { varsIgnorePattern: "^i18n$" },
</strong><strong>      ],
</strong>    },
  }
);

</code></pre>





[asynchronous-locale-resources-download.md](asynchronous-locale-resources-download.md "mention")
