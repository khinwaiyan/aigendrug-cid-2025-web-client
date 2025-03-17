import { TopNavigation } from "@cloudscape-design/components";
import { APP_NAME } from "../common/constants";
import { useTranslation } from "react-i18next";

export default function GlobalHeader() {
  // const [theme, setTheme] = useState<Mode>(StorageHelper.getTheme());
  const { t, i18n } = useTranslation();

  // const onChangeThemeClick = () => {
  //   if (theme === Mode.Dark) {
  //     setTheme(StorageHelper.applyTheme(Mode.Light));
  //   } else {
  //     setTheme(StorageHelper.applyTheme(Mode.Dark));
  //   }
  // };

  return (
    <div
      style={{ zIndex: 1002, top: 0, left: 0, right: 0, position: "fixed" }}
      id="awsui-top-navigation"
    >
      <TopNavigation
        identity={{
          href: "/",
          logo: { src: "/images/logo.png", alt: `${APP_NAME} Logo` },
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: t("Language"),
            onItemClick: (e) => {
              if (e.detail.id === "en") {
                i18n.changeLanguage("en");
              } else if (e.detail.id === "kr") {
                i18n.changeLanguage("kr");
              }
            },
            items: [
              {
                id: "en",
                itemType: "action",
                text: "English",
                disabled: i18n.language === "en",
              },
              {
                id: "kr",
                itemType: "action",
                text: "한국어",
                disabled: i18n.language === "kr",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
