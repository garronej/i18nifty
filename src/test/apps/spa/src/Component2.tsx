import { memo } from "react";
import { i18nDeclare } from "i18n-react-ts";

export const MyComponent2 = memo(() => {
	return null;
});

export const { i18nDeclaration } = i18nDeclare<
	"ready" |
	"something else" 
>()({ MyComponent2 });