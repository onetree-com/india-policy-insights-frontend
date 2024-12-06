import { getMeasurements } from "api/getMeasurements";
import { getIndicatorCategories } from "api/indicatorCategories";
import CopyLinkButton from "components/CopyLinkButton";
import CopyLinkVillagesButton from "components/CopyLinkButton/CopyLinkVillages";
import styles from "components/DeepDiveContent/styles.module.scss";
import DeepDiveMap from "components/DeepDiveMap";
import DeepDiveSidebar from "components/DeepDiveSidebar";
import IndicatorCategory from "components/IndicatorCategory";
import PopulationProfile from "components/PopulationProfile";
import ProgressBar from "components/ProgressBar";
import References from "components/References";
import { DeepDiveActionType, DeepDiveContext } from "context/deepDiveContext";
import { useDeepDiveActions } from "context/deepDiveContext/useDeepDiveActions";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { indicator, indicatorCategory } from "models/indicator";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { calculateSelectedIndicatorCount } from "utils/calculateSelectedIndicatorN";
import { loadDivision } from "utils/loadEntities";
import { MediaQueries } from "utils/media-queries";
import { roundPrevalence } from "utils/roundPrevalences";
import { dispatchGTMEvent } from "utils/tagManager";
import useDeepDiveNavigation from "views/deep_dive/useDeepDiveNavigation";

