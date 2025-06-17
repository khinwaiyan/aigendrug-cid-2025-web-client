import {
  Box,
  SpaceBetween,
  Button,
  Modal,
  FormField,
  Input,
  FileUpload,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isOk, unwrapOrThrow } from "../../service/service-wrapper";
import { useService } from "../../service/use-service";
import { Tool, ToolInteractionElement } from "../../service/tool/interface";
import styles from "../../styles/tool.module.scss";

type ToolInputModalProps = {
  toolInputModalVisible: boolean;
  setToolInputModalVisible: (visible: boolean) => void;
  toolId: string;
};
export default function ToolInputModal({
  toolInputModalVisible,
  setToolInputModalVisible,
  toolId,
}: ToolInputModalProps) {
  const { t } = useTranslation(["tool"]);
  const { toolService } = useService();
  const [tool, setTool] = useState<Tool | null>(null);
  const [formTexts, setFormTexts] = useState<Record<string, string>>({});
  const [formNumbers, setFormNumbers] = useState<Record<string, number>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File[]>>({});

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
    } else {
      setFormFiles((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!tool) return;

    const request = tool.provider_interface.requestInterface.map((field) => {
      const key = field.key;
      let value: ToolInteractionElement["content"] = "";

      if (field.valueType === "string") {
        value = formTexts[key] ?? "";
      } else if (field.valueType === "number") {
        value = formNumbers[key] ?? 0;
      } else if (field.valueType === "file") {
        value = formFiles[key] ?? [];
      }

      return {
        content: value,
        interface_id: field.id,
      };
    });

    const result = await toolService.runTool(tool.id, request); // correct the result type which includes status
    // TODO: route to tool session page and add the tool request to the session
    if (isOk(result)) {
      console.log("Tool request submitted successfully:", result.data);
      // TODO: route to tool session page

      setFormTexts({});
      setFormNumbers({});
      setFormFiles({});
    } else {
      console.error("Error running tool:", result.error);
    }
  };
  return (
    <Modal
      size="medium"
      onDismiss={() => setToolInputModalVisible(false)}
      visible={toolInputModalVisible}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={() => setToolInputModalVisible(false)}
            >
              {t("base:cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleSubmit();
                setToolInputModalVisible(false);
                window.location.href = `/tool-session`;
              }}
            >
              {t("tool-input.run-model")}
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={
        <SpaceBetween direction="horizontal" size="l" alignItems="center">
          {tool?.name}
        </SpaceBetween>
      }
    >
      {!tool ? (
        <div>Loading tool...</div>
      ) : (
        <div className={styles.tool_input_form_container}>
          <SpaceBetween size="xxl">
            {tool.provider_interface.requestInterface.map((field) => {
              return (
                <div key={field.id}>
                  {field.valueType === "string" && (
                    <FormField label={field.key} stretch={true}>
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
                    <FormField label={field.key} stretch={true}>
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
                    <FormField label={field.key} stretch={true}>
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
                            e ? "Drop files to upload" : "Drop file to upload",
                          removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
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
          </SpaceBetween>
        </div>
      )}
    </Modal>
  );
}
