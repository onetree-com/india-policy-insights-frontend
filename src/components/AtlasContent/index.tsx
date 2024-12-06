import { getIndicatorRegions } from "api/getIndicatorRegions";
import { getRegionMeasurementsChange } from "api/getRegionMeasurementsChange";
import styles from "components/AtlasContent/styles.module.scss";
import AtlasMap from "components/AtlasMap";
import AtlasSidebar from "components/AtlasSidebar";
import LoadingScreen from "components/LoadingScreen";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import useAtlasNavigation from "views/atlas/useAtlasNavigation";
import { maxMinAvg, getSelectedDivisionsData } from "./util";
import { useTranslation } from "react-i18next";
import { useDispatchRenderEvent } from "hooks/use-dispatch-render-event";

export const dispatchRenderEvent = (
  atlasState: any,
  divisionType: string,
  selectedMetric: string
) => {
  return {
    event: "render_atlas",
    indicator: atlasState.selectedIndicator.indNameEn,
    division: `${
      atlasState.selectedDivisions.flatMap((y: any) => y.id).length
    } ${divisionType} Selected`,
    date_range:
      atlasState.dataView.yearEnd === undefined
        ? `${atlasState.dataView.year}`
        : `${atlasState.dataView.year} - ${atlasState.dataView.yearEnd}`,
    display_by: selectedMetric,
  };
};

export interface AllIndia {
  max: number;
  min: number;
  median: number;
  headcountMax?: number;
  headcountMedian?: number;
  headcountMin?: number;
}
export interface AllIndiaChanges {
  prevalence: number;
  prevalenceChange: number;
  prevalenceEnd: number;
}

