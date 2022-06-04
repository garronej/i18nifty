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
		</div>
	);
}
