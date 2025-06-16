import { useTranslation } from "react-i18next";

export default function DashboardHeader() {
  const { t } = useTranslation();

  return (
    <header className="pt-2 pb-4 text-2xl font-bold">
      {t("navigation-panel.dashboard")}
    </header>
  );
}
