import * as React from "react";
import { useReducer, useEffect } from "react";
import { MyComponent } from "../components/MyComponent";
import { MyOtherComponent } from "../components/MyOtherComponent";
import { LanguageSwitch } from "../components/LanguageSwitch";

export default function App() {

	const [messageCount, incrementMessageCount] = useReducer(n => n + 1, 0);

	useEffect(
		() => { setInterval(incrementMessageCount, 3000); },
		[]
	);

	return (
		<div>
			<MyComponent name="John Doe" />
			<MyOtherComponent messageCount={messageCount} />
			<LanguageSwitch />
			<br/>
			<p style={{ "border": "1px solid black", "backgroundColor": "pink" }}>
				NOTE: You can <a href="https://developer.chrome.com/docs/devtools/javascript/disable/" target="_blank">disable javascript</a> and reload the page,
				the selected language, even if it isn't the browser default, is persisted across reloads using cookie.
				<br/>
				The code of this app is <a href="https://github.com/garronej/i18nifty/tree/main/src/test/apps/ssr">here</a>
				<br/>
				You can switch the language by appending <code>?lang=fr</code> or <code>?lang=en</code> in the URL.
			</p>
		</div>
	);
}
