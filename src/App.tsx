import loadable from "@loadable/component";
import "App.scss";
import LinkRedirect from "components/LinkRedirect";
import TransitionWrapper from "components/TransitionWrapper";
import { GlobalContext } from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { AnimatePresence } from "framer-motion";
import FeatureList from "models/features";
import { FC, useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
const AtlasView = loadable(() => import("views/atlas"));
const RankingView = loadable(() => import("views/ranking"));
const DeepDiveView = loadable(() => import("views/deep_dive"));
const CompareView = loadable(() => import("views/compare"));
const CreateReportView = loadable(() => import("views/createReport"));

const App: FC = () => {
  const location = useLocation();
  const { globalState } = useContext(GlobalContext)!;
  const { rankingToCompareInfo, resetDivision } = useGlobalActions();

  useEffect(() => {
    if (
      !location.pathname.includes("deep-dive") &&
      globalState.selectedDivision
    ) {
      resetDivision();
    }
    if (
      !location.pathname.includes("compare") &&
      globalState.rankingToCompareInfo
    ) {
      rankingToCompareInfo(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<AppLayout />}>,
          <Route
            path={`${FeatureList.ATLAS.route}/*`}
            element={<AtlasView />}
          />
          <Route
            path={`${FeatureList.RANKING.route}/*`}
            element={<RankingView />}
          />
          <Route
            path={`${FeatureList.DEEP_DIVE.route}/*`}
            element={<DeepDiveView />}
          />
          <Route
            path={`${FeatureList.COMPARE.route}/*`}
            element={<CompareView />}
          />
          <Route
            path={`${FeatureList.CREATE_REPORT.route}/*`}
            element={<CreateReportView />}
          />

          <Route path={`link/*`} element={<LinkRedirect />} />
          <Route path="" element={<Navigate to={FeatureList.ATLAS.route} />} />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  return (
    <TransitionWrapper>
      <Outlet />
    </TransitionWrapper>
  );
};

export default App;
