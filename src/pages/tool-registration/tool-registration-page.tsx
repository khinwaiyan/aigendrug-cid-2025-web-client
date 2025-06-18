import { APP_NAME } from "../../common/constants";

import { BaseLayout } from "../../components/base-layout";
import ToolRegistrationHeader from "./tool-registration-header";
import ToolsTable from "./tools-table";
import { useTranslation } from "react-i18next";

export default function ToolRegistrationPage() {
  const { t } = useTranslation([], { keyPrefix: "navigation-panel" });

  return (
    <BaseLayout
      breadcrumbs={[
        {
          text: APP_NAME,
          href: "/",
        },
        {
          text: t("tool-registration"),
          href: "/tool-registration",
        },
      ]}
    >
      <ToolRegistrationHeader />
      <div className="space-y-6">
        <ToolsTable />
      </div>
    </BaseLayout>
  );
}
