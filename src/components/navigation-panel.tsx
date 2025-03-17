import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { useOnFollow } from "../common/hooks/use-on-follow";
import { APP_NAME } from "../common/constants";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavigationPanel() {
  const location = useLocation();
  const onFollow = useOnFollow();
  const { t } = useTranslation([], { keyPrefix: "navigation-panel" });
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();

  const items: SideNavigationProps.Item[] = [
    {
      type: "link",
      text: t("dashboard"),
      href: "/",
    },
    {
      type: "section",
      text: t("tool-session"),
      items: [],
    },
  ];

  const onChange = ({
    detail,
  }: {
    detail: SideNavigationProps.ChangeDetail;
  }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <SideNavigation
      onFollow={onFollow}
      onChange={onChange}
      header={{ href: "/", text: APP_NAME }}
      activeHref={location.pathname}
      items={items.map((value, idx) => {
        if (value.type === "section") {
          const collapsed =
            navigationPanelState.collapsedSections?.[idx] === true;
          value.defaultExpanded = !collapsed;
        }

        return value;
      })}
    />
  );
}
