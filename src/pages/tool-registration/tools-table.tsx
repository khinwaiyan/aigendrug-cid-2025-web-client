import {
  Box,
  SpaceBetween,
  TableProps,
  Header,
  Table,
  Button,
  Modal,
  TextContent,
  Link,
  FileInput,
} from "@cloudscape-design/components";
import { TextHelper } from "../../common/helpers/text-helper";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useService } from "../../service/use-service";
import { unwrapOr } from "../../service/service-wrapper";
import { Tool } from "../../service/tool/interface";
import ToolCreator from "./tool-creator";

const sampleToolJson = `{
  "id": "00000000-0000-0000-0000-000000000000",
  "version": "1.0.0",
  "name": "Tool Name",
  "description": "Tool Description",
  "created_at": "2025-03-26",
  "provider_interface": {}
}`;

export default function ToolsTable() {
  const { t } = useTranslation(["tool"]);
  const { toolService } = useService();

  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedItems, setSelectedItems] = useState<Tool[]>([]);
  const [toolCreateModalVisible, setToolCreateModalVisible] = useState(false);
  const [toolDeleteModalVisible, setToolDeleteModalVisible] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonContent, setJsonContent] = useState<string>(sampleToolJson);

  const ItemsColumnDefinitions = useMemo<TableProps.ColumnDefinition<Tool>[]>(
    () => [
      {
        id: "name",
        header: t("table.column.name"),
        sortingField: "name",
        cell: (item) => (
          <Link
            external
            // onClick={() => {
            //   updateGenerateState({
            //     isChatWidgetOpen: true,
            //     activeChatSessionId: item.id,
            //   });
            // }}
          >
            {item.name}
          </Link>
        ),
        isRowHeader: true,
      },
      // {
      //   id: "status",
      //   header: t("table.column.status"),
      //   sortingField: "status",
      //   cell: (item) => (
      //     <StatusIndicator type="success">{item.status}</StatusIndicator>
      //   ),
      //   minWidth: 120,
      // },
      {
        id: "id",
        header: t("table.column.tool-id"),
        sortingField: "id",
        cell: (item) => item.id,
      },
    ],
    [t]
  );

  async function fetchTools() {
    setLoading(true);
    const tools = unwrapOr(await toolService.getAllTools(), []);
    setTools(tools);
    setLoading(false);
  }

  useEffect(() => {
    fetchTools();
  }, []);

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
        items={tools.sort((a, b) => a.name.localeCompare(b.name))}
        selectedItems={selectedItems}
        onSelectionChange={(event: {
          detail: TableProps.SelectionChangeDetail<Tool>;
        }) => setSelectedItems(event.detail.selectedItems)}
        header={
          <Header
            counter={TextHelper.getHeaderCounterText(tools, selectedItems)}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  onClick={() => {
                    setToolCreateModalVisible(true);
                  }}
                >
                  {t("table.add-item")}
                </Button>
                <Button
                  disabled={selectedItems.length === 0}
                  onClick={() => {
                    setToolDeleteModalVisible(true);
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
        size="large"
        onDismiss={() => setToolCreateModalVisible(false)}
        visible={toolCreateModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => setToolCreateModalVisible(false)}
              >
                {t("base:cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  await toolService.createTool(JSON.parse(jsonContent));
                  await fetchTools();
                  setJsonContent(sampleToolJson);
                  setJsonFile(null);
                  setToolCreateModalVisible(false);
                }}
              >
                {t("base:save")}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={
          <SpaceBetween direction="horizontal" size="l" alignItems="center">
            {t("table.add-item")}
            <FileInput
              onChange={({ detail }) => {
                setJsonFile(detail.value[0]);
                detail.value[0].text().then((text) => {
                  setJsonContent(text);
                });
              }}
              value={jsonFile ? [jsonFile] : []}
              accept=".json"
              ariaRequired
            >
              {t("upload-json")}
            </FileInput>
          </SpaceBetween>
        }
      >
        <ToolCreator content={jsonContent} setContent={setJsonContent} />
      </Modal>
      <Modal
        onDismiss={() => setToolDeleteModalVisible(false)}
        visible={toolDeleteModalVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => setToolDeleteModalVisible(false)}
              >
                {t("base:cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  await Promise.all(
                    selectedItems.map((item) => toolService.deleteTool(item.id))
                  );

                  setSelectedItems([]);
                  await fetchTools();
                  setToolDeleteModalVisible(false);
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
