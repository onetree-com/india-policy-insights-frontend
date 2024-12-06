import Arrow from "assets/icons/Arrow";
import CloseIcon from "assets/icons/CloseIcon";
import EditIcon from "assets/icons/EditIcon";
import { AllIndia, AllIndiaChanges } from "components/AtlasContent";
import {
  prevalenceHeadcountText,
  selectedGeographyText,
  tooltipLeft,
} from "components/AtlasIndicator/util";
import IndicatorModal from "components/AtlasIndicatorModal";
import AtlasInformationBars from "components/AtlasInformationBars";
import IconContainer from "components/IconContainer";
import styles from "components/Indicator/styles.module.scss";
import IndicatorRangeChanges from "components/IndicatorRangeChanges";
import Text from "components/Text";
import Tooltip from "components/Tooltip";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { GlobalContext, DivisionTypes } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import useMediaQuery from "hooks/use-media-query";
import { indicator, readingStrategy } from "models/indicator";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDefaultIndicator } from "utils/calculateSelectedIndicatorN";
import { commarize, rangeValues, roundUp } from "utils/formatter";
import { MediaQueries } from "utils/media-queries";
import { dispatchGTMEvent } from "utils/tagManager";
import { TFunction } from "i18next";
import { roundHeadcount } from "utils/roundPrevalences";

interface Props {
  allIndia?: AllIndia;
  allIndiaChanges?: AllIndiaChanges;
  isExpandInMobile?: boolean;
  selectedChanges?: AllIndiaChanges;
}

