import { Header, SpaceBetween } from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";

export default function ToolInputHeader() {
  const { t } = useTranslation(["tool"]);

  return (
    <Header
      variant="h1"
      actions={<SpaceBetween direction="horizontal" size="xs"></SpaceBetween>}
    >
      {t("tool-input.title")}
    </Header>
  );
}
