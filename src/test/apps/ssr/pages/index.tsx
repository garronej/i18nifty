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
		</div>
	);
}