const AtlasIndicator: FC<Props> = ({
  allIndia,
  allIndiaChanges,
  isExpandInMobile,
  selectedChanges,
}) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { getSortedIndicators } = useGlobalActions();
  const { state: navState } = useLocation();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [indicatorSelected, setIndicatorSelected] = useState<indicator>(
    atlasState.selectedIndicator!
  );
  const hideHeadCount =
    globalState.divisionType === DivisionTypes.Assembly_Constituencies ||
    globalState.divisionType === DivisionTypes.Village;

  const indicatorRangeScale = useMemo(() => {
    if (!atlasState.indicatorDeciles) return [];

    var deciles = atlasState.indicatorDeciles.deciles.slice(1, 11);

    var cutoffs = {
      prevalence: atlasState.indicatorDeciles.prevalenceCutoffs.map((i) => ({
        raw: i.toFixed(1),
        compact: i.toFixed(1),
      })),
      headcount: atlasState.indicatorDeciles.headcountCutoffs.map((i) => ({
        raw: i,
        compact: commarize(i),
      })),
    }[globalState.selectedMetric];

    var colors = {
      prevalence: atlasState.indicatorDeciles.prevalenceHx,
      headcount: atlasState.indicatorDeciles.headcountHx,
    }[globalState.selectedMetric].slice(1, 11);

    return deciles.map((decile, idx) => ({
      decile,
      color: colors[idx],
      cutoff: cutoffs[idx],
      next: cutoffs[idx + 1],
    }));
  }, [atlasState.indicatorDeciles, globalState.selectedMetric]);

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
        let indi: indicator | undefined = atlasState.selectedIndicator!;
        globalState.indicators?.every((ind) => {
          indi = ind.indicators.find((ind) => {
            return ind?.indId === Number(navState.indId);
          });
          if (indi) return false;
          else return true;
        });
        atlasDispatch({
          type: AtlasActionType.SELECT_INDICATOR,
          payload: indi,
        });
        setIndicatorSelected(indi!);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.indicators]);

  useEffect(() => {
    if (!indicatorSelected) return;

    atlasDispatch({
      type: AtlasActionType.SELECT_INDICATOR,
      payload: indicatorSelected,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicatorSelected]);

  const changeSelectedDistrictsColor = (change: number) => {
    if (!atlasState.indicatorChanges) {
      return "#f5f4f4";
    }
    const sortedIndChanges =
      atlasState.indicatorChanges?.sort(
        (a, b) => a.prevalenceChangeCutoffs - b.prevalenceChangeCutoffs
      ) || [];
    const lowest = sortedIndChanges[0];
    const low = sortedIndChanges[1];
    const high = sortedIndChanges[2];
    const highest = sortedIndChanges[3];

    if (change <= lowest.prevalenceChangeCutoffs) {
      return lowest.changeHex;
    } else if (
      change <= low.prevalenceChangeCutoffs &&
      change > lowest.prevalenceChangeCutoffs
    ) {
      return low.changeHex;
    } else if (
      change <= high.prevalenceChangeCutoffs &&
      change > low.prevalenceChangeCutoffs
    ) {
      return high.changeHex;
    } else {
      return highest.changeHex;
    }
  };

  const infoBars = (t: TFunction) => {
    return (
      <>
        <AtlasInformationBars
          title={`${t("all_india")}: ${prevalenceHeadcountText(
            globalState.selectedMetric,
            t
          )}`}
          marginTop="25px"
          content={
            atlasState.dataView.year === 2016 && allIndiaChanges ? (
              <>
                <p>
                  2021:{" "}
                  <span>{roundUp(allIndiaChanges?.prevalenceEnd) ?? 0}%</span>
                </p>
                <p>
                  2016:{" "}
                  <span>
                    {allIndiaChanges.prevalence
                      ? `${roundUp(allIndiaChanges?.prevalence)}%`
                      : "n/a"}
                  </span>
                </p>
                <p>
                  {t("change")}:{" "}
                  {allIndiaChanges?.prevalenceChange ? (
                    <Arrow
                      arrowType={
                        allIndiaChanges?.prevalenceChange > 0 ? "up" : "down"
                      }
                      size={22}
                      color={changeSelectedDistrictsColor(
                        allIndiaChanges?.prevalenceChange
                      )}
                    />
                  ) : null}
                  <span>
                    {allIndiaChanges?.prevalenceChange
                      ? `${roundUp(allIndiaChanges?.prevalenceChange)}%`
                      : "n/a"}
                  </span>
                </p>
              </>
            ) : globalState.selectedMetric === "prevalence" ? (
              <>
                <p>
                  {t("mean")}: <span>{roundUp(allIndia?.median) ?? 0}%</span>
                </p>
                <p>
                  {t("min")}: <span>{roundUp(allIndia?.min) ?? 0}%</span>
                </p>
                <p>
                  {t("max")}:<span>{roundUp(allIndia?.max) ?? 0}%</span>
                </p>
              </>
            ) : (
              <>
                <p>
                  {t("total")}:{" "}
                  <span>{roundHeadcount(allIndia?.headcountMedian) ?? 0}</span>
                </p>
                <p>
                  {t("min")}:{" "}
                  <span>{roundHeadcount(allIndia?.headcountMin) ?? 0}</span>
                </p>
                <p>
                  {t("max")}:{" "}
                  <span>{roundHeadcount(allIndia?.headcountMax) ?? 0}</span>
                </p>
              </>
            )
          }
        />

        {globalState.divisionType !== DivisionTypes.Village && (
          <AtlasInformationBars
            title={
              t("selected") +
              ` ${t(globalState.divisionType)}: ${prevalenceHeadcountText(
                globalState.selectedMetric,
                t
              )}`
            }
            marginTop="15px"
            content={
              atlasState.dataView.year === 2016 && selectedChanges ? (
                <>
                  <p>
                    2021:{" "}
                    <span>{roundUp(selectedChanges?.prevalenceEnd) ?? 0}%</span>
                  </p>
                  <p>
                    2016:{" "}
                    <span>
                      {selectedChanges.prevalence
                        ? `${roundUp(selectedChanges?.prevalence)}%`
                        : "n/a"}
                    </span>
                  </p>
                  <p>
                    {t("change")}:{" "}
                    {selectedChanges.prevalenceChange ? (
                      <Arrow
                        arrowType={
                          selectedChanges?.prevalenceChange > 0 ? "up" : "down"
                        }
                        size={22}
                        color={changeSelectedDistrictsColor(
                          selectedChanges?.prevalenceChange
                        )}
                      />
                    ) : null}
                    <span>
                      {selectedChanges?.prevalenceChange
                        ? `${roundUp(selectedChanges?.prevalenceChange)}%`
                        : "n/a"}
                    </span>
                  </p>
                </>
              ) : globalState.selectedMetric === "prevalence" ? (
                <>
                  <p>
                    {t("median")}:{" "}
                    <span>
                      {roundUp(atlasState.selectedIndicatorsData.median)}%
                    </span>
                  </p>
                  <p>
                    {t("min")}:{" "}
                    <span>
                      {roundUp(atlasState.selectedIndicatorsData.min)}%
                    </span>
                  </p>
                  <p>
                    {t("max")}:{" "}
                    <span>
                      {roundUp(atlasState.selectedIndicatorsData.max)}%
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    {t("median")}:{" "}
                    <span>
                      {roundHeadcount(
                        atlasState.selectedIndicatorsData.headcountMedian
                      )}
                    </span>
                  </p>
                  <p>
                    {t("min")}:{" "}
                    <span>
                      {roundHeadcount(
                        atlasState.selectedIndicatorsData.headcountMin
                      )}
                    </span>
                  </p>
                  <p>
                    {t("max")}:{" "}
                    <span>
                      {roundHeadcount(
                        atlasState.selectedIndicatorsData.headcountMax
                      )}
                    </span>
                  </p>
                </>
              )
            }
          />
        )}
        {atlasState.selectedDistrictMap && (
          <AtlasInformationBars
            title={`${atlasState?.selectedDistrictMap?.name ?? ""}, ${
              atlasState.selectedDistrictMap?.stateAbbreviation ?? ""
            }`}
            marginTop="15px"
            classNameContent={
              (atlasState.dataView.year === 2016 &&
                atlasState.selectedDistrictMapChanges) ||
              globalState.divisionType === DivisionTypes.Village
                ? undefined
                : styles.percentFlex
            }
            content={
              atlasState.dataView.year === 2016 &&
              atlasState.selectedDistrictMapChanges ? (
                <>
                  <p>
                    2021:{" "}
                    <span>
                      {atlasState.selectedDistrictMapChanges?.prevalenceEnd !==
                      undefined
                        ? roundUp(
                            atlasState.selectedDistrictMapChanges
                              ?.prevalenceEnd ?? 0
                          )
                        : ""}
                      %
                    </span>
                  </p>
                  <p>
                    2016:{" "}
                    <span>
                      {roundUp(
                        atlasState.selectedDistrictMapChanges?.prevalence
                      ) ?? 0}
                      %
                    </span>
                  </p>
                  <p>
                    Change:{" "}
                    <Arrow
                      arrowType={
                        atlasState.selectedDistrictMapChanges
                          ?.prevalenceChange > 0
                          ? "up"
                          : "down"
                      }
                      size={22}
                      color={atlasState.selectedDistrictMapChanges.changeHex}
                    />
                    <span>
                      {roundUp(
                        atlasState.selectedDistrictMapChanges?.prevalenceChange
                      ) ?? 0}
                      %
                    </span>
                  </p>
                </>
              ) : globalState.divisionType !== DivisionTypes.Village ? (
                <>
                  <p style={{ marginRight: "30px" }}>
                    {t("prevalence")}:{" "}
                    <span>
                      {atlasState.selectedDistrictMap.noData
                        ? "n/a"
                        : `${
                            roundUp(
                              atlasState.selectedDistrictMap?.prevalence
                            ) ?? 0
                          }%`}
                    </span>
                  </p>
                  {hideHeadCount ? (
                    <p>
                      {t("head_count")}: {t("no_data")}
                    </p>
                  ) : (
                    <p>
                      {t("head_count")}:{" "}
                      <span>
                        {atlasState.selectedDistrictMap.noData
                          ? "n/a"
                          : roundHeadcount(
                              atlasState.selectedDistrictMap?.headcount
                            ) === 0
                          ? "n/a"
                          : roundHeadcount(
                              atlasState.selectedDistrictMap?.headcount
                            )}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>
                    {t("median")}:{" "}
                    <span>
                      {roundUp(atlasState.selectedDistrictMap?.median) ?? 0}%
                    </span>
                  </p>
                  <p>
                    {t("min")}:{" "}
                    <span>
                      {roundUp(atlasState.selectedDistrictMap?.min) ?? 0}%
                    </span>
                  </p>
                  <p>
                    {t("max")}:
                    <span>
                      {roundUp(atlasState.selectedDistrictMap?.max) ?? 0}%
                    </span>
                  </p>
                </>
              )
            }
          />
        )}
        {atlasState.selectedVillageMap && (
          <AtlasInformationBars
            title={atlasState?.selectedVillageMap?.name ?? ""}
            marginTop="15px"
            classNameContent={
              atlasState.dataView.year === 2016 &&
              atlasState.selectedDistrictMapChanges
                ? undefined
                : styles.percentFlex
            }
            content={
              <>
                <p style={{ marginRight: "30px" }}>
                  {t("prevalence")}:{" "}
                  <span>
                    {roundUp(atlasState.selectedVillageMap?.prevalence) ?? 0}%
                  </span>
                </p>
                {hideHeadCount ? (
                  <p>Headcount: No data available</p>
                ) : (
                  <p>
                    Headcount:{" "}
                    <span>
                      {roundHeadcount(atlasState.selectedVillageMap?.headcount)}
                    </span>
                  </p>
                )}
              </>
            }
          />
        )}
      </>
    );
  };

  const prevalenceCutoffTextsData = () =>
    globalState.selectedMetric === "prevalence"
      ? atlasState?.indicatorDeciles?.prevalenceCutoffs.map((i) => i.toFixed(1))
      : atlasState?.indicatorDeciles?.headcountCutoffs.map((h) => commarize(h));

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  return (
    <>
      {isDesktop ? (
        <div className={styles.container}>
          <Text
            color="#3d4247"
            weight={300}
            lineHeight="11px"
            size="10px"
            style={{ marginBottom: 8, textTransform: "uppercase" }}>
            {t("indicator")}
          </Text>
          <div
            className={styles.title}
            onClick={() => setShowModal(true)}
            style={{
              cursor: "pointer",
            }}>
            <Text
              lineHeight="24px"
              weight={400}
              size="14px"
              color="#3D4247"
              style={{
                maxWidth: 260,
                whiteSpace: "nowrap",
                overflowX: "hidden",
                textOverflow: "ellipsis",
              }}
              htmlTitle={
                indicatorSelected ? indicatorSelected.indName : undefined
              }>
              {!indicatorSelected
                ? t("there_is_no_indicator")
                : currentLanguage === "en"
                ? indicatorSelected.indNameEn
                : indicatorSelected.indNameHi}
            </Text>
            <IconContainer>
              <EditIcon />
            </IconContainer>
          </div>
          {atlasState.dataView.year === 2016 ? (
            <IndicatorRangeChanges />
          ) : (
            <IndicatorRange
              indicator={indicatorSelected}
              deciles={indicatorRangeScale}
              prevalenceCutoffsTexts={prevalenceCutoffTextsData()}
            />
          )}
          {infoBars(t)}
        </div>
      ) : (
        <>
          {isExpandInMobile && (
            <>
              <Text
                color="#3d4247"
                weight={300}
                lineHeight="11px"
                size="10px"
                style={{ marginBottom: 8 }}>
                {t("indicator")}
              </Text>
              <div
                className={styles.title}
                onClick={() => setShowModal(true)}
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                }}>
                <Text
                  lineHeight="24px"
                  weight={400}
                  size="14px"
                  color="#3D4247">
                  {!indicatorSelected
                    ? t("there_is_no_indicator")
                    : currentLanguage === "en"
                    ? indicatorSelected.indName
                    : indicatorSelected.indNameHi}
                </Text>
                <IconContainer>
                  <EditIcon />
                </IconContainer>
              </div>
            </>
          )}

          {atlasState.dataView.year === 2016 ? (
            <IndicatorRangeChanges />
          ) : (
            <IndicatorRange
              indicator={indicatorSelected}
              deciles={indicatorRangeScale}
              isExpandInMobile={isExpandInMobile}
              prevalenceCutoffsTexts={prevalenceCutoffTextsData()}
            />
          )}
          {isExpandInMobile && infoBars(t)}
          {!isExpandInMobile && (
            <Text
              style={{ marginTop: "10px" }}
              lineHeight="24px"
              weight={400}
              size="14px"
              color="#3D4247">
              {!indicatorSelected
                ? t("there_is_no_indicator")
                : `${atlasState.dataView.year === 2016 ? "2016" : "2021"} / ${
                    indicatorSelected.indName
                  } / ${selectedGeographyText(
                    atlasState.selectedDivisions,
                    globalState.allDivisions,
                    globalState.divisionType,
                    t,
                    atlasState.selectedDistrictMap
                  )}`}
            </Text>
          )}
        </>
      )}
      {showModal && (
        <IndicatorModal
          showModal={showModal}
          setShowModal={setShowModal}
          indicators={getSortedIndicators()}
          indicatorSelected={indicatorSelected!}
          setIndicatorSelected={setIndicatorSelected}
        />
      )}
    </>
  );
};

export const updateAtlasSelectedDecile = (
  decile: number | string,
  atlasState: any,
  globalState: any,
  selectedDeciles: any,
  setSelectedDeciles: any,
  decileId?: number
) => {
  dispatchGTMEvent({
    event: "decile_filter",
    indicator: atlasState.selectedIndicator?.indNameEn,
    division: `${
      atlasState.selectedDivisions.flatMap((y: any) => y.id).length
    } ${globalState.divisionType} Selected`,
    date_range:
      atlasState.dataView.yearEnd === undefined
        ? atlasState.dataView.year
        : `${atlasState.dataView.year} - ${atlasState.dataView.yearEnd}`,
    display_by: globalState.selectedMetric,
    decile_action: selectedDeciles.includes(decile as any)
      ? "exclude"
      : "include",
    decile_selected:
      atlasState.dataView.yearEnd === undefined ? decile : decileId,
  });
  setSelectedDeciles((selected: any) =>
    selected.includes(decile)
      ? selected.filter((d: any) => d !== decile)
      : selected.concat(decile)
  );
};

export const IndicatorRange: FC<{
  indicator: indicator;
  deciles: Array<{
    decile: number;
    color: string;
    cutoff: { raw: any; compact: any };
    next: { raw: any; compact: any };
  }>;
  prevalenceCutoffsTexts?: any[];
  isExpandInMobile?: boolean;
}> = ({ indicator, deciles, isExpandInMobile, prevalenceCutoffsTexts }) => {
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const isTablet = useMediaQuery(MediaQueries.TABLET);
  const isPhone = !(isTablet || isDesktop);
  const { state: navState } = useLocation();
  const { t } = useTranslation();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicator]);

  useEffect(() => {
    atlasDispatch({
      type: AtlasActionType.SELECT_DECILES,
      payload:
        selectedDeciles.length === 0
          ? deciles.map((x) => x.decile)
          : selectedDeciles,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deciles, selectedDeciles]);

  const selectedDecilesJsx =
    selectedDeciles.length === 0 ? (
      <Text
        style={{ marginTop: "22.04px", marginBottom: "21.5px" }}
        lineHeight="17px"
        weight={300}
        size="12px"
        color="#575A5C">
        {t("click_to_filer")}
      </Text>
    ) : (
      <div className={styles["reset-filter"]}>
        <p>{t("reset_filter")}</p>
        <CloseIcon
          onClick={(): void => {
            setSelectedDeciles([]);
          }}
        />
      </div>
    );

  const indicatorReadingStrategyText = (
    <Text
      style={{ letterSpacing: "0.04em" }}
      lineHeight="10.5px"
      weight={300}
      size="10px"
      color="#575A5C">
      {indicatorReadingStrategy.hint}
    </Text>
  );

  return (
    <>
      {isPhone
        ? isExpandInMobile
          ? indicatorReadingStrategyText
          : null
        : indicatorReadingStrategyText}
      {isPhone
        ? isExpandInMobile
          ? selectedDecilesJsx
          : null
        : selectedDecilesJsx}
      <div className={styles.range}>
        <div className={styles["better-worse"]}>
          <Text>{indicatorReadingStrategy?.lower}</Text>
          <div className={styles.line}></div>
          <Text>{indicatorReadingStrategy?.higher}</Text>
        </div>
        <div className={styles.bar}>
          {deciles.map(({ decile, color, cutoff, next }, index) => (
            <BarColor
              index={index}
              key={decile}
              decile={decile}
              color={color}
              cutoff={cutoff.compact}
              range={`${rangeValues(cutoff.raw)}-${rangeValues(next.raw)}`}
              isActive={selectedDeciles.includes(decile)}
              setIsActive={(decile) => {
                updateAtlasSelectedDecile(
                  decile,
                  atlasState,
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
    </>
  );
};

export const BarColor: FC<{
  decile: number;
  index: number;
  cutoff: number;
  color: string;
  range: string;
  isActive: boolean;
  setIsActive: (decile: number) => void;
  prevalenceCutoffsTexts?: any[];
}> = ({
  index,
  decile,
  cutoff,
  color,
  range,
  isActive,
  setIsActive,
  prevalenceCutoffsTexts,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <Tooltip
        top="-20px"
        {...tooltipLeft(index, String(range))}
        show={showTooltip}
        arrow={false}
        label={String(range)}
      />
      <button
        id={`bar-color-${index}`}
        style={{
          backgroundColor: color,
        }}
        className={`${isActive ? styles.active : ""} ${
          index === 9 ? styles.lastChild : ""
        }`}
        onClick={() => {
          setIsActive(decile);
        }}
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}></button>

      {prevalenceCutoffsTexts ? (
        index < 9 ? (
          <p style={{ marginLeft: "-6px" }}>{prevalenceCutoffsTexts[index]}</p>
        ) : (
          <>
            <p style={{ marginLeft: "-6px" }}>
              {prevalenceCutoffsTexts[index]}
            </p>
            <p style={{ position: "absolute", bottom: "0px", right: "8px" }}>
              {prevalenceCutoffsTexts[index + 1]}
            </p>
          </>
        )
      ) : (
        <p>{cutoff}</p>
      )}
    </div>
  );
};

export default AtlasIndicator;
