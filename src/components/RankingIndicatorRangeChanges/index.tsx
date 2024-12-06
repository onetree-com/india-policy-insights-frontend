import { RankingActionType, RankingContext } from "context/rankingContext";
import { GlobalContext } from "context/globalContext";
import { indicatorChanges } from "models/indicator";
import { FC, useContext, useEffect, useMemo, useState, Fragment } from "react";
import styles from "components/IndicatorRangeChanges/styles.module.scss";
import Text from "components/Text";
import cx from "classnames";
import { roundUp } from "utils/formatter";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { dispatchGTMEvent } from "utils/tagManager";

export const updateRankingSelectedDecile = (
  decile: string | number,
  rankingState: any,
  globalState: any,
  selectedDeciles: any,
  setSelectedDeciles: any,
  decileId?: number
) => {
  dispatchGTMEvent({
    event: "decile_filter",
    indicator: rankingState.selectedIndicator?.indNameEn,
    division: `${
      rankingState.selectedDivisions.flatMap((y: any) => y.id).length
    } ${globalState.divisionType} Selected`,
    date_range:
      rankingState.dataView.yearEnd === undefined
        ? rankingState.dataView.year
        : `${rankingState.dataView.year} - ${rankingState.dataView.yearEnd}`,
    display_by: globalState.selectedMetric,
    decile_action: selectedDeciles.includes(decile) ? "exclude" : "include",
    decile_selected:
      rankingState.dataView.yearEnd === undefined ? decile : decileId,
  });
  setSelectedDeciles((selected: any) =>
    selected.includes(decile)
      ? selected.filter((d: any) => d !== decile)
      : selected.concat(decile)
  );
};

const RankingIndicatorRangeChanges = () => {
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();
  const { t } = useTranslation();
  const [selectedDeciles, setSelectedDeciles] = useState<Array<string>>(
    navState?.decilesChange
      ? ((navState?.decilesChange as string).split(",") as any[]).map(
          (dec) => dec
        )
      : []
  );

  const indicatorChanges = useMemo<indicatorChanges[]>(() => {
    if (!rankingState.indicatorChanges) return [];
    return rankingState.indicatorChanges;
  }, [rankingState.indicatorChanges]);

  const indicatorChangesCutoffs = useMemo<indicatorChanges[]>(() => {
    const cutoffs: indicatorChanges[] = [];
    rankingState?.indicatorChangesExtraValue?.forEach((item) => {
      cutoffs.unshift(item);
    });
    return cutoffs;
  }, [rankingState.indicatorChangesExtraValue]);

  useEffect(() => {
    rankingDispatch({
      type: RankingActionType.SELECT_DECILES_CHANGES,
      payload:
        selectedDeciles.length === 0
          ? indicatorChanges.map((x) => x.changeHex)
          : selectedDeciles,
    });
  }, [indicatorChanges, selectedDeciles, rankingDispatch]);

  if (indicatorChanges?.length === 0) return <div />;
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {indicatorChanges?.map((indicator, key) => (
          <Fragment key={key}>
            <IndicatorRangeChangesBarColor
              isActive={selectedDeciles.includes(indicator.changeHex)!}
              setIsActive={(decile, decileId) => {
                updateRankingSelectedDecile(
                  decile,
                  rankingState,
                  globalState,
                  selectedDeciles,
                  setSelectedDeciles,
                  decileId
                );
              }}
              changeDescription={indicator.changeDescription}
              decileId={indicator.prevalenceChangeId}
              color={indicator.changeHex}
              prevalenceChangeCutoffs={indicator.prevalenceChangeCutoffs}
              regionType={globalState.divisionType}
              t={t}
            />
          </Fragment>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}>
        {indicatorChangesCutoffs?.map((i, index) => {
          return (
            <span
              className={styles.cutoffText}
              style={
                index === 3
                  ? { marginLeft: 12 }
                  : index === 1
                  ? { marginRight: 12 }
                  : {}
              }>
              {roundUp(i?.prevalenceChangeCutoffs)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const IndicatorRangeChangesBarColor: FC<{
  color: string;
  decileId: number;
  changeDescription: string;
  prevalenceChangeCutoffs: number;
  regionType: string;
  isActive: boolean;
  setIsActive: (decile: string, decileId: number) => void;
  t: (key: string) => string;
}> = ({
  color,
  changeDescription,
  decileId,
  prevalenceChangeCutoffs,
  regionType,
  isActive,
  setIsActive,
  t,
}) => {
  const { rankingState } = useContext(RankingContext)!;
  const districts = rankingState.divisionsMeasurementsChanges?.filter(
    (division) => division.changeHex === color
  );
  const districtsTotal = districts?.length;
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className={styles.barColorContainer}>
      <section
        className={cx(
          styles.customTooltip,
          styles.top,
          showTooltip && styles["inline-block"]
        )}
        style={{ left: "0px", top: "-45px" }}>
        <label>
          {districtsTotal} {t(regionType)}
        </label>
        <label>{t(changeDescription.toLowerCase().replace(" ", "_"))}</label>
      </section>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text
          style={{
            width: "80%",
            height: "15px",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          lineHeight="10px"
          weight={300}
          size="8px"
          color="#3D4247">
          {t(changeDescription.toLowerCase().replace(" ", "_"))}
        </Text>
      </div>

      <button
        className={cx(isActive && styles.active)}
        onClick={() => {
          setIsActive(color, decileId);
        }}
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        style={{ backgroundColor: color }}></button>
    </div>
  );
};

export default RankingIndicatorRangeChanges;
