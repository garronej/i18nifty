import { memo } from "react";
import { declareComponentKeys } from "i18nts";
import { useTranslation } from "./i18n";

export const MyComponent2 = memo(() => {

	const { t } = useTranslation({ MyComponent2 });

	return <span>{t("ready")} {t("i am ready to fight", { "link": <a href="#">x</a>, "x": "hello" })}</span>

});

export const { i18n } = declareComponentKeys<
	"ready" |
	"something else" |
	["i am ready to fight", { link: React.ReactNode; x: string; }]
>()({ MyComponent2 });