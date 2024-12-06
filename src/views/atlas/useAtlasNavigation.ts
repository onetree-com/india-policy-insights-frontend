import { useContext, useEffect } from "react";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { useAtlasActions } from "context/atlasContext/useAtlasActions";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { useLocation } from "react-router-dom";

const useAtlasNavigation = () => {
  const { atlasDispatch } = useContext(AtlasContext)!;
  const { loadSelectedDivisions, loadSelectedVillages } = useAtlasActions();
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();
  useEffect(() => {
    if (navState?.deciles) {
      let deciles: any = (navState.deciles as string).split(",");
      deciles = (deciles as string[]).map((decile: any) => Number(decile));
      atlasDispatch({
        type: AtlasActionType.SELECT_DECILES,
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
      atlasDispatch({
        type: AtlasActionType.SELECT_DECILES_CHANGES,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      navState &&
      navState.subregionIds &&
      globalState.allDivisions.length > 0
    ) {
      if (globalState.divisionType !== DivisionTypes.Village) {
        loadSelectedDivisions(globalState.allDivisions, navState.subregionIds);
      } else {
        loadSelectedVillages(navState.subregionIds);
      }
      window.history.replaceState(
        { ...navState, subregionIds: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.allDivisions]);
};

export default useAtlasNavigation;
