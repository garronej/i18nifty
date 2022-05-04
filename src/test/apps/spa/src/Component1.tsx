import { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "./i18n";

export const MyComponent1 = memo(() => {

	const { t } = useTranslation({ MyComponent1 });

	return <span>{t("one thing")} {t("something else")} {t("yet another thing", { "name": "bob", "x": 33 })}</span>;

});

export const { i18n } = declareComponentKeys<
	"one thing" |
	"something else" |
	["yet another thing", { x: number; name: string; }]
>()({ MyComponent1 });
