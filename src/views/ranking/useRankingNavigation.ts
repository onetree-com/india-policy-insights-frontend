import { GlobalContext } from "context/globalContext";
import { RankingActionType, RankingContext } from "context/rankingContext";
import { useRankingActions } from "context/rankingContext/useRankingActions";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRankingNavigation = () => {
  const { rankingDispatch } = useContext(RankingContext)!;
  const { loadSelectedDivisions } = useRankingActions();
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();

  useEffect(() => {
    if (navState && navState.deciles) {
      let deciles: any = (navState.deciles as string).split(",");
      deciles = (deciles as string[]).map((decile: any) => Number(decile));
      rankingDispatch({
        type: RankingActionType.SELECT_DECILES,
        payload: deciles as number[],
      });
      window.history.replaceState(
        { ...navState, deciles: undefined },
        document.title
      );
    }
    if (navState?.decilesChange) {
      let deciles: any = (navState.decilesChange as string).split(",");
      deciles = (deciles as string[]).map((decile: any) => decile);
      rankingDispatch({
        type: RankingActionType.SELECT_DECILES_CHANGES,
        payload: deciles as string[],
      });
      window.history.replaceState(
        { ...navState, decilesChange: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      navState &&
      navState.subregionIds &&
      globalState.allDivisions.length > 0
    ) {
      loadSelectedDivisions(globalState.allDivisions, navState.subregionIds);
      window.history.replaceState(
        { ...navState, subregionIds: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.allDivisions]);
};

export default useRankingNavigation;
