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

export interface ChatUIMessageProps {
  message: ChatMessage;
  showCopyButton?: boolean;
}

export default function ChatUIMessage(props: ChatUIMessageProps) {
  const { t } = useTranslation();

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
    </div>
  );
}
