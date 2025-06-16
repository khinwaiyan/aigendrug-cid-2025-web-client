import { useGeneralContext } from "../../context/general-context";
import { Session } from "../../service/session/interface";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useService } from "../../service/use-service";
import { unwrapOr } from "../../service/service-wrapper";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";
import {
  CircleCheck,
  Loader,
  MoreHorizontal,
  ArrowUpDown,
  Plus,
  Minus,
} from "lucide-react";
import { DataTable } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import { Skeleton } from "../../components/ui/skeleton";

export default function ItemsTable() {
  const { t } = useTranslation(["dashboard", "base", "chatWidget"]);
  const { sessionService } = useService();
  const { generalState, updateGenerateState } = useGeneralContext();
  const [rowSelection, setRowSelection] = useState({});

  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Session[]>([]);
  const [sessionDeleteModalVisible, setSessionDeleteModalVisible] =
    useState(false);
  const { toolService } = useService();

  const [toolCount, setToolCount] = useState<number | null>(null);

  const columns: ColumnDef<Session>[] = useMemo(
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
        cell: ({ row }) => (
          <Button
            variant="link"
            onClick={() => {
              updateGenerateState({
                isChatWidgetOpen: true,
                activeChatSessionId: row.original.id,
              });
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessorKey: "status",
        header: t("table.column.status"),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="text-muted-foreground px-1.5 flex items-center gap-1"
          >
            {row.original.status === "active" ? (
              <CircleCheck className="fill-green-500 dark:fill-green-400 h-4 w-4" />
            ) : row.original.status === "inactive" ? (
              <CircleCheck className="fill-red-500 dark:fill-red-400 h-4 w-4" />
            ) : (
              <Loader className="h-4 w-4 animate-spin" />
            )}
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "assigned_tool_id",
        header: "Assigned Tool ID",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const session = row.original;

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
                  onClick={() =>
                    navigator.clipboard.writeText(session.assigned_tool_id)
                  }
                >
                  {t("table.actions.copy-tool-id")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await sessionService.deleteSession(session.id);
                    const deletedSessionIds = selectedItems.map(
                      (item) => item.id
                    );
                    updateGenerateState({
                      activeChatSessionId: null,
                      toolSessionLinks: generalState.toolSessionLinks.filter(
                        (link) => !deletedSessionIds.includes(link.sessionId)
                      ),
                    });
                    await fetchSessions();
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

  useEffect(() => {
    async function fetch() {
      setToolCount(unwrapOr(await toolService.getAllTools(), []).length);
    }

    fetch();
  }, []);
  async function fetchSessions() {
    setLoading(true);
    const sessions = unwrapOr(await sessionService.getAllSessions(), []);
    updateGenerateState({ openedSessions: sessions });
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase text-muted-foreground tracking-widest">
            {t("statistics.sessions")}
          </span>
          <span className="text-3xl font-bold text-foreground">
            {generalState.openedSessions.length}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase text-muted-foreground tracking-widest">
            {t("statistics.active-tools")}
          </span>
          <span className="text-3xl font-bold text-foreground">
            {toolCount !== null ? (
              toolCount
            ) : (
              <Skeleton className="h-6 w-10 rounded-md" />
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updateGenerateState({
              isChatWidgetOpen: true,
              activeChatSessionId: null,
            });
          }}
        >
          <Plus />
          <span className="hidden lg:inline"> {t("table.add-item")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={selectedItems.length === 0}
          onClick={() => {
            setSessionDeleteModalVisible(true);
          }}
        >
          <Minus />
          <span className="hidden lg:inline"> {t("table.delete")}</span>
        </Button>
      </div>
      {loading ? (
        <div className="rounded-md border divide-y">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-4 p-4 items-center">
              <Skeleton className="h-4 w-4 rounded" /> {/* checkbox */}
              <Skeleton className="h-4 w-32 col-span-1" /> {/* name */}
              <Skeleton className="h-4 w-24 col-span-1" /> {/* status */}
              <Skeleton className="h-4 w-32 col-span-2" /> {/* assigned tool */}
              <Skeleton className="h-4 w-6 justify-self-end" /> {/* actions */}
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={generalState.openedSessions.sort((a, b) =>
            a.name.localeCompare(b.name)
          )}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectedRowsChange={(selected) => setSelectedItems(selected)}
        />
      )}

      {/* Session Delete Dialog */}
      <Dialog
        open={sessionDeleteModalVisible}
        onOpenChange={setSessionDeleteModalVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("chatWidget:delete-chat")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t("chatWidget:delete-chat-confirm")}</p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSessionDeleteModalVisible(false)}
            >
              {t("base:cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await Promise.all(
                  selectedItems.map((item) =>
                    sessionService.deleteSession(item.id)
                  )
                );
                const deletedSessionIds = selectedItems.map((item) => item.id);
                updateGenerateState({
                  activeChatSessionId: null,
                  toolSessionLinks: generalState.toolSessionLinks.filter(
                    (link) => !deletedSessionIds.includes(link.sessionId)
                  ),
                });
                setSelectedItems([]);
                setRowSelection({});
                await fetchSessions();
                setSessionDeleteModalVisible(false);
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
