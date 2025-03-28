import { useTranslation } from "react-i18next";
import { useGeneralContext } from "../../context/general-context";
import styles from "../../styles/chat-widget.module.scss";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  FormField,
  Header,
  Input,
  Modal,
  SpaceBetween,
  Spinner,
  TextContent,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { useService } from "../../service/use-service";
import { Session } from "../../service/session/interface";
import { ChatUI } from "../chat-ui/chat-ui";
import { ChatMessage } from "../../service/chat/interface";
import { Avatar } from "@cloudscape-design/chat-components";
import useChatWebSocket from "../../common/hooks/use-chat-websocket";
import { isOk, unwrapOr, unwrapOrThrow } from "../../service/service-wrapper";

export default function ChatWidget() {
  const { generalState, updateGenerateState } = useGeneralContext();

  const { t } = useTranslation(["base", "chatWidget"]);
  const { sessionService, chatService } = useService();
  const [loading, setLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newSessionModalVisible, setNewSessionModalVisible] = useState(false);
  const [sessionDeleteModalVisible, setSessionDeleteModalVisible] =
    useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const { sendMessage, isWaiting } = useChatWebSocket(
    generalState.activeChatSessionId || "",
    (newMessage) => {
      setChatMessages((prevMessages) => {
        if (!prevMessages) return [newMessage];
        return [...prevMessages, newMessage];
      });
    }
  );

  async function fetchData() {
    setLoading(true);

    const sessions = unwrapOr(await sessionService.getAllSessions(), []);

    updateGenerateState({ openedSessions: sessions });

    if (generalState.activeChatSessionId) {
      const session = sessions.find(
        (session) => session.id === generalState.activeChatSessionId
      );

      if (session) {
        setActiveSession(session);

        const messages = unwrapOr(
          await chatService.getChatMesssageBySessionId(
            generalState.activeChatSessionId
          ),
          []
        );

        setChatMessages(messages);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [generalState.activeChatSessionId]);

  return (
    <div
      className={`${styles.chat_widget} ${
        generalState.isChatWidgetFullScreen ? styles.full : ""
      }`}
      style={{
        display: generalState.isChatWidgetOpen ? "block" : "none",
      }}
    >
      <div className={styles.header}>
        <Header
          actions={
            !generalState.activeChatSessionId ? (
              <Button
                variant="normal"
                iconName="add-plus"
                onClick={() => setNewSessionModalVisible(true)}
              >
                {t("chatWidget:new-chat")}
              </Button>
            ) : (
              <>
                <Button
                  variant="icon"
                  iconName="angle-left"
                  onClick={() => {
                    updateGenerateState({ activeChatSessionId: null });
                    setActiveSession(null);
                    setChatMessages([]);
                  }}
                />
                <TextContent>
                  <h3>{activeSession?.name}</h3>
                </TextContent>
              </>
            )
          }
        >
          <Button
            variant="icon"
            iconName={generalState.isChatWidgetFullScreen ? "shrink" : "expand"}
            onClick={() =>
              updateGenerateState({
                isChatWidgetFullScreen: !generalState.isChatWidgetFullScreen,
              })
            }
          />
          <Button
            variant="icon"
            iconName="subtract-minus"
            onClick={() => {
              updateGenerateState({ isChatWidgetOpen: false });
            }}
          />
        </Header>
      </div>
      {!generalState.activeChatSessionId && (
        <div className={styles.chat_room_list}>
          {(loading || generalState.openedSessions.length === 0) && (
            <div className={styles.loading}>
              {generalState.openedSessions.length === 0 && !loading && (
                <Alert type="info">{t("chatWidget:no-chat-rooms")}</Alert>
              )}
              {loading && <Spinner size="large" />}
            </div>
          )}
          {generalState.openedSessions
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((chatRoom) => (
              <div
                className={styles.chat_room}
                key={chatRoom.id}
                onClick={() => {
                  updateGenerateState({ activeChatSessionId: chatRoom.id });
                  setActiveSession(chatRoom);
                  setChatMessages([]);
                  fetchData();
                }}
              >
                <div className={styles.avatar}>
                  <Avatar ariaLabel="avatar" iconName="contact" />
                </div>
                <div className={styles.info}>
                  <TextContent>
                    <h4>{chatRoom.name}</h4>
                    <p>
                      <small>
                        {new Date(chatRoom.created_at).toLocaleString()}
                      </small>
                    </p>
                  </TextContent>
                </div>
                <div className={styles.spacer} />
                <div
                  className={styles.actions}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ButtonGroup
                    onItemClick={({ detail }) => {
                      if (detail.id === "remove") {
                        setSelectedSessionId(chatRoom.id);
                        setSessionDeleteModalVisible(true);
                      }
                    }}
                    ariaLabel="Chat actions"
                    items={[
                      // {
                      //   type: "icon-button",
                      //   id: "copy",
                      //   iconName: "copy",
                      //   text: "Copy",
                      //   popoverFeedback: (
                      //     <StatusIndicator type="success">
                      //       Message copied
                      //     </StatusIndicator>
                      //   ),
                      // },
                      {
                        type: "icon-button",
                        id: "remove",
                        iconName: "remove",
                        text: t("base:delete"),
                      },
                    ]}
                    variant="icon"
                  />
                </div>
              </div>
            ))}
        </div>
      )}
      <div className={styles.chat_ui_wrapper}>
        {generalState.activeChatSessionId && (
          <ChatUI
            messages={chatMessages}
            showCopyButton={true}
            loading={loading}
            running={isWaiting}
            onSendMessage={async (message) => {
              if (!generalState.activeChatSessionId) return;
              sendMessage({
                message,
                role: "user",
                session_id: generalState.activeChatSessionId,
              });
            }}
          />
        )}
      </div>
      <Modal
        onDismiss={() => {
          if (!isCreatingSession) {
            setNewSessionModalVisible(false);
            setNewSessionName("");
          }
        }}
        visible={newSessionModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                disabled={isCreatingSession}
                onClick={() => {
                  setNewSessionModalVisible(false);
                  setNewSessionName("");
                }}
              >
                {t("base:cancel")}
              </Button>
              <Button
                disabled={
                  newSessionName === "" ||
                  newSessionName.length < 3 ||
                  newSessionName.length > 25
                }
                loading={isCreatingSession}
                variant="primary"
                onClick={async () => {
                  setIsCreatingSession(true);
                  const newSession = unwrapOrThrow(
                    await sessionService.createSession(newSessionName)
                  );
                  setNewSessionModalVisible(false);
                  setNewSessionName("");
                  fetchData();
                  updateGenerateState({ activeChatSessionId: newSession.id });
                  setIsCreatingSession(false);
                }}
              >
                {t("base:ok")}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={t("chatWidget:new-chat")}
      >
        <FormField
          label={t("chatWidget:input-new-chat-name")}
          description=""
          errorText=""
        >
          <Input
            value={newSessionName}
            onChange={({ detail }) => setNewSessionName(detail.value)}
          />
        </FormField>
      </Modal>
      <Modal
        onDismiss={() => setSessionDeleteModalVisible(false)}
        visible={sessionDeleteModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => setSessionDeleteModalVisible(false)}
              >
                {t("base:cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (!selectedSessionId) return;
                  const res = isOk(
                    await sessionService.deleteSession(selectedSessionId)
                  );
                  if (!res) return;
                  setSessionDeleteModalVisible(false);
                  updateGenerateState({ activeChatSessionId: null });
                  fetchData();
                }}
              >
                {t("base:delete")}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={t("chatWidget:delete-chat")}
      >
        <TextContent>
          <p>{t("chatWidget:delete-chat-confirm")}</p>
        </TextContent>
      </Modal>
    </div>
  );
}
