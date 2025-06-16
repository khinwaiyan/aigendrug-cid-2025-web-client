import { Outlet } from "react-router-dom";
import { GlobalHeader } from "./global-header";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { NavigationPanel } from "./navigation-side-bar";
export const BaseLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <GlobalHeader />

      <SidebarProvider>
        <NavigationPanel />
        <main className="pt-20 p-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};
