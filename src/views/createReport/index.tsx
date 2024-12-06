import TransitionWrapper from "components/TransitionWrapper";
import CreateReportProvider from "context/createReportContext";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import useIndicators from "hooks/use-indicators";
import DivisionList from "models/divisions";
import { FC, useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CreateReportAssemblyConstituenciesView from "./divisions/AssemblyConstituenciesView";
import CreateReportDistrictsView from "./divisions/DistrictsView";
import CreateReportParlimentaryConstituenciesView from "./divisions/ParlimentaryConstituenciesView";
import CreateReportVillagesView from "./divisions/VillagesView";

const CreateReportView = () => {
  return (
    <CreateReportProvider>
      <Routes>
        <Route path="/" element={<CreateReportLayout />}>
          <Route
            path={DivisionList.DISTRICTS.route}
            element={<CreateReportDistrictsView />}
          />
          <Route
            path={DivisionList.PARLIMENTARY_CONSTITUENCIES.route}
            element={<CreateReportParlimentaryConstituenciesView />}
          />
          <Route
            path={DivisionList.ASSEMBLY_CONSTITUENCIES.route}
            element={<CreateReportAssemblyConstituenciesView />}
          />

          <Route
            path={DivisionList.VILLAGES.route}
            element={<CreateReportVillagesView />}
          />
          <Route
            path=""
            element={<Navigate to={DivisionList.DISTRICTS.route} />}
          />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </CreateReportProvider>
  );
};

const CreateReportLayout: FC = () => {
  useIndicators();
  const { globalDispatch } = useContext(GlobalContext)!;

  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_NAVIGATION,
        payload: {
          feature: "CREATE_REPORT",
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

export default CreateReportView;
