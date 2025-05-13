import {
  Box,
  SpaceBetween,
  TableProps,
  Header,
  Table,
  StatusIndicator,
  Button,
  Modal,
  TextContent,
  Link,
} from "@cloudscape-design/components";
import { TextHelper } from "../../common/helpers/text-helper";
import { useGeneralContext } from "../../context/general-context";
import { Session } from "../../service/session/interface";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useService } from "../../service/use-service";
import { unwrapOr } from "../../service/service-wrapper";

export default function ItemsTable() {
  const { t } = useTranslation(["dashboard", "base", "chatWidget"]);
  const { sessionService } = useService();
  const { generalState, updateGenerateState } = useGeneralContext();

  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Session[]>([]);
  const [sessionDeleteModalVisible, setSessionDeleteModalVisible] =
    useState(false);

  const ItemsColumnDefinitions = useMemo<
    TableProps.ColumnDefinition<Session>[]
  >(
    () => [
      {
        id: "name",
        header: t("table.column.name"),
        sortingField: "name",
        cell: (item) => (
          <Link
            external
            onClick={() => {
              updateGenerateState({
                isChatWidgetOpen: true,
                activeChatSessionId: item.id,
              });
            }}
          >
            {item.name}
          </Link>
        ),
        isRowHeader: true,
      },
      {
        id: "status",
        header: t("table.column.status"),
        sortingField: "status",
        cell: (item) => (
          <StatusIndicator type="success">{item.status}</StatusIndicator>
        ),
        minWidth: 120,
      },
      {
        id: "assigned_tool_id",
        header: t("table.column.assigned-tool"),
        sortingField: "assigned_tool_id",
        cell: (item) => item.assigned_tool_id,
      },
    ],
    [t]
  );

  async function fetchSessions() {
    setLoading(true);
    const sessions = unwrapOr(await sessionService.getAllSessions(), []);
    updateGenerateState({ openedSessions: sessions });
    setLoading(false);
  }

  return (
    <>
      <Table
        loading={loading}
        loadingText={t("loading")}
        selectionType="multi"
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="xxs">
              <div>
                <b>{t("no-items")}</b>
                <Box variant="p" color="inherit">
                  {t("no-items-description")}
                </Box>
              </div>
            </SpaceBetween>
          </Box>
        }
        columnDefinitions={ItemsColumnDefinitions}
        items={generalState.openedSessions.sort((a, b) =>
          a.name.localeCompare(b.name)
        )}
        selectedItems={selectedItems}
        onSelectionChange={(event: {
          detail: TableProps.SelectionChangeDetail<Session>;
        }) => setSelectedItems(event.detail.selectedItems)}
        header={
          <Header
            counter={TextHelper.getHeaderCounterText(
              generalState.openedSessions,
              selectedItems
            )}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  onClick={() => {
                    updateGenerateState({
                      isChatWidgetOpen: true,
                      activeChatSessionId: null,
                    });
                  }}
                >
                  {t("table.add-item")}
                </Button>
                <Button
                  disabled={selectedItems.length === 0}
                  onClick={() => {
                    setSessionDeleteModalVisible(true);
                  }}
                >
                  {t("table.delete")}
                </Button>
              </SpaceBetween>
            }
          >
            {t("table.title")}
          </Header>
        }
      />
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
                  await Promise.all(
                    selectedItems.map((item) =>
                      sessionService.deleteSession(item.id)
                    )
                  );
                  const deletedSessionIds = selectedItems.map(
                    (item) => item.id
                  );
                  updateGenerateState({
                    activeChatSessionId: null,
                    toolSessionLinks: generalState.toolSessionLinks.filter(
                      (link) => !deletedSessionIds.includes(link.sessionId)
                    ),
                  });
                  setSelectedItems([]);
                  await fetchSessions();
                  setSessionDeleteModalVisible(false);
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
    </>
  );
}
