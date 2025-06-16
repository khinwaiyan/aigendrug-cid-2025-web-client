import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import { DataTable } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { useService } from "../../service/use-service";
import { unwrapOr } from "../../service/service-wrapper";
import { useEffect, useMemo, useState } from "react";
import { Tool } from "../../service/tool/interface";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import ToolCreator from "./tool-create-dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useGeneralContext } from "../../context/general-context";

export default function ToolsTable() {
  const { t } = useTranslation(["tool", "base", "chatWidget"]);
  const { toolService } = useService();
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedItems, setSelectedItems] = useState<Tool[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(false);
  const [toolDeleteModalVisible, setToolDeleteModalVisible] = useState(false);
  const [toolCreateModalVisible, setToolCreateModalVisible] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [, setJsonFile] = useState<File | null>(null);
  const { generalState, updateGenerateState } = useGeneralContext();

  const columns: ColumnDef<Tool>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t("table.column.name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => row.original.name,
      },
      {
        accessorKey: "id",
        header: t("table.column.tool-id"),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const tool = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">
                    {t("table.actions.open-menu")}
                  </span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(tool.id)}
                >
                  {t("table.actions.copy-tool-id")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await toolService.deleteTool(tool.id);
                    const deletedToolIds = selectedItems.map((item) => item.id);

                    updateGenerateState({
                      toolSessionLinks: generalState.toolSessionLinks.filter(
                        (link) => !deletedToolIds.includes(link.toolId)
                      ),
                    });
                    await fetchTools();
                  }}
                >
                  {t("table.actions.delete-session")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t]
  );

  const fetchTools = async () => {
    setLoading(true);
    const fetched = unwrapOr(await toolService.getAllTools(), []);
    setTools(fetched);
    setLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setToolCreateModalVisible(true)}
        >
          {t("table.add-item")}
        </Button>
        <Button
          variant="outline"
          disabled={selectedItems.length === 0}
          onClick={() => setToolDeleteModalVisible(true)}
        >
          {t("table.delete")}
        </Button>
      </div>

      {/* Table or Skeleton */}
      {loading ? (
        <Skeleton className="h-48 w-full rounded-md" />
      ) : (
        <DataTable
          columns={columns}
          data={tools.sort((a, b) => a.name.localeCompare(b.name))}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectedRowsChange={setSelectedItems}
        />
      )}

      {/* Create Dialog */}
      <Dialog
        open={toolCreateModalVisible}
        onOpenChange={setToolCreateModalVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("table.add-item")}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="json-upload"
              className="text-sm font-medium text-muted-foreground"
            >
              {t("upload-json")}
            </label>
            <Input
              id="json-upload"
              type="file"
              accept=".json"
              className="w-auto"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                file.text().then(setJsonContent);
                setJsonFile(file);
              }}
            />
          </div>

          <ToolCreator content={jsonContent} setContent={setJsonContent} />

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setToolCreateModalVisible(false)}
            >
              {t("base:cancel")}
            </Button>
            <Button
              onClick={async () => {
                await toolService.createTool(JSON.parse(jsonContent));
                await fetchTools();
                setToolCreateModalVisible(false);
                setJsonContent("");
                setJsonFile(null);
              }}
            >
              {t("base:save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={toolDeleteModalVisible}
        onOpenChange={setToolDeleteModalVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("chatWidget:delete-chat")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("chatWidget:delete-chat-confirm")}
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setToolDeleteModalVisible(false)}
            >
              {t("base:cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await Promise.all(
                  selectedItems.map((item) => toolService.deleteTool(item.id))
                );
                const deletedToolIds = selectedItems.map((item) => item.id);

                updateGenerateState({
                  toolSessionLinks: generalState.toolSessionLinks.filter(
                    (link) => !deletedToolIds.includes(link.toolId)
                  ),
                });

                setSelectedItems([]);
                setRowSelection({});
                await fetchTools();
                setToolDeleteModalVisible(false);
              }}
            >
              {t("base:delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
