import TransitionWrapper from "components/TransitionWrapper";
import AtlasProvider from "context/atlasContext";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import useIndicators from "hooks/use-indicators";
import DivisionList from "models/divisions";
import { useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AtlasAssemblyConstituenciesView from "./divisions/AtlasAssemblyConstituenciesView";
import AtlasDistrictsView from "./divisions/AtlasDistrictsView";
import AtlasParlimentaryConstituenciesView from "./divisions/AtlasParlimentaryConstituenciesView";
import AtlasVillagesView from "./divisions/AtlasVillagesView";

const AtlasView = () => {
  return (
    <AtlasProvider>
      <Routes>
        <Route path="/" element={<AtlasLayout />}>
          <Route
            path={DivisionList.DISTRICTS.route}
            element={<AtlasDistrictsView />}
          />
          <Route
            path={DivisionList.PARLIMENTARY_CONSTITUENCIES.route}
            element={<AtlasParlimentaryConstituenciesView />}
          />
          <Route
            path={DivisionList.ASSEMBLY_CONSTITUENCIES.route}
            element={<AtlasAssemblyConstituenciesView />}
          />
          <Route
            path={DivisionList.VILLAGES.route}
            element={<AtlasVillagesView />}
          />
          <Route
            path=""
            element={<Navigate to={DivisionList.DISTRICTS.route} />}
          />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </AtlasProvider>
  );
};

const AtlasLayout = () => {
  useIndicators();
  const { globalDispatch } = useContext(GlobalContext)!;

  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_NAVIGATION,
        payload: {
          feature: "ATLAS",
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <TransitionWrapper>
      <Outlet />
    </TransitionWrapper>
  );
};

export default AtlasView;
