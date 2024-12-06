import { useContext, useEffect, useState } from "react";
import { DeepDiveContext } from "context/deepDiveContext";
import { useDeepDiveActions } from "context/deepDiveContext/useDeepDiveActions";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { useLocation } from "react-router-dom";

const useDeepDiveNavigation = () => {
  const { state } = useContext(DeepDiveContext)!;
  const { loadSelectedDivision } = useGlobalActions();
  const { updateDataview, loadSelectedIndicators, loadSelectedVillages } =
    useDeepDiveActions();
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
      navParams.subregionId &&
      globalState.allDivisions.length > 0
    ) {
      if (globalState.divisionType !== DivisionTypes.Village) {
        loadSelectedDivision(navParams.subregionId);
      } else {
        loadSelectedVillages(navState.subregionId);
      }
      window.history.replaceState(
        { ...navState, subregionId: undefined },
        document.title
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState?.allDivisions]);

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

export default useDeepDiveNavigation;
