import { APP_NAME } from "../../common/constants";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../styles/tool.module.scss";
import { useTranslation } from "react-i18next";
import ToolOutputHeader from "./tool-output-header";
import { BaseLayout } from "../../components/base-layout";

export default function ToolOutputPage() {
  const [toolOutput, setToolOutput] = useState<Record<
    string,
    string | number | boolean
  > | null>(null);
  const { toolId, sessionId } = useParams();
  const { t } = useTranslation(["tool"]);
  const location = useLocation();

  // Get responseData from navigation state
  const responseData = location.state?.responseData;

  // Parse responseData if it's a stringified object
  useEffect(() => {
    if (typeof responseData === "string") {
      try {
        const parsed = JSON.parse(responseData);
        setToolOutput(parsed);
      } catch {
        // Not JSON, treat as raw text output
        setToolOutput({ result: responseData });
      }
    } else if (responseData && typeof responseData === "object") {
      setToolOutput(responseData);
    } else {
      setToolOutput(null);
    }
  }, [responseData]);

  // useEffect(() => {
  //   if (!toolId) {
  //     return;
  //   }
  //   const fetch = async () => {
  //     // TODO: check implementation to fetch tool output

  //     const result = await toolService.getToolOutput(toolId); // what to add to getToolOutput?
  //     if (isOk(result)) {
  //       setToolOutput(JSON.parse(result.data!));
  //     } else {
  //       console.error("Error running tool:", result.error);
  //     }
  //   };
  //   fetch();
  // }, []);

  return (
    <BaseLayout
      breadcrumbs={[
        {
          text: APP_NAME,
          href: "/",
        },
        {
          text: t("tool-output.title"),
          href: `/tool-output/${sessionId}/${toolId}`,
        },
      ]}
    >
      <ToolOutputHeader />
      <>
        {toolOutput ? (
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
        ) : (
          <div>Waiting for the result</div>
        )}
      </>
    </BaseLayout>
  );
}
