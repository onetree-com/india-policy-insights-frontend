import { useContext, useEffect, useState } from "react";
import { CompareContext } from "context/compareContext";
import { useCompareActions } from "context/compareContext/useCompareActions";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { useLocation } from "react-router-dom";

const useCompareNavigation = () => {
  const { state } = useContext(CompareContext)!;
  const {
    updateDataview,
    loadSelectedDivisions,
    loadSelectedIndicators,
    loadSelectedVillages,
  } = useCompareActions();
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();
  const [navParams, setNavParams] = useState<any>({});

  useEffect(() => {
    if (navState) {
      setNavParams(navState);
      if (navState.dataView) {
        updateDataview(navState.dataView);
        window.history.replaceState(
          { ...navState, dataView: undefined },
          document.title
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      navParams &&
      navParams.subregionIds &&
      globalState.allDivisions.length > 0
    ) {
      if (globalState.divisionType !== DivisionTypes.Village) {
        loadSelectedDivisions(navParams.subregionIds);
      } else {
        loadSelectedVillages(navParams.subregionIds);
      }
      window.history.replaceState(
        { ...navState, subregionIds: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.allDivisions]);

  useEffect(() => {
    if (navParams && navParams.indIds && state.allIndicators.length > 0) {
      loadSelectedIndicators(navParams.indIds);
      window.history.replaceState(
        { ...navState, indIds: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.allIndicators]);

  return {};
};

export default useCompareNavigation;
