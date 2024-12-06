import { FC, useContext, useEffect } from "react";
import { getIndicatorRegions } from "api/getIndicatorRegions";
import { getRegionMeasurementsChange } from "api/getRegionMeasurementsChange";
import { getSelectedDivisionsData } from "components/AtlasContent/util";
import LoadingScreen from "components/LoadingScreen";
import styles from "components/RankingContent/styles.module.scss";
import RankingMap from "components/RankingMap";
import RankingSidebar from "components/RankingSidebar";
import { GlobalContext } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { RankingActionType, RankingContext } from "context/rankingContext";
import { useDispatchRenderEvent } from "hooks/use-dispatch-render-event";
import useMediaQuery from "hooks/use-media-query";
import useUrlParams from "hooks/use-url-params";
import { useTranslation } from "react-i18next";
import { MediaQueries } from "utils/media-queries";
import useRankingNavigation from "views/ranking/useRankingNavigation";

const RankingContent: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const { showLoadingScreen, hideLoadingScreen } = useGlobalActions();
  const { globalState } = useContext(GlobalContext)!;
  const { searchParams } = useUrlParams();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useRankingNavigation();

  //! updates to this setState dispatch render event inside following hook
  const setRenderEvent = useDispatchRenderEvent();

  const renderEventTemplate = () => {
    if (rankingState.selectedIndicator !== undefined) {
      return {
        event: "render_ranking",
        indicator: rankingState.selectedIndicator.indNameEn,
        division: `${rankingState.selectedDivisions.length} ${globalState.divisionType} selected`,
        date_range:
          rankingState.dataView.year === 2016
            ? `${rankingState.dataView.year} - ${rankingState.dataView.yearEnd}`
            : `${rankingState.dataView.year}`,
        display_by: globalState.selectedMetric,
      };
    }
  };

  useEffect(() => {
    if (
      !rankingState.selectedIndicator ||
      rankingState.selectedDivisions.length === 0
    ) {
      rankingDispatch({
        type: RankingActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: [],
      });

      return;
    }

    //! this block handles requests for change view

    if (rankingState.dataView.year === 2021) return;

    showLoadingScreen();
    var controller = new AbortController();

    getRegionMeasurementsChange({
      RegCount: 10000,
      RegIgnored: 0,
      RegionType: globalState.divisionType,
      RegionsId: rankingState.selectedDivisions.flatMap((y) => y.id),
      Indicators: searchParams.indId
        ? [Number(searchParams.indId)]
        : [rankingState.selectedIndicator.indId!],
      Year: rankingState.dataView.year,
      YearEnd: 2021,
      controller,
      currentLanguage,
    }).then((data: any) => {
      rankingDispatch({
        type: RankingActionType.SET_DIVISIONS_MEASUREMENTS_CHANGES,
        payload: data.regionsChange ?? [],
      });
    });
    setRenderEvent(renderEventTemplate());
    hideLoadingScreen();
    return () => {
      controller.abort();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rankingDispatch,
    rankingState.dataView.year,
    rankingState.dataView.yearEnd,
    rankingState.selectedIndicator,
    rankingState.selectedDivisions,
    searchParams.indId,
    currentLanguage,
  ]);

  useEffect(() => {
    if (!rankingState.selectedIndicator) {
      rankingDispatch({
        type: RankingActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: [],
      });

      return;
    }
    if (rankingState.dataView.year === 2016) return;
    //! this block handles 2021 data view and fetches data for all selected geographies and stores it for later filtering
    if (rankingState.selectedDivisions.length !== 0) {
      setRenderEvent(renderEventTemplate());
    }
    showLoadingScreen();
    var controller = new AbortController();

    getIndicatorRegions({
      regionType: globalState.divisionType,
      regionsId: [],
      indId: searchParams.indId
        ? Number(searchParams.indId)
        : rankingState.selectedIndicator.indId!,
      year: rankingState.dataView.year,
      yearEnd: rankingState.dataView.yearEnd ?? 0,
      controller,
      currentLanguage,
    })
      .then((data: any) => {
        rankingDispatch({
          type: RankingActionType.SET_ALL_DIVISIONS_MEASUREMENTS,
          payload: data.divisions ?? [],
        });
        const selectedDivisionsData = getSelectedDivisionsData(
          rankingState.selectedDivisions,
          data.divisions
        );
        rankingDispatch({
          type: RankingActionType.SET_DIVISIONS_MEASUREMENTS,
          payload: selectedDivisionsData ?? [],
        });
        hideLoadingScreen();
      })
      .catch(() => {
        hideLoadingScreen();
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rankingDispatch,
    rankingState.dataView.year,
    rankingState.dataView.yearEnd,
    rankingState.selectedIndicator,
    searchParams.indId,
    currentLanguage,
  ]);

  useEffect(() => {
    if (
      !rankingState.selectedIndicator ||
      rankingState.selectedDivisions.length === 0
    ) {
      rankingDispatch({
        type: RankingActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: [],
      });

      return;
    }
    if (rankingState.dataView.year === 2016) return;
    //! this block handles 2021 data view and filters data upon changes on selected divisions
    showLoadingScreen();

    setRenderEvent(renderEventTemplate());

    const selectedDivisionsData = getSelectedDivisionsData(
      rankingState.selectedDivisions,
      rankingState.allDivisionsMeasurements
    );

    if (selectedDivisionsData.length !== 0) {
      rankingDispatch({
        type: RankingActionType.SET_DIVISIONS_MEASUREMENTS,
        payload: selectedDivisionsData,
      });
    }

    hideLoadingScreen();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingState.selectedDivisions, rankingState.allDivisionsMeasurements]);

  return (
    <div className={styles.container}>
      <LoadingScreen />
      <RankingSidebar />
      {isDesktop && <RankingMap />}
    </div>
  );
};
export default RankingContent;
