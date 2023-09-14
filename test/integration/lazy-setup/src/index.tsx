import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./components/App";
import { I18nResourcesDownloadingFallbackProvider } from "i18n";

createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
        <I18nResourcesDownloadingFallbackProvider>
            <App />
        </I18nResourcesDownloadingFallbackProvider>
    </StrictMode>
);
