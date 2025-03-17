import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import { USE_BROWSER_ROUTER } from "./common/constants";
import GlobalHeader from "./components/global-header";
import NotFound from "./pages/not-found";
import "./styles/app.scss";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ChatFab from "./components/chat-widget/chat-fab";
import ChatWidget from "./components/chat-widget/chat-widget";
import { GeneralProvider } from "./context/general-context";

export default function App() {
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;

  return (
    <div style={{ height: "100%" }}>
      <Router>
        <GeneralProvider>
          <GlobalHeader />
          <div style={{ height: "56px", backgroundColor: "#000716" }}>
            &nbsp;
          </div>
          <div>
            <Routes>
              <Route index path="/" element={<DashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <ChatFab />
          <ChatWidget />
        </GeneralProvider>
      </Router>
    </div>
  );
}
