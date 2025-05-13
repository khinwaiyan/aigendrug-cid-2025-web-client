import {
  FormField,
  Input,
  FileUpload,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useState } from "react";
import { Tool } from "../../service/tool/interface";

type ToolInputProps = {
  tool: Tool | null;
};

export default function ToolInput({ tool }: ToolInputProps) {
  const [formTexts, setFormTexts] = useState<Record<string, string>>({});
  const [formNumbers, setFormNumbers] = useState<Record<string, number>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File[]>>({});

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

  const handleSubmit = () => {
    console.log("Submitted form values:", {
      ...formTexts,
      ...formNumbers,
      ...formFiles,
    });
    // TODO: send to backend
  };

  return (
    <>
      {!tool ? (
        <div>Loading tool...</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <SpaceBetween size="m">
            {tool.provider_interface.requestInterface.map((field) => (
              <FormField key={field.id} label={field.key}>
                {field.valueType === "string" && (
                  <Input
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
                )}
                {field.valueType === "number" && (
                  <Input
                    type="number"
                    value={String(formNumbers[field.key])}
                    onChange={(e) =>
                      handleInputChange({
                        type: "number",
                        key: field.key,
                        value: Number(e.detail.value),
                      })
                    }
                  />
                )}
                {field.valueType === "file" && (
                  <FileUpload
                    value={formFiles[field.key]}
                    onChange={(e) =>
                      handleInputChange({
                        type: "file",
                        key: field.key,
                        value: e.detail.value,
                      })
                    }
                  />
                )}
              </FormField>
            ))}
          </SpaceBetween>
        </form>
      )}
    </>
  );
}
