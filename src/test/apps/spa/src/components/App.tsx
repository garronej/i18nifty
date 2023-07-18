import { useReducer, useEffect } from "react";
import { MyComponent } from "./MyComponent";
import { MyOtherComponent } from "./MyOtherComponent";
import { LanguageSwitch } from "./LanguageSwitch";
import { useResolveLocalizedString } from "../i18n";

export function App() {

	const [messageCount, incrementMessageCount] = useReducer(n => n + 1, 0);

	useEffect(
		() => { setInterval(incrementMessageCount, 3000); },
		[]
	);

	const { resolveLocalizedString, resolveLocalizedStringDetailed } = useResolveLocalizedString({
		"labelWhenMismatchingLanguage": true
	});

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
			{resolveLocalizedString("This is a text always in english")}
			<br/>
			{resolveLocalizedString({
				"en": "This is a localized text from the API",
				"fr": "Ceci est un texte localisé de l'API"
			})}
			<br />
			{(()=>{

				const { langAttrValue, str} = resolveLocalizedStringDetailed({
					"en": "This is another localized text from the API",
				});

				return <span lang={langAttrValue}>{str}</span>;

			})()}
		</div>
	);
}
