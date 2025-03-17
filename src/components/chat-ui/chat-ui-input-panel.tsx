import { Button, SpaceBetween } from "@cloudscape-design/components";
import { useEffect, useLayoutEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ChatScrollState } from "./chat-ui";
import styles from "../../styles/chat-ui.module.scss";
import { ChatMessage } from "../../service/chat/interface";
import { useTranslation } from "react-i18next";

export interface ChatUIInputPanelProps {
  inputPlaceholderText?: string;
  sendButtonText?: string;
  running?: boolean;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
}

export default function ChatUIInputPanel(props: ChatUIInputPanelProps) {
  const [inputText, setInputText] = useState("");
  const { t } = useTranslation(["base", "chatWidget"]);

  useEffect(() => {
    const onWindowScroll = () => {
      if (ChatScrollState.skipNextScrollEvent) {
        ChatScrollState.skipNextScrollEvent = false;
        return;
      }

      const isScrollToTheEnd =
        Math.abs(
          window.innerHeight +
            window.scrollY -
            document.documentElement.scrollHeight
        ) <= 10;

      if (!isScrollToTheEnd) {
        ChatScrollState.userHasScrolled = true;
      } else {
        ChatScrollState.userHasScrolled = false;
      }
    };

    window.addEventListener("scroll", onWindowScroll);

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, []);

  useLayoutEffect(() => {
    if (ChatScrollState.skipNextHistoryUpdate) {
      ChatScrollState.skipNextHistoryUpdate = false;
      return;
    }

    if (!ChatScrollState.userHasScrolled && (props.messages ?? []).length > 0) {
      ChatScrollState.skipNextScrollEvent = true;

      const containerRef = ChatScrollState.scrollableElementRef?.current;

      if (containerRef) {
        setTimeout(() => {
          containerRef.scrollTo({
            top: containerRef.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      }

      ChatScrollState.userHasScrolled = false;
    }
  }, [props.messages]);

  const onSendMessage = () => {
    ChatScrollState.userHasScrolled = false;
    props.onSendMessage?.(inputText);
    setInputText("");
  };

  const onTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!props.running && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <SpaceBetween direction="vertical" size="l">
      <div className={styles.input_textarea_container}>
        <TextareaAutosize
          className={styles.input_textarea}
          maxRows={6}
          minRows={1}
          spellCheck={true}
          autoFocus
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={onTextareaKeyDown}
          value={inputText}
          placeholder={
            props.inputPlaceholderText ??
            t("chatWidget:chat-ui.input-placeholder")
          }
        />
        <div style={{ marginLeft: "8px" }}>
          <Button
            disabled={props.running || inputText.trim().length === 0}
            onClick={onSendMessage}
            iconAlign="right"
            iconName="send"
            variant="primary"
          />
        </div>
      </div>
    </SpaceBetween>
  );
}
