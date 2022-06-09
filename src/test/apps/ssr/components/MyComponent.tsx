import { useTranslation, declareComponentKeys } from "../i18n"; 

type Props = {
  name: string;
};

export function MyComponent(props: Props) {
  const { name } = props;

  const { t } = useTranslation({ MyComponent });

  return (
    <div>
      <h1>{t("greeting", { "who": name })}</h1>
      <h3>{t("how are you")}</h3>
      <span>{t("any questions ?")}</span>
      <p>{t("learn more", { "href": "https://example.com" })}</p>
    </div>
  );
}

export const { i18n } = declareComponentKeys<
  | { K: "greeting"; P: { who: string }; }
  | "how are you"
  | { K: "learn more"; P: { href: string }; R: JSX.Element; }
  | { K: "any questions ?"; R: JSX.Element; }
>()({ MyComponent });
