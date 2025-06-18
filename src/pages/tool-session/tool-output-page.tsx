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

  //TODO
  const responseData = location.state?.responseData;

  useEffect(() => {
    if (typeof responseData === "string") {
      try {
        const parsed = JSON.parse(responseData);
        setToolOutput(parsed);
      } catch {
        setToolOutput({ result: responseData });
      }
    } else if (responseData && typeof responseData === "object") {
      setToolOutput(responseData);
    } else {
      setToolOutput(null);
    }
  }, [responseData]);

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
