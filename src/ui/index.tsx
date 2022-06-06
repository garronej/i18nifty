import { App } from "ui/App";
import { ThemeProvider, splashScreen } from "ui/theme";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouteProvider } from "ui/router";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouteProvider>
            <ThemeProvider splashScreen={splashScreen}>
                <App />
            </ThemeProvider>
        </RouteProvider>
    </StrictMode>,
);
