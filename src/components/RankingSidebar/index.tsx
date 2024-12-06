import { getIndicatorChanges } from "api/getIndicatorChanges";
import { getIndicatorDeciles } from "api/getIndicatorDeciles";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import { BarColor } from "components/AtlasIndicator";
import CopyLinkButton from "components/CopyLinkButton";
import stylesIndicator from "components/Indicator/styles.module.scss";
import RankingDataView from "components/RankingDataView";
import RankingDivisionFilter from "components/RankingDivisionFilter";
import RankingIndicator from "components/RankingIndicator";
import RankingIndicatorRangeChanges, {
  updateRankingSelectedDecile,
} from "components/RankingIndicatorRangeChanges";
import styles from "components/RankingSidebar/styles.module.scss";
import RankingTable from "components/RankingTable";
import Text from "components/Text";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { RankingActionType, RankingContext } from "context/rankingContext";
import useMediaQuery from "hooks/use-media-query";
import { t } from "i18next";
import { indicator, indicatorChanges, readingStrategy } from "models/indicator";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { commarize } from "utils/formatter";
import { MediaQueries } from "utils/media-queries";

export interface BodyTableDataRanking {
  district: string;
  stateName: string;
  stateAbbreviation: string;
  prevalence: number;
  prevalenceRank: number;
  prevalencePercent: number;
  headcount: number;
  headcountRank: number;
  headcountPercent: number;
  geoId: string;
  id: number;
  prevalenceEnd?: number;
  prevalenceChange?: number;
  changeDescription?: string;
  changeHex?: string;
}

