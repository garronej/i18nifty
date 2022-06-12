import type { Translations } from "./type";

export const translations: Translations<"en"> = {
	"MyComponent": {
		"greeting": ({ who }) => `Hello ${who}`,
		"how are you": "How are you feeling today?",
		"any questions ?": <>Any <b>questions</b>?</>,
		"learn more": ({ href }) => (<> Learn more about&nbsp; <a href={href}>this website</a>.  </>)
	},
	"MyOtherComponent": {
		"open": "Open",
		"delete": "Delete (not yet translated in french)",
		"unread messages": ({ howMany }) => {
			switch (howMany) {
				case 0: return "You don't have any new message";
				case 1: return "You have a new message";
				default: return `You have ${howMany} new messages`;
			}
		}
	}
};
