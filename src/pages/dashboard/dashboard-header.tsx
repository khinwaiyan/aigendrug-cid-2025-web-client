import { Header, SpaceBetween } from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";

export default function DashboardHeader() {
  const { t } = useTranslation();

  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          {/* <RouterButton href="/section1">View Items</RouterButton>
          <RouterButtonDropdown
            items={[
              {
                id: "add-data",
                text: "Add Item",
                href: "/section1/add",
              },
            ]}
          >
            Add data
          </RouterButtonDropdown> */}
        </SpaceBetween>
      }
    >
      {t("navigation-panel.dashboard")}
      {import.meta.env.DEV && (
        <span style={{ fontSize: "0.5em", color: "red" }}> (DEV)</span>
      )}
    </Header>
  );
}
