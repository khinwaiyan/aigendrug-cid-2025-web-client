import { Header, SpaceBetween } from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";

export default function ToolOutputHeader() {
  const { t } = useTranslation(["tool"]);

  return (
    <Header
      variant="h1"
      actions={<SpaceBetween direction="horizontal" size="xs"></SpaceBetween>}
    >
      {t("tool-output.title")}
    </Header>
  );
}
