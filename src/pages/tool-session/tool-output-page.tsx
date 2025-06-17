import { APP_NAME } from "../../common/constants";
import { BreadcrumbGroup, ContentLayout } from "@cloudscape-design/components";
import { useOnFollow } from "../../common/hooks/use-on-follow";
import BaseAppLayout from "../../components/base-app-layout";
import { useParams } from "react-router-dom";
import { isOk } from "../../service/service-wrapper";
import { useEffect, useState } from "react";
import { useService } from "../../service/use-service";
import styles from "../../styles/tool.module.scss";
import { useTranslation } from "react-i18next";
import ToolOutputHeader from "./tool-output-header";

export default function ToolOutputPage() {
  const [toolOutput, setToolOutput] = useState<Record<
    string,
    string | number | boolean
  > | null>(null);
  const { toolService } = useService();
  const onFollow = useOnFollow();
  const { toolId, sessionId } = useParams();
  const { t } = useTranslation(["tool"]);

  useEffect(() => {
    if (!toolId) {
      return;
    }
    const fetch = async () => {
      // TODO: check implementation to fetch tool output

      const result = await toolService.getToolOutput(toolId); // what to add to getToolOutput?
      if (isOk(result)) {
        setToolOutput(JSON.parse(result.data!));
      } else {
        console.error("Error running tool:", result.error);
      }
    };
    fetch();
  }, []);

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
              text: "Tool Output",
              href: `/tool-output/${sessionId}/${toolId}`,
            },
          ]}
        />
      }
      content={
        <>
          {toolOutput ? (
            <ContentLayout header={<ToolOutputHeader />}>
              <div className={styles.tool_container}>
                <p className={styles.tool_output_title}>
                  {typeof toolOutput.result === "string" ||
                  typeof toolOutput.result === "number"
                    ? toolOutput.result
                    : typeof toolOutput.result === "boolean"
                    ? toolOutput.result.toString()
                    : t("tool-output.error")}
                </p>
              </div>
            </ContentLayout>
          ) : (
            <div>Waiting for the result</div>
          )}
        </>
      }
    />
  );
}