const DeepDiveContent: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const isTablet = useMediaQuery(MediaQueries.TABLET);
  const isPhone = !(isTablet || isDesktop);

  const { setAllIndicators } = useDeepDiveActions();
  useDeepDiveNavigation();
  const { state, dispatch } = useContext(DeepDiveContext)!;
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const getIndicators = async (abortController: AbortController) => {
    try {
      const data = await getIndicatorCategories<indicatorCategory[]>({
        RegCount: 1000,
        RegIgnored: 0,
        controller: abortController,
        currentLanguage,
      });
      setAllIndicators(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    getIndicators(abortController);
    return () => {
      abortController.abort();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentLanguage]);

  const normalizeData = (
    allIndia: indicator[],
    stateValues: indicator[],
    indicatorCat: indicator[]
  ): Partial<indicator>[] | void => {
    const result: Partial<indicator>[] = [];
    if (indicatorCat) {
      indicatorCat.forEach((indicator) => {
        let allIndiaIndicator = allIndia.find((allIndiaInd) => {
          return allIndiaInd.indId === indicator.indId;
        });
        let stateIndicator = stateValues.find((stateInd) => {
          return stateInd.indId === indicator.indId;
        });
        const roundedIndicatorPrevalence =
          indicator.prevalence !== undefined
            ? roundPrevalence(indicator.prevalence!)
            : undefined;
        const roundedIndicatorPrevalenceEnd =
          indicator.prevalenceEnd !== undefined
            ? roundPrevalence(indicator.prevalenceEnd!)
            : undefined;

        result.push(
          state.dataView === "2021"
            ? {
                ...indicator,
                prevalence: roundedIndicatorPrevalence,
                prevalenceColor: indicator.prevalenceColor?.slice(0, 7),
                allIndia: roundPrevalence(allIndiaIndicator?.prevalence!),
                stateValue: roundPrevalence(stateIndicator?.prevalence!),
              }
            : {
                ...indicator,
                prevalence: roundedIndicatorPrevalence,
                prevalenceEnd: roundedIndicatorPrevalenceEnd,
                prevalenceColor: indicator.prevalenceColor?.slice(0, 7),
                higherValue:
                  indicator.prevalence! > indicator.prevalenceEnd!
                    ? indicator.prevalence
                    : indicator.prevalenceEnd,
                lowerValue:
                  indicator.prevalence! < indicator.prevalenceEnd!
                    ? indicator.prevalence
                    : indicator.prevalenceEnd,
                allIndia: roundPrevalence(
                  allIndiaIndicator!.prevalenceEnd! -
                    allIndiaIndicator!.prevalence!
                ),
                stateValue: roundPrevalence(
                  stateIndicator!.prevalenceEnd! - stateIndicator!.prevalence!
                ),
              }
        );
      });
      return result;
    } else {
      return result;
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const getIndicatorsData = async () => {
      if (
        (globalState.divisionType !== DivisionTypes.Village &&
          globalState.selectedDivision?.division?.id) ||
        state.selectedDivision?.village?.id
      ) {
        setIsLoading(true);
        let data: indicatorCategory[] | undefined;
        if (state.selectedIndicators && state.selectedIndicators.length === 0) {
          data = await getIndicators(abortController);
        }
        const selectedIndicators = state.selectedIndicators ?? data;

        Promise.all<any>(
          selectedIndicators.map((indicatorCategory) => {
            return getMeasurements<indicatorCategory>(
              globalState.divisionType !== DivisionTypes.Village
                ? {
                    StateId: globalState.selectedDivision?.stateId!,
                    RegionType: globalState.divisionType,
                    RegionId: globalState.selectedDivision?.division.id!,
                    Year: state.dataView === "2016 - 2021" ? 2016 : 2021,
                    Indicators: indicatorCategory.indicators.map(
                      (indicator) => {
                        return indicator.indId!;
                      }
                    ),
                    controller: abortController,
                    YearEnd: state.dataView === "2016 - 2021" ? 2021 : 0,
                    currentLanguage,
                  }
                : {
                    StateId: state.selectedDivision?.district.id!,
                    RegionType: globalState.divisionType,
                    RegionId: state.selectedDivision?.village.id!,
                    Year: state.dataView === "2016 - 2021" ? 2016 : 2021,
                    Indicators: indicatorCategory.indicators.map(
                      (indicator) => {
                        return indicator.indId!;
                      }
                    ),
                    controller: abortController,
                    YearEnd: state.dataView === "2016 - 2021" ? 2021 : 0,
                    currentLanguage,
                  }
            );
          })
        ).then((data) => {
          if (data) {
            dispatch({
              type: DeepDiveActionType.BULK_UPDATE_INDICATOR_CATEGORY,
              payload: data.map((indCategory, index) => {
                indCategory.indicators = indCategory.region?.map(
                  (indicator: indicator, indIndex: number) => {
                    return {
                      ...indicator,
                    };
                  }
                );
                return {
                  catId: indCategory.catId,
                  catName: indCategory.catName,
                  indicators: normalizeData(
                    indCategory.allIndia,
                    indCategory.state,
                    indCategory.indicators
                  ),
                };
              }),
            });
            setIsLoading(false);
          }
        });
      }
    };
    getIndicatorsData();
    dispatchGTMEvent({
      event: "render_deepdive",
      indicators: calculateSelectedIndicatorCount(
        state.selectedIndicators,
        state.allIndicators
      ),
      division:
        globalState.divisionType !== DivisionTypes.Village
          ? `${globalState.selectedDivision?.division?.nameEn ?? "no"} ${
              globalState.divisionType
            } `
          : `${state.selectedDivision?.village?.nameEn ?? "no"} ${
              globalState.divisionType
            } `,
      date_range: state.dataView,
    });
    return () => {
      abortController.abort();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalState.selectedDivision,
    state.dataView,
    state.selectedDivision,
    currentLanguage,
  ]);

  useEffect(() => {
    if (
      globalState.rankingToDeepDiveDivision &&
      globalState.allDivisions.length
    ) {
      const division = loadDivision(
        globalState.allDivisions,
        Number(globalState.rankingToDeepDiveDivision?.id)
      );
      if (division) {
        globalDispatch({
          type: GlobalActionType.SELECT_DIVISION,
          payload: division,
        });
      }
    }
  }, [
    globalDispatch,
    globalState.allDivisions,
    globalState.rankingToDeepDiveDivision,
  ]);

  return (
    <>
      <div className={styles.container}>
        <DeepDiveSidebar isPending={isLoading} />
        <div className={`${styles.content} ${isLoading ? styles.loading : ""}`}>
          {isDesktop ? null : (
            <>
              <DeepDiveMap parentClassnameStyles={isPhone} />
              <PopulationProfile
                districtName={
                  globalState.divisionType !== DivisionTypes.Village
                    ? globalState.selectedDivision?.division?.name!
                    : globalState.selectedDivision &&
                      Object.values(globalState.selectedDivision!).length !== 0
                    ? globalState.selectedDivision?.village?.name
                    : ""
                }
              />
            </>
          )}
          {isLoading ? (
            <div className={styles.loader}>
              <ProgressBar />
            </div>
          ) : null}
          <div className={styles.referenceContainer}>
            <References dataView={state.dataView} />
          </div>
          <div className={styles.indicatorsContainer}>
            {state.selectedIndicators.map((item: indicatorCategory) => {
              return item.indicators.length !== 0 &&
                item.indicators.some((indicator) => {
                  return indicator.deleted !== true;
                }) ? (
                <IndicatorCategory
                  key={`Indicator_category${item.catId}`}
                  catId={item.catId}
                  catName={item.catName}
                  indicators={item.indicators.filter((indicator) => {
                    return (
                      indicator.deleted !== true ||
                      indicator.deleted === undefined
                    );
                  })}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
      {globalState.divisionType !== DivisionTypes.Village ? (
        <CopyLinkButton
          lang={currentLanguage}
          buttonStyles={{ position: "fixed" }}
          subregionId={
            globalState.selectedDivision
              ? globalState.selectedDivision.division?.id
              : undefined
          }
          indicatorsCategory={state.selectedIndicators}
          dataView={state.dataView}
        />
      ) : (
        <CopyLinkVillagesButton
          lang={currentLanguage}
          buttonStyles={{ position: "fixed" }}
          subregionId={
            state.selectedDivision
              ? `${state.selectedDivision?.district?.id}-${state.selectedDivision?.village?.id}`
              : undefined
          }
          indicatorsCategory={state.selectedIndicators}
          dataView={state.dataView}
        />
      )}
    </>
  );
};

export default DeepDiveContent;
