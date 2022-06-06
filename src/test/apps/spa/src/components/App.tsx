import * as React from "react";
import { useReducer, useEffect } from "react";
import { MyComponent } from "./MyComponent";
import { MyOtherComponent } from "./MyOtherComponent";
import { LanguageSwitch } from "./LanguageSwitch";

export function App() {

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
				The selected language is persisted across reload.
				<br/>
				The code of this app is <a href="https://github.com/garronej/i18nifty/tree/main/src/test/apps/spa">here</a>
				<br/>
				You can switch the language by appending <code>?lang=fr</code> or <code>?lang=en</code> in the URL.
			</p>
		</div>
	);
}
