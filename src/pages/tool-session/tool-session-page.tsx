import { APP_NAME } from "../../common/constants";

import { BaseLayout } from "../../components/base-layout";
import { useTranslation } from "react-i18next";
import ToolSessionHeader from "./tool-session-header";

export default function ToolSessionPage() {
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
      <ToolSessionHeader />
      <div className="space-y-6">{/* session table */}</div>
    </BaseLayout>
  );
}
