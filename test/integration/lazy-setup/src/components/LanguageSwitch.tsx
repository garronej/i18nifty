import { useLang } from "i18n";

export function LanguageSwitch() {
    const { lang, setLang } = useLang();

    return (
        <div>
            <p>
                The app is currently in{" "}
                {(() => {
                    switch (lang) {
                        case "en":
                            return "English";
                        case "fr":
                            return "French";
                        case "zh-CN":
                            return "Chinese";
                    }
                })()}
            </p>
            <button onClick={() => setLang("en")}>
                Put the app in English
            </button>
            &nbsp;
            <button onClick={() => setLang("fr")}>Put the app in French</button>
            &nbsp;
            <button onClick={() => setLang("zh-CN")}>
                Put the app in Chinese
            </button>
        </div>
    );
}
