import { APP_NAME } from "../../common/constants";

import { BaseLayout } from "../../components/base-layout";
import ToolRegistrationHeader from "./tool-registration-header";
import ToolsTable from "./data-table";

export default function ToolRegistrationPage() {
  return (
    <BaseLayout
      breadcrumbs={[
        {
          text: APP_NAME,
          href: "/",
        },
        {
          text: "Tool Registration",
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
