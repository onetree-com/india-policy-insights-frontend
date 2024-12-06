import IndicatorModal from "components/AtlasIndicatorModal";
import stylesIndicator from "components/Indicator/styles.module.scss";
import { Selector } from "components/StateDistrictFilter";
import Text from "components/Text";
import { GlobalContext } from "context/globalContext";
import { RankingActionType, RankingContext } from "context/rankingContext";
import { indicator } from "models/indicator";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getDefaultIndicator } from "utils/calculateSelectedIndicatorN";

const RankingIndicator: FC = () => {
  const { globalState } = useContext(GlobalContext)!;
  const [showModal, setShowModal] = useState<boolean>(false);
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const { state: navState } = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [indicatorSelected, setIndicatorSelected] = useState<indicator>(
    rankingState.selectedIndicator!
  );

  useEffect(() => {
    if (globalState.indicators && globalState.indicators?.length > 0) {
      if (!navState || (navState && !navState.indId)) {
        if (currentLanguage === "en" && indicatorSelected !== undefined) {
          setIndicatorSelected({
            ...indicatorSelected,
            indName: indicatorSelected.indName,
          });
        } else if (
          currentLanguage === "hi" &&
          indicatorSelected !== undefined
        ) {
          setIndicatorSelected({
            ...indicatorSelected,
            indNameHi: indicatorSelected.indNameHi,
          });
        } else {
          setIndicatorSelected(getDefaultIndicator(globalState.indicators)!);
        }
      }

      if (navState?.indId) {
        let indi: indicator | undefined = rankingState.selectedIndicator!;
        globalState.indicators?.every((ind) => {
          indi = ind.indicators.find((ind) => {
            return ind?.indId === Number(navState.indId);
          });
          if (indi) return false;
          else return true;
        });
        rankingDispatch({
          type: RankingActionType.SELECT_INDICATOR,
          payload: indi,
        });
        setIndicatorSelected(indi!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.indicators]);

  useEffect(() => {
    if (!indicatorSelected) return;

    rankingDispatch({
      type: RankingActionType.SELECT_INDICATOR,
      payload: indicatorSelected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicatorSelected]);

  return (
    <>
      <div className={stylesIndicator.rankingContainer}>
        <Text
          color="#3d4247"
          weight={300}
          lineHeight="11px"
          size="10px"
          style={{
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
          {t("indicator")}
        </Text>
        <Selector
          htmlTitle={indicatorSelected ? indicatorSelected.indName : undefined}
          setShowModal={setShowModal}
          placeholder={
            !indicatorSelected
              ? t("there_is_no_indicator")
              : currentLanguage === "en"
              ? indicatorSelected.indName!
              : indicatorSelected.indNameHi!
          }
        />
      </div>
      {showModal && (
        <IndicatorModal
          showModal={showModal}
          setShowModal={setShowModal}
          indicators={globalState.indicators}
          indicatorSelected={indicatorSelected!}
          setIndicatorSelected={setIndicatorSelected}
        />
      )}
    </>
  );
};

export default RankingIndicator;
