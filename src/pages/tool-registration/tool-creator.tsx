import { CodeEditor, CodeEditorProps } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { aceLoader } from "../../assets/scripts/ace";

const i18nStrings = {
  loadingState: "Loading code editor",
  errorState: "There was an error loading the code editor.",
  errorStateRecovery: "Retry",

  editorGroupAriaLabel: "Code editor",
  statusBarGroupAriaLabel: "Status bar",

  cursorPosition: (row: number, column: number) => `Ln ${row}, Col ${column}`,
  errorsTab: "Errors",
  warningsTab: "Warnings",
  preferencesButtonAriaLabel: "Preferences",

  paneCloseButtonAriaLabel: "Close",

  preferencesModalHeader: "Preferences",
  preferencesModalCancel: "Cancel",
  preferencesModalConfirm: "Confirm",
  preferencesModalWrapLines: "Wrap lines",
  preferencesModalTheme: "Theme",
  preferencesModalLightThemes: "Light themes",
  preferencesModalDarkThemes: "Dark themes",
};

export default function ToolCreator({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const [preferences, setPreferences] = useState<
    CodeEditorProps.Preferences | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ace, setAce] = useState<any>();

  useEffect(() => {
    aceLoader()
      .then((ace) => {
        setAce(ace);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <CodeEditor
      ace={ace}
      language="json"
      value={content}
      onDelayedChange={(e) => {
        setContent(e.detail.value);
      }}
      i18nStrings={i18nStrings}
      loading={loading}
      preferences={preferences}
      onPreferencesChange={(e) => setPreferences(e.detail)}
      themes={{
        light: ["cloud_editor"],
        dark: ["cloud_editor_dark"],
      }}
    />
  );
}
