import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarHeader,
} from "../components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGeneralContext } from "../context/general-context";
import { APP_NAME } from "../common/constants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { ChevronRight, LayoutDashboard, Plus, Bot } from "lucide-react";

export const NavigationPanel = () => {
  const { t } = useTranslation("base", { keyPrefix: "navigation-panel" });
  const location = useLocation();
  const { generalState } = useGeneralContext();
  const toolSessionLinks = generalState.toolSessionLinks ?? [];

  const isActive = (path: string) => location.pathname === path;
  const items = [
    {
      title: t("dashboard"),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t("tool-registration"),
      url: "/tool-registration",
      icon: Plus,
    },
    {
      title: t("tool-session"),
      subItems: toolSessionLinks.map((link) => ({
        title: `${link.toolName}(S-${link.sessionId.slice(0, 4)})`,
        url: `/tool-input/${link.sessionId}/${link.toolId}`,
      })),
      icon: Bot,
    },
  ];

  return (
    <Sidebar className="fixed top-16 left-0 h-[calc(100vh-64px)] bg-background border-r z-40 overflow-y-auto">
      <SidebarHeader>
        <div className="p-1 text-lg font-bold">{APP_NAME}</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="flex items-center gap-2 w-full justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon size={16} />
                              <span>{item.title}</span>
                            </div>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem, subIndex) => (
                              <SidebarMenuSubItem key={subIndex}>
                                <Link
                                  to={subItem.url}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded hover:bg-muted ${
                                    isActive(subItem.url)
                                      ? "font-semibold text-blue-600"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-2 ${
                          isActive(item.url)
                            ? "font-semibold text-blue-600"
                            : ""
                        }`}
                      >
                        <item.icon size={16} />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
