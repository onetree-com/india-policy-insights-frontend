import { getIndicatorRegions } from "api/getIndicatorRegions";
import { AllIndia, dispatchRenderEvent } from "components/AtlasContent";
import styles from "components/AtlasContent/styles.module.scss";
import LoadingScreen from "components/LoadingScreen";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { FC, useContext, useEffect, useState } from "react";
import useAtlasNavigation from "views/atlas/useAtlasNavigation";
import AtlasVillageSidebar from "../AtlasVillageSidebar/AtlasVillageSidebar";
import AtlasVillageMap from "components/AtlasVillageMap";
import { useTranslation } from "react-i18next";
import { useDispatchRenderEvent } from "hooks/use-dispatch-render-event";

const AtlasVillageContent: FC = () => {
  const { globalState } = useContext(GlobalContext)!;
  const { showLoadingScreen, hideLoadingScreen } = useGlobalActions();
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const [allIndia, setAllIndia] = useState<AllIndia>({} as AllIndia);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useAtlasNavigation();

  //! updates to this setState dispatch render event inside following hook
  const setRenderEvent = useDispatchRenderEvent();

  useEffect(() => {
    if (!globalState.selectedDivision) return;

    if (!atlasState.selectedIndicator) {
      atlasDispatch({
        type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: [],
      });

      return;
    }

    var controller = new AbortController();
    showLoadingScreen();
    Promise.all([
      getIndicatorRegions({
        regionType: DivisionTypes.Village,
        regionsId: [globalState.selectedDivision?.division?.id],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
      getIndicatorRegions({
        regionType: DivisionTypes.District,
        regionsId: [globalState.selectedDivision?.division?.id],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
      //Specific api call for static All India values
      getIndicatorRegions({
        regionType: DivisionTypes.District,
        regionsId: [],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
      //Specific api call for static All India MEAN values
      getIndicatorRegions({
        regionType: "AllIndia",
        regionsId: [],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
    ])
      .then((values: any) => {
        // First result

        if (values[0]?.divisions.length !== 0) {
          if (atlasState.mapNotAvailable) {
            atlasDispatch({
              type: AtlasActionType.SET_MAP_NOT_AVAILABLE,
              payload: false,
            });
          }
          atlasDispatch({
            type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS,
            payload: values[0].divisions ?? [],
          });
        } else {
          atlasDispatch({
            type: AtlasActionType.SET_MAP_NOT_AVAILABLE,
            payload: true,
          });
        }
        atlasDispatch({
          type: AtlasActionType.SET_SELECTED_INDICATORS_DATA,
          payload: {
            median: values[0].median,
            min: values[0].min,
            max: values[0].max,
            headcountMax: values[0].headcountMax,
            headcountMedian: values[0].headcountMedian,
            headcountMin: values[0].headcountMin,
          },
        });
        const { max, maxEnd, median, medianEnd, min, minEnd, divisions } =
          values[0];
        const { name, prevalence, headcount } = values[1].divisions.at(0);
        atlasDispatch({
          type: AtlasActionType.SELECTED_DISTRICT_MAP,
          payload: {
            max,
            maxEnd,
            median,
            medianEnd,
            min,
            minEnd,
            headcount,
            prevalence,
            name,
            regionId: globalState.selectedDivision?.division.id,
          },
        });
        if (atlasState.selectedVillageMap) {
          const { id, name, prevalence } = divisions.find(
            (div: any) => div.id === atlasState.selectedVillageMap?.regionId
          );
          atlasDispatch({
            type: AtlasActionType.SELECTED_VILLAGE_MAP,
            payload: {
              prevalence,
              name,
              regionId: id,
            },
          });
        }
        //Second result
        setAllIndia((prev) => ({
          ...prev,
          max: values[2].max,
          min: values[2].min,
          headcountMax: values[2].headcountMax,
          headcountMedian: values[2].headcountMedian,
          headcountMin: values[2].headcountMin,
        }));

        // Third result
        setAllIndia((prev) => ({
          ...prev,
          median: values[3].median,
        }));
        setRenderEvent(
          dispatchRenderEvent(
            atlasState,
            globalState.divisionType,
            globalState.selectedMetric
          )
        );
      })
      .finally(() => {
        hideLoadingScreen();
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalState.selectedDivision,
    atlasState.selectedIndicator,
    atlasState.dataView,
    atlasDispatch,
    currentLanguage,
  ]);

  return (
    <div className={styles.container}>
      <AtlasVillageSidebar allIndia={allIndia} />
      {globalState.selectedDivision && <AtlasVillageMap />}
      <LoadingScreen />
    </div>
  );
};
export default AtlasVillageContent;
