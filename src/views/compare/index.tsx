import TransitionWrapper from "components/TransitionWrapper";
import CompareProvider from "context/compareContext";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import useIndicators from "hooks/use-indicators";
import DivisionList from "models/divisions";
import { FC, useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CompareAssemblyConstituenciesView from "views/compare/divisions/AssemblyConstituenciesView";
import CompareVillagesView from "views/compare/divisions/VillagesView";
import CompareDistrictsView from "./divisions/DistrictsView";
import CompareParlimentaryConstituenciesView from "./divisions/ParlimentaryConstituenciesView";

const CompareView = () => {
  return (
    <CompareProvider>
      <Routes>
        <Route path="/" element={<CompareLayout />}>
          <Route
            path={DivisionList.DISTRICTS.route}
            element={<CompareDistrictsView />}
          />
          <Route
            path={DivisionList.PARLIMENTARY_CONSTITUENCIES.route}
            element={<CompareParlimentaryConstituenciesView />}
          />
          <Route
            path={DivisionList.ASSEMBLY_CONSTITUENCIES.route}
            element={<CompareAssemblyConstituenciesView />}
          />
          <Route
            path={DivisionList.VILLAGES.route}
            element={<CompareVillagesView />}
          />
          <Route
            path=""
            element={<Navigate to={DivisionList.DISTRICTS.route} />}
          />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </CompareProvider>
  );
};

const CompareLayout: FC = () => {
  useIndicators();
  const { globalDispatch } = useContext(GlobalContext)!;

  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_NAVIGATION,
        payload: {
          feature: "COMPARE",
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

export default CompareView;