const AtlasContent: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const isTablet = useMediaQuery(MediaQueries.TABLET);
  const isPhone = !(isTablet || isDesktop);
  const { globalState } = useContext(GlobalContext)!;
  const { showLoadingScreen, hideLoadingScreen } = useGlobalActions();
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [allIndia, setAllIndia] = useState<AllIndia>({} as AllIndia);
  const [allIndiaChanges, setAllIndiaChanges] = useState<AllIndiaChanges>(
    {} as AllIndiaChanges
  );
  const [selectedChanges, setSelectedChanges] = useState<AllIndiaChanges>(
    {} as AllIndiaChanges
  );
  useAtlasNavigation();

  //! updates to this setState dispatch render event inside following hook
  const setRenderEvent = useDispatchRenderEvent();

  useEffect(() => {
    if (!atlasState.selectedIndicator) {
      return;
    }
    showLoadingScreen();
    //Get all divisions from selected divisionType  and filter them to only dispatch the ones that are selected
    //this is only called upon indicator change or dataview change
    const controller = new AbortController();

    Promise.all([
      getIndicatorRegions({
        regionType: globalState.divisionType,
        regionsId: [],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
      getIndicatorRegions({
        regionType: "AllIndia",
        regionsId: [],
        indId: atlasState.selectedIndicator.indId!,
        year: atlasState.dataView.year,
        yearEnd: atlasState.dataView.yearEnd ?? 0,
        controller,
        currentLanguage,
      }),
    ]).then((data: any) => {
      if (atlasState.selectedDistrictMap) {
        const selectedDivision = data[0].divisions.find((division: any) => {
          return division.id === atlasState.selectedDistrictMap?.regionId;
        });
        const {
          prevalence,
          prevalenceChange,
          prevalenceEnd,
          changeHex,
          id,
          name,
        } = selectedDivision;
        atlasDispatch({
          type: AtlasActionType.SELECTED_DISTRICT_MAP,
          payload: {
            name,
            prevalence,
            prevalenceChange,
            prevalenceEnd,
            changeHex,
            regionId: id,
          },
        });
      }
      const selectedDivisionsData = getSelectedDivisionsData(
        atlasState.selectedDivisions,
        data[0].divisions
      );

      atlasDispatch({
        type: AtlasActionType.SET_ALL_DIVISIONS_MEASUREMENTS,
        payload: data[0].divisions,
      });
      atlasDispatch({
        type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: selectedDivisionsData,
      });

      const { median, max, min } = maxMinAvg(
        selectedDivisionsData,
        "prevalence"
      )!;
      let dataHeadcount;
      if (globalState.divisionType !== DivisionTypes.Assembly_Constituencies) {
        dataHeadcount = maxMinAvg(selectedDivisionsData, "headcount")!;
      }

      atlasDispatch({
        type: AtlasActionType.SET_SELECTED_INDICATORS_DATA,
        payload: {
          median: median,
          min: min,
          max: max,
          headcountMax: dataHeadcount?.max ?? 0,
          headcountMedian: dataHeadcount?.median ?? 0,
          headcountMin: dataHeadcount?.min ?? 0,
        },
      });

      setAllIndia((prev) => ({
        ...prev,
        median: data[1].median,
        max: data[0].max,
        min: data[0].min,
        headcountMax: data[0].headcountMax,
        headcountMedian: data[1].headcountMedian,
        headcountMin: data[0].headcountMin,
      }));
      setRenderEvent(
        dispatchRenderEvent(
          atlasState,
          globalState.divisionType,
          globalState.selectedMetric
        )
      );
      hideLoadingScreen();
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atlasState.dataView, atlasState.selectedIndicator, currentLanguage]);

  useEffect(() => {
    if (
      atlasState.dataView.year === 2016 ||
      atlasState.divisionsMeasurements.length === 0
    ) {
      return;
    }
    //this is called when selectedDivisions change, to use stored data and de-paint unselected divisions
    showLoadingScreen();

    const selectedDivisionsData = getSelectedDivisionsData(
      atlasState.selectedDivisions,
      atlasState.allDivisionsMeasurements
    );

    if (selectedDivisionsData.length !== 0) {
      atlasDispatch({
        type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: selectedDivisionsData,
      });
    }

    const { median, max, min } = maxMinAvg(
      selectedDivisionsData,
      "prevalence"
    )!;
    let dataHeadcount;
    if (globalState.divisionType !== DivisionTypes.Assembly_Constituencies) {
      dataHeadcount = maxMinAvg(selectedDivisionsData, "headcount")!;
    }

    atlasDispatch({
      type: AtlasActionType.SET_SELECTED_INDICATORS_DATA,
      payload: {
        median: median,
        min: min,
        max: max,
        headcountMax: dataHeadcount?.max ?? 0,
        headcountMedian: dataHeadcount?.median ?? 0,
        headcountMin: dataHeadcount?.min ?? 0,
      },
    });

    hideLoadingScreen();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    atlasState.selectedDivisions,
    atlasState.selectAspirationalDistricts,
    atlasState.allDivisionsMeasurements,
  ]);

  useEffect(() => {
    if (
      !atlasState.selectedIndicator ||
      atlasState.selectedDivisions.length === 0
    ) {
      atlasDispatch({
        type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: [],
      });

      return;
    }
    if (atlasState.dataView.year !== 2016) return;
    //fetch all selected divisions data on 2016-2021
    showLoadingScreen();
    var controller = new AbortController();
    getRegionMeasurementsChange({
      RegCount:
        globalState &&
        globalState.divisionType === DivisionTypes.Assembly_Constituencies
          ? 8400
          : 1000,
      RegIgnored: 0,
      RegionType: globalState.divisionType,
      RegionsId: atlasState.selectedDivisions.flatMap((y) => y.id),
      Indicators: [atlasState.selectedIndicator.indId!],
      Year: atlasState.dataView.year,
      YearEnd: 2021,
      controller,
      currentLanguage,
    }).then((data: any) => {
      const { prevalence, prevalenceChange, prevalenceEnd } = data.allIndia[0];
      atlasDispatch({
        type: AtlasActionType.SET_DIVISIONS_MEASUREMENTS_CHANGES,
        payload: data.regionsChange ?? [],
      });

      const regionsWithYearEndData = data.regionsChange.map((i: any) => {
        i.prevalenceEnd = i.prevalenceEnd || i.prevalence + i.prevalenceChange;
        return i;
      });

      const prevalenceAvg =
        regionsWithYearEndData.reduce(
          (accumulator: any, currentValue: any) =>
            accumulator + currentValue.prevalence,
          0
        ) / regionsWithYearEndData.length;
      const prevalenceEndAvg =
        regionsWithYearEndData.reduce(
          (accumulator: any, currentValue: any) =>
            accumulator + currentValue.prevalenceEnd,
          0
        ) / regionsWithYearEndData.length;

      const globaFlat = globalState.allDivisions
        .flatMap((x) => x.subregions)
        .flatMap((y) => y.id);

      const allIndicatorsSelected =
        globaFlat.length === atlasState.selectedDivisions.length;

      setSelectedChanges({
        prevalence: allIndicatorsSelected ? prevalence : prevalenceAvg,
        prevalenceChange: allIndicatorsSelected
          ? prevalenceChange
          : prevalenceEndAvg - prevalenceAvg,
        prevalenceEnd: allIndicatorsSelected ? prevalenceEnd : prevalenceEndAvg,
      });
      setAllIndiaChanges({ prevalence, prevalenceChange, prevalenceEnd });
      setRenderEvent(
        dispatchRenderEvent(
          atlasState,
          globalState.divisionType,
          globalState.selectedMetric
        )
      );
      hideLoadingScreen();
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    atlasState.selectAspirationalDistricts,
    atlasState.selectedDivisions,
    atlasState.selectedIndicator,
    atlasState.dataView,
    atlasDispatch,
    currentLanguage,
  ]);
  return (
    <div className={styles.container}>
      <AtlasSidebar
        allIndia={allIndia}
        allIndiaChanges={allIndiaChanges}
        selectedChanges={selectedChanges}
      />
      {isTablet && <AtlasMap height={"calc(100vh - 77px)"} />}
      {isPhone && <AtlasMap height={"calc(100vh - 238.06px)"} />}
      <LoadingScreen />
    </div>
  );
};
export default AtlasContent;
