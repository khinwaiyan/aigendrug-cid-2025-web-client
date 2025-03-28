import { APP_NAME } from "../../common/constants";
import {
  BreadcrumbGroup,
  ContentLayout,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useOnFollow } from "../../common/hooks/use-on-follow";
import BaseAppLayout from "../../components/base-app-layout";
import ToolRegistrationHeader from "./tool-registration-header";
import ToolsTable from "./tools-table";

export default function ToolRegistrationPage() {
  const onFollow = useOnFollow();

  return (
    <BaseAppLayout
      breadcrumbs={
        <BreadcrumbGroup
          onFollow={onFollow}
          items={[
            {
              text: APP_NAME,
              href: "/",
            },
            {
              text: "Tool Registration",
              href: "/tool-registration",
            },
          ]}
        />
      }
      content={
        <ContentLayout header={<ToolRegistrationHeader />}>
          <SpaceBetween size="l">
            <ToolsTable />
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
