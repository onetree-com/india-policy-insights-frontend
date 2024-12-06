import TransitionWrapper from "components/TransitionWrapper";
import DeepDiveProvider from "context/deepDiveContext";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import useIndicators from "hooks/use-indicators";
import DivisionList from "models/divisions";
import { FC, useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DeepDiveDistrictsView from "./divisions/DistrictsView";
import DeepDiveParlimentaryConstituenciesView from "./divisions/ParlimentaryConstituenciesView";
import DeepDiveAssemblyConstituenciesView from "./divisions/AssemblyConstituenciesView";
import DeepDiveVillagesView from "views/deep_dive/divisions/VillagesView";

const DeepDiveView = () => {
  return (
    <DeepDiveProvider>
      <Routes>
        <Route path="/" element={<DeepDiveLayout />}>
          <Route
            path={DivisionList.DISTRICTS.route}
            element={<DeepDiveDistrictsView />}
          />
          <Route
            path={DivisionList.PARLIMENTARY_CONSTITUENCIES.route}
            element={<DeepDiveParlimentaryConstituenciesView />}
          />
          <Route
            path={DivisionList.ASSEMBLY_CONSTITUENCIES.route}
            element={<DeepDiveAssemblyConstituenciesView />}
          />
          <Route
            path={DivisionList.VILLAGES.route}
            element={<DeepDiveVillagesView />}
          />
          <Route
            path=""
            element={<Navigate to={DivisionList.DISTRICTS.route} />}
          />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </DeepDiveProvider>
  );
};

const DeepDiveLayout: FC = () => {
  useIndicators();

  const { globalDispatch } = useContext(GlobalContext)!;

  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_NAVIGATION,
        payload: {
          feature: "DEEP_DIVE",
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

export default DeepDiveView;
