import { render } from "react-dom";
import { App } from "./App";
import { RouteProvider } from "./router";
import { ThemeProvider, splashScreen } from "./theme";

render(
    <RouteProvider>
            <ThemeProvider splashScreen={splashScreen}>
                <App />
            </ThemeProvider>
    </RouteProvider>,
    document.getElementById("root"),
);
