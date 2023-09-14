import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./components/App";
import { useIsI18nFetching } from "i18n";

createRoot(document.getElementById("root") as HTMLElement).render(<Root />);

function Root() {
    if (useIsI18nFetching()) {
        return null;
    }

    return (
        <StrictMode>
            <App />
        </StrictMode>
    );
}
