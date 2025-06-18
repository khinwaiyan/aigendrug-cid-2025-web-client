import { useTranslation } from "react-i18next";

export default function ToolRegistrationHeader() {
  const { t } = useTranslation(["tool"]);

  return (
    <header className="pt-2 pb-4 text-2xl font-bold">
      {t("registration.title")}
    </header>
  );
}
