import DashboardHeader from "./dashboard-header";
import ItemsTable from "./items-table";
import { BaseLayout } from "../../components/base-layout";
import { APP_NAME } from "../../common/constants";

export default function DashboardPage() {
  return (
    <BaseLayout
      breadcrumbs={[
        { text: APP_NAME, href: "/" },
        { text: "Dashboard", href: "/" },
      ]}
    >
      <DashboardHeader />
      <div className="space-y-6">
        <ItemsTable />
      </div>
    </BaseLayout>
  );
}
