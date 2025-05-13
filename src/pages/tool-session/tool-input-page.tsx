import { APP_NAME } from "../../common/constants";
import {
  BreadcrumbGroup,
  ContentLayout,
  SpaceBetween,
  Input,
  FileUpload,
  Button,
  FormField,
} from "@cloudscape-design/components";
import { useOnFollow } from "../../common/hooks/use-on-follow";
import BaseAppLayout from "../../components/base-app-layout";
import { useParams } from "react-router-dom";
import ToolInputHeader from "./tool-input-header";
import { unwrapOrThrow } from "../../service/service-wrapper";
import { useEffect, useState } from "react";
import { useService } from "../../service/use-service";
import { Tool } from "../../service/tool/interface";
import styles from "../../styles/tool.module.scss";

export default function ToolInputPage() {
  const [tool, setTool] = useState<Tool | null>(null);
  const [formTexts, setFormTexts] = useState<Record<string, string>>({});
  const [formNumbers, setFormNumbers] = useState<Record<string, number>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File[]>>({});
  const { toolService } = useService();
  const onFollow = useOnFollow();
  const { toolId, sessionId } = useParams();
  useEffect(() => {
    if (!toolId) {
      return;
    }
    const fetch = async () => {
      const tool = unwrapOrThrow(await toolService.getTool(toolId));
      setTool(tool);
    };
    fetch();
  }, []);
  const handleInputChange = ({
    type,
    key,
    value,
  }:
    | { type: "string"; key: string; value: string }
    | { type: "number"; key: string; value: number }
    | { type: "file"; key: string; value: File[] }) => {
    if (type === "string") {
      setFormTexts((prev) => ({ ...prev, [key]: value }));
    } else if (type === "number") {
      setFormNumbers((prev) => ({ ...prev, [key]: value }));
    } else if (type === "file") {
      setFormFiles((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitted form values:", {
      ...formTexts,
      ...formNumbers,
      ...formFiles,
    });
    // TODO: send to backend
  };
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
              text: "Tool Input",
              href: `/tool-input/${sessionId}/${toolId}`,
            },
          ]}
        />
      }
      content={
        <ContentLayout header={<ToolInputHeader />}>
          <SpaceBetween size="l">
            {!tool ? (
              <div>Loading tool...</div>
            ) : (
              <div className={styles.tool_input_form_container}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <SpaceBetween size="m">
                    {tool.provider_interface.requestInterface.map((field) => {
                      return (
                        <div
                          key={field.id}
                          className={styles.tool_input_form_field}
                        >
                          {field.valueType === "string" && (
                            <FormField label={field.key}>
                              <Input
                                type="text"
                                value={formTexts[field.key]}
                                placeholder={`Enter ${field.key}`}
                                onChange={(e) =>
                                  handleInputChange({
                                    type: "string",
                                    key: field.key,
                                    value: e.detail.value,
                                  })
                                }
                              />
                            </FormField>
                          )}
                          {field.valueType === "number" && (
                            <FormField label={field.key}>
                              <Input
                                type="number"
                                inputMode="numeric"
                                value={(formNumbers[field.key] ?? 0).toString()}
                                placeholder={`Enter ${field.key}`}
                                onChange={(e) =>
                                  handleInputChange({
                                    type: "number",
                                    key: field.key,
                                    value: Number(e.detail.value),
                                  })
                                }
                              />
                            </FormField>
                          )}
                          {field.valueType === "file" && (
                            <FormField label={field.key}>
                              <FileUpload
                                value={formFiles[field.key] ?? []}
                                onChange={(e) =>
                                  handleInputChange({
                                    type: "file",
                                    key: field.key,
                                    value: e.detail.value,
                                  })
                                }
                                i18nStrings={{
                                  uploadButtonText: (e) =>
                                    e ? "Choose files" : "Choose file",
                                  dropzoneText: (e) =>
                                    e
                                      ? "Drop files to upload"
                                      : "Drop file to upload",
                                  removeFileAriaLabel: (e) =>
                                    `Remove file ${e + 1}`,
                                  limitShowFewer: "Show fewer files",
                                  limitShowMore: "Show more files",
                                  errorIconAriaLabel: "Error",
                                  warningIconAriaLabel: "Warning",
                                }}
                              />
                            </FormField>
                          )}
                        </div>
                      );
                    })}

                    <div className={styles.tool_input_button_container}>
                      <Button variant="primary">Run Model</Button>
                    </div>
                  </SpaceBetween>
                </form>
              </div>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
