import { useTranslation } from "react-i18next";

export default function ToolSessionHeader() {
  const { t } = useTranslation(["tool"]);

  return (
    <header className="pt-2 pb-4 text-2xl font-bold">
      {t("session.title")}
    </header>
  );
}
