import * as React from 'react';
import { declareComponentKeys } from 'i18nifty';
import { useTranslation } from '../i18n'; //You can import it like that thanks to baseUrl

type Props = {
  name: string;
};

export function MyComponent(props: Props) {
  const { name } = props;

  const { t } = useTranslation({ MyComponent });

  return (
    <div>
      <h1>{t("greeting", { who: name })}</h1>
      <h3>{t("how are you")}</h3>
      <p>{t("learn more", { href: "https://example.com" })}</p>
    </div>
  );
}

export const { i18n } = declareComponentKeys<
  | ['greeting', { who: string }]
  | 'how are you'
  | ['learn more', { href: string }]
>()({ MyComponent });
