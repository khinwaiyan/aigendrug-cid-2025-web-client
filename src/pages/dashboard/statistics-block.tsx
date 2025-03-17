import {
  Container,
  Header,
  ColumnLayout,
  Box,
} from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";
import { useGeneralContext } from "../../context/general-context";

export default function StatisticsBlock() {
  const {
    generalState: { openedSessions },
  } = useGeneralContext();
  const { t } = useTranslation(["dashboard"]);

  return (
    <Container header={<Header variant="h2">{t("statistics.title")}</Header>}>
      <ColumnLayout columns={4} variant="text-grid">
        <div>
          <Box variant="awsui-key-label">{t("statistics.sessions")}</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>
            {openedSessions.length}
          </div>
        </div>
        <div>
          <Box variant="awsui-key-label">{t("statistics.active-tools")}</Box>
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>5</div>
        </div>
      </ColumnLayout>
    </Container>
  );
}
