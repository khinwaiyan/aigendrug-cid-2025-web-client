import {
  Box,
  Button,
  Container,
  Popover,
  Spinner,
  StatusIndicator,
  TextContent,
} from "@cloudscape-design/components";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/chat-ui.module.scss";
import { ChatMessage } from "../../service/chat/interface";
import { useTranslation } from "react-i18next";
import { useService } from "../../service/use-service";
import { useEffect, useState } from "react";
import { Tool } from "../../service/tool/interface";
import { unwrapOrThrow } from "../../service/service-wrapper";
import { useGeneralContext } from "../../context/general-context";

export interface ChatUIMessageProps {
  message: ChatMessage;
  showCopyButton?: boolean;
}

export default function ChatUIMessage(props: ChatUIMessageProps) {
  const { t } = useTranslation();
  const { toolService } = useService();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { updateGenerateState } = useGeneralContext();

  useEffect(() => {
    if (props.message?.role !== "system") {
      return;
    }

    const fetch = async () => {
      const tool = unwrapOrThrow(
        await toolService.getTool(props.message.message)
      );
      setSelectedTool(tool);
    };

    fetch();
  }, []);

  return (
    <div className={styles.chat_message}>
      {props.message?.role === "assistant" && (
        <Container>
          {props.message.message.length === 0 ? (
            <Box>
              <Spinner />
            </Box>
          ) : null}
          {props.message.message.length > 0 &&
          props.showCopyButton !== false ? (
            <div className={styles.btn_chabot_message_copy}>
              <Popover
                size="medium"
                position="top"
                triggerType="custom"
                dismissButton={false}
                content={
                  <StatusIndicator type="success">
                    {t("copied-to-clipboard")}
                  </StatusIndicator>
                }
              >
                <Button
                  variant="inline-icon"
                  iconName="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(props.message.message);
                  }}
                />
              </Popover>
            </div>
          ) : null}
          <ReactMarkdown
            children={props.message.message}
            remarkPlugins={[remarkGfm]}
            components={{
              pre(props) {
                const { children, ...rest } = props;
                return (
                  <pre {...rest} className={styles.codeMarkdown}>
                    {children}
                  </pre>
                );
              },
              table(props) {
                const { children, ...rest } = props;
                return (
                  <table {...rest} className={styles.markdownTable}>
                    {children}
                  </table>
                );
              },
              th(props) {
                const { children, ...rest } = props;
                return (
                  <th {...rest} className={styles.markdownTableCell}>
                    {children}
                  </th>
                );
              },
              td(props) {
                const { children, ...rest } = props;
                return (
                  <td {...rest} className={styles.markdownTableCell}>
                    {children}
                  </td>
                );
              },
            }}
          />
        </Container>
      )}
      {props.message?.role === "user" && (
        <div className={styles.user_message}>
          <TextContent>{props.message.message}</TextContent>
        </div>
      )}
      {props.message?.role === "system" && (
        <div className={styles.system_message}>
          <Button
            loading={selectedTool === null}
            iconAlign="right"
            iconName="external"
            variant="primary"
            onClick={() => {
              updateGenerateState({
                isChatWidgetOpen: false,
              });
            }}
          >
            {selectedTool?.name}
          </Button>
        </div>
      )}
    </div>
  );
}
