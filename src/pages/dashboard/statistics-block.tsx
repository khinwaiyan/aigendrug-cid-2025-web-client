import {
  Container,
  Header,
  ColumnLayout,
  Box,
  Spinner,
} from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";
import { useGeneralContext } from "../../context/general-context";
import { useService } from "../../service/use-service";
import { useEffect, useState } from "react";
import { unwrapOr } from "../../service/service-wrapper";

export default function StatisticsBlock() {
  const {
    generalState: { openedSessions },
  } = useGeneralContext();
  const { t } = useTranslation(["dashboard"]);
  const { toolService } = useService();
  const [toolCount, setToolCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetch() {
      setToolCount(unwrapOr(await toolService.getAllTools(), []).length);
    }

    fetch();
  }, []);

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
          <div style={{ padding: "0.8rem 0", fontSize: "2.5rem" }}>
            {toolCount !== null ? toolCount : <Spinner size="big" />}
          </div>
        </div>
      </ColumnLayout>
    </Container>
  );
}
