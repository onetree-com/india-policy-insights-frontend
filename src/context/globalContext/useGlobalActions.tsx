import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
  RankingToCompareType,
} from "context/globalContext";
import { ParentDivision } from "models/divisions";
import { indicatorCategory } from "models/indicator";
import { useContext } from "react";

export const useGlobalActions = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;

  const loadSelectedDivision = (divisionId: string) => {
    globalDispatch({
      type: GlobalActionType.LOAD_SELECTED_DIVISION,
      payload: divisionId,
    });
  };

  const rankingToCompareInfo = (info: RankingToCompareType | undefined) => {
    globalDispatch({
      type: GlobalActionType.RANKING_TO_COMPARE_INFO,
      payload: info,
    });
  };

  const getSortedIndicators = () => {
    const sortedIndicators: indicatorCategory[] = globalState.indicators.map(
      (ind) => {
        return {
          ...ind,
          indicators: ind.indicators.sort((a, b) => {
            return a.indId! - b.indId!;
          }),
        };
      }
    );
    return sortedIndicators;
  };

  const resetZoomOnMap = (status: boolean) => {
    globalDispatch({
      type: GlobalActionType.RESET_MAP_ZOOM,
      payload: status,
    });
    if (globalState.divisionType === DivisionTypes.Assembly_Constituencies) {
      showLoadingScreen();
    }
  };

  const resetDivision = () => {
    globalDispatch({ type: GlobalActionType.RESET_DIVISION, payload: {} });
  };

  const showLoadingScreen = () => {
    globalDispatch({
      type: GlobalActionType.SHOW_LOADING_SCREEN,
      payload: {},
    });
  };
  const hideLoadingScreen = () => {
    globalDispatch({
      type: GlobalActionType.HIDE_LOADING_SCREEN,
      payload: {},
    });
  };

  const selectDivision = (division: ParentDivision) => {
    globalDispatch({
      type: GlobalActionType.SELECT_DIVISION,
      payload: division,
    });
  };

  return {
    loadSelectedDivision,
    getSortedIndicators,
    rankingToCompareInfo,
    resetZoomOnMap,
    resetDivision,
    showLoadingScreen,
    hideLoadingScreen,
    selectDivision,
  };
};
