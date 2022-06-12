import type { Translations } from "../types";

export const translations: Translations<"zh-CN"> = {
	/* spell-checker: disable */
	"MyComponent": {
		"greeting": ({ who }) => `你好 ${who}`,
		"any questions ?": <>任何问题？</>,
		"how are you": "你现在的心情如何？",
		"learn more": ({ href }) => (<>学习更多关于&nbsp; <a href={href}>这个网站</a>.  </>)
	},
	"MyOtherComponent": {
		"open": "打开",
		"delete": "删除（尚未翻译）",
		"unread messages": ({ howMany }) => {
			switch (howMany) {
				case 0: return "你没有任何新消息";
				case 1: return "你有一个新消息";
				default: return `你有 ${howMany} 条新消息`;
			}
		}
	}
	/* spell-checker: enable */
};
