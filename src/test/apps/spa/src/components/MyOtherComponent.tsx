import * as React from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "../i18n";

type Props = {
  messageCount: number;
};

export function MyOtherComponent(props: Props) {
  const { messageCount } = props;

  const { t } = useTranslation({ MyOtherComponent });

  return (
    <div>
      <p>{t("unread messages", { howMany: messageCount })}</p>
      <button>{t("open")}</button>
      &nbsp;
      <button>{t("delete")}</button>
    </div>
  );
}

export const { i18n } = declareComponentKeys<
  | "open" 
  | "delete" 
  | ["unread messages", { howMany: number }]
>()({ MyOtherComponent });
