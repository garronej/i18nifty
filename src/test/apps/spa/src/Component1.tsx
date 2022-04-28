import { memo } from "react";
import { i18nDeclare } from "i18n-react-ts";

export const MyComponent1 = memo(() => {
	return null;
});

export const { i18nDeclaration } = i18nDeclare<
	"one thing" |
	"something else" |
	["yet another thing", { x: number; name: string; }]
>()({ MyComponent1 });