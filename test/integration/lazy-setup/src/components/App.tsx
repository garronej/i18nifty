import { useReducer, useEffect } from "react";
import { MyComponent } from "./MyComponent";
import { MyOtherComponent } from "./MyOtherComponent";
import { LanguageSwitch } from "./LanguageSwitch";
import { I18nFetchingSuspense } from "i18n";

export function App() {
    const [messageCount, incrementMessageCount] = useReducer(n => n + 1, 0);

    useEffect(() => {
        setInterval(incrementMessageCount, 3000);
    }, []);

    return (
        <I18nFetchingSuspense
            fallback={null}
        >
            <div>
                <MyComponent name="John Doe" />
                <MyOtherComponent messageCount={messageCount} />
                <LanguageSwitch />
                <br />
                <p
                    style={{
                        "border": "1px solid black",
                        "backgroundColor": "pink"
                    }}
                >
                    In this example the translations for a specific language are
                    downloaded on demand (in the default setup all translations for
                    every supported languages are bundled).
                    <br />
                    The selected language is persisted across reload.
                    <br />
                    The code of this app is{" "}
                    <a href="https://github.com/garronej/i18nifty/tree/main/src/test/integration/lazy-setup">
                        here
                    </a>
                    <br />
                    You can switch the language by appending <code>
                        ?lang=fr
                    </code>{" "}
                    or <code>?lang=en</code> in the URL.
                </p>
            </div>
        </I18nFetchingSuspense>
    );
}
