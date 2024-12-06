import { ParentChildren } from "models/divisions";
import { useContext } from "react";
import { RankingActionType, RankingContext } from ".";

export const useRankingActions = () => {
  const { rankingDispatch } = useContext(RankingContext)!;

  const loadSelectedDivisions = (
    allDivisions: ParentChildren[],
    ids: string
  ) => {
    rankingDispatch({
      type: RankingActionType.LOAD_DIVISIONS,
      payload: { allDivisions, ids },
    });
  };

  return {
    loadSelectedDivisions,
  };
};