const RankingSidebar: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [expand, setExpand] = useState<boolean>(false);
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const indicatorRangeScale = useMemo(() => {
    if (!rankingState.indicatorDeciles) return [];

    var deciles = rankingState.indicatorDeciles.deciles.slice(1, 11);

    var cutoffs = {
      prevalence: rankingState.indicatorDeciles.prevalenceCutoffs.map((i) => ({
        raw: i,
        compact: i.toFixed(1),
      })),
      headcount: rankingState.indicatorDeciles.headcountCutoffs.map((i) => ({
        raw: i,
        compact: commarize(i),
      })),
    }[globalState.selectedMetric];

    var colors = {
      prevalence: rankingState.indicatorDeciles.prevalenceHx,
      headcount: rankingState.indicatorDeciles.headcountHx,
    }[globalState.selectedMetric].slice(1, 11);

    return deciles.map((decile, idx) => ({
      decile,
      color: colors[idx],
      cutoff: cutoffs[idx],
      next: cutoffs[idx + 1],
    }));
  }, [rankingState.indicatorDeciles, globalState.selectedMetric]);

  const prevalenceCutoffTextsData = () =>
    globalState.selectedMetric === "prevalence"
      ? rankingState?.indicatorDeciles?.prevalenceCutoffs.map((i) =>
          i.toFixed(1)
        )
      : rankingState?.indicatorDeciles?.headcountCutoffs.map((h) =>
          commarize(h)
        );

  const tbodyData: BodyTableDataRanking[] = rankingState.dataView.yearEnd
    ? rankingState.divisionsMeasurementsChanges
      ? rankingState.divisionsMeasurementsChanges.map((division) => ({
          district: division.name,
          stateName: division.stateName,
          stateAbbreviation: division.stateAbbreviation,
          prevalence: division.prevalence,
          prevalenceRank: 0,
          prevalencePercent: rankingState.dataView.yearEnd
            ? division.prevalenceChange || 0
            : division.prevalence,
          headcount: 0,
          headcountRank: 0,
          headcountPercent: division.headcount,
          geoId: division.geoId,
          id: division.regionId,
          prevalenceEnd: division.prevalenceEnd,
          prevalenceChange: division.prevalenceChange,
          changeDescription: division.changeDescription,
          changeHex: division.changeHex,
        }))
      : []
    : rankingState.divisionsMeasurements.map((division) => ({
        district: division.name,
        stateName: division.stateName,
        stateAbbreviation: division.stateAbbreviation,
        prevalence: division.prevalenceRank,
        prevalenceRank: rankingState.dataView.yearEnd
          ? division.prevalenceChangeRank || 0
          : division.prevalenceRank,
        prevalencePercent: rankingState.dataView.yearEnd
          ? division.prevalenceChange || 0
          : division.prevalence,
        headcount: division.headcountRank,
        headcountRank: division.headcountRank,
        headcountPercent: division.headcount,
        geoId: division.geoId,
        id: division.id,
        prevalenceEnd: division.prevalenceEnd,
        prevalenceChange: division.prevalenceChange,
      }));
  const content = (
    <>
      <div
        style={
          isDesktop ? {} : expand ? { display: "flex" } : { display: "none" }
        }
        className={styles["data-view-section"]}>
        <div className={styles["data-view"]}>
          <Text color="#3d4247" weight={300} lineHeight="11px" size="10px">
            {t("data_view")}
          </Text>
          <RankingDataView />
        </div>
        {isDesktop &&
          (rankingState.dataView.year === 2016 ? (
            <RankingIndicatorRangeChanges />
          ) : (
            <IndicatorRangeRanking
              indicator={rankingState.selectedIndicator!}
              deciles={indicatorRangeScale}
              prevalenceCutoffsTexts={prevalenceCutoffTextsData()}
            />
          ))}
      </div>
      <div
        className={styles["indicator-section"]}
        style={
          isDesktop ? {} : expand ? { display: "flex" } : { display: "none" }
        }>
        <RankingIndicator />
        <RankingDivisionFilter />
      </div>
    </>
  );
  useEffect(() => {
    if (!rankingState.selectedIndicator) return;
    const controller = new AbortController();
    getIndicatorDeciles({
      year: 2021,
      indicators: [rankingState.selectedIndicator.indId!],
      RegionType: globalState.divisionType,
      currentLanguage,
    }).then((data: any) => {
      rankingDispatch({
        type: RankingActionType.SET_INDICATOR_DECILES,
        payload: Array.isArray(data) ? Array.from(data).at(0) : [],
      });
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingState.selectedIndicator, rankingDispatch, currentLanguage]);

  useEffect(() => {
    if (!rankingState.selectedIndicator) return;
    const controller = new AbortController();
    if (rankingState.dataView.year === 2016) {
      getIndicatorChanges({
        RegCount: 1000,
        RegIgnored: 0,
        Indicators: [rankingState.selectedIndicator.indId!],
        RegionType: globalState.divisionType,
        controller,
        currentLanguage,
      }).then((data: any) => {
        rankingDispatch({
          type: RankingActionType.SET_INDICATOR_CHANGES,
          payload:
            data.filter((i: any) => i.changeDescription !== undefined) ?? [],
        });
        rankingDispatch({
          type: RankingActionType.SET_INDICATOR_CHANGES_EXTRA_VALUE,
          payload:
            [...data].sort((a: indicatorChanges, b: indicatorChanges) => {
              if (a.prevalenceChangeCutoffs < b.prevalenceChangeCutoffs) {
                return -1;
              } else if (
                a.prevalenceChangeCutoffs > b.prevalenceChangeCutoffs
              ) {
                return 1;
              }
              return 0;
            }) ?? undefined,
        });
      });
    }
    return () => {
      controller.abort();
    };
  }, [
    rankingState.selectedIndicator,
    rankingState.dataView.year,
    rankingDispatch,
    globalState.divisionType,
    currentLanguage,
  ]);

  const settingsText = () => {
    const year = rankingState.dataView.yearEnd ? "2016 - 2021" : "2021";
    const ind = rankingState.selectedIndicator
      ? rankingState.selectedIndicator.indName
      : "";
    const divisions = rankingState.selectedDivisions.length;
    const acsAndPcs =
      divisions === 1
        ? globalState.divisionType.replace("ies", "y")
        : globalState.divisionType;
    const singlePlural = divisions === 1 ? "district" : "districts";
    return `${year} / ${ind} / ${divisions} ${
      globalState.divisionType === DivisionTypes.District
        ? singlePlural
        : acsAndPcs
    }`;
  };

  return (
    <>
      <div className={styles.container}>
        {isDesktop ? (
          content
        ) : (
          <>
            <div
              className={styles.mobile}
              style={!expand ? { display: "flex" } : { display: "none" }}>
              <p>Settings</p>
              <span>{settingsText()}</span>
            </div>
            {content}
          </>
        )}

        {isDesktop && (
          <div
            style={{
              background: "white",
              height: "calc(100% - 211.25px)",
            }}>
            <div
              style={{
                marginTop: "8px",
                padding: "0 8px 0 8px",
                width: "100%",
                boxSizing: "border-box",
                overflowY: "auto",
                height: "calc(100% - 8px)",
              }}>
              {rankingState.divisionsMeasurements.length > 0 ||
              rankingState?.divisionsMeasurementsChanges?.length !== 0 ? (
                <RankingTable tbodyData={tbodyData} />
              ) : null}
            </div>
          </div>
        )}
      </div>
      {!isDesktop && (
        <>
          <CopyLinkButton
            lang={currentLanguage}
            buttonStyles={{ position: "fixed" }}
            dataView={
              rankingState.dataView.year === 2021 ? "2021" : "2016 - 2021"
            }
            indId={rankingState.selectedIndicator?.indId}
            divisions={rankingState.selectedDivisions}
            deciles={rankingState.selectedDeciles}
            decilesChange={rankingState.selectedDecilesChanges}
          />
          <div
            className={styles.bottomLine}
            onClick={(): void => setExpand(!expand)}>
            {expand ? (
              <ExpandUp color="#504F54" />
            ) : (
              <>
                <p className={styles.text}>Select</p>
                <ExpandDown color="#242328" />
              </>
            )}
          </div>
          <div
            style={{
              width: "100%",
              overflowY: "auto",
            }}>
            {rankingState?.divisionsMeasurements?.length > 0 ||
            rankingState?.divisionsMeasurementsChanges?.length !== 0 ? (
              <RankingTable tbodyData={tbodyData} />
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

const IndicatorRangeRanking: FC<{
  indicator: indicator;
  deciles: Array<{
    decile: number;
    color: string;
    cutoff: { raw: any; compact: any };
    next: { raw: any; compact: any };
  }>;
  prevalenceCutoffsTexts?: any[];
}> = ({ indicator, deciles, prevalenceCutoffsTexts }) => {
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();

  const [selectedDeciles, setSelectedDeciles] = useState<Array<number>>(
    navState?.deciles
      ? ((navState?.deciles as string).split(",") as any[]).map((dec) =>
          Number(dec)
        )
      : []
  );

  const indicatorReadingStrategy = useMemo(() => {
    switch (indicator?.indReadingStrategy) {
      case readingStrategy.LowerIsBetter:
        return {
          hint: t("lower_values"),
          lower: t("better"),
          higher: t("worse"),
        };
      case readingStrategy.HigherIsBetter:
        return {
          hint: t("lower_values"),
          lower: t("better"),
          higher: t("worse"),
        };
      default:
        return { hint: "", lower: "", higher: "" };
    }
  }, [indicator]);

  useEffect(() => {
    rankingDispatch({
      type: RankingActionType.SELECT_DECILES,
      payload:
        selectedDeciles.length === 0
          ? deciles.map((x) => x.decile)
          : selectedDeciles,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deciles, selectedDeciles, rankingDispatch]);

  return (
    <div className={stylesIndicator.range}>
      <div className={stylesIndicator["better-worse"]}>
        <Text>{indicatorReadingStrategy?.lower}</Text>
        <div className={stylesIndicator.line}></div>
        <Text>{indicatorReadingStrategy?.higher}</Text>
      </div>
      <div className={stylesIndicator.bar}>
        {deciles.map(({ decile, color, cutoff, next }, key) => (
          <BarColor
            key={decile}
            index={key}
            decile={decile}
            color={color}
            cutoff={cutoff.compact}
            range={`${cutoff.compact}-${next.compact}`}
            isActive={selectedDeciles.includes(decile)}
            setIsActive={(decile) => {
              updateRankingSelectedDecile(
                decile,
                rankingState,
                globalState,
                selectedDeciles,
                setSelectedDeciles
              );
            }}
            prevalenceCutoffsTexts={prevalenceCutoffsTexts}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingSidebar;
