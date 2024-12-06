import TransitionWrapper from "components/TransitionWrapper";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import RankingProvider from "context/rankingContext";
import useIndicators from "hooks/use-indicators";
import DivisionList from "models/divisions";
import { FC, useContext, useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import RankingDistrictsView from "./divisions/DistrictsView";
import RankingParlimentaryConstituenciesView from "./divisions/ParlimentaryConstituenciesView";

const RankingView = () => {
  return (
    <RankingProvider>
      <Routes>
        <Route path="/" element={<RankingLayout />}>
          <Route
            path={DivisionList.DISTRICTS.route}
            element={<RankingDistrictsView />}
          />
          <Route
            path={DivisionList.PARLIMENTARY_CONSTITUENCIES.route}
            element={<RankingParlimentaryConstituenciesView />}
          />
          <Route
            path=""
            element={<Navigate to={DivisionList.DISTRICTS.route} />}
          />
        </Route>
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
    </RankingProvider>
  );
};

const RankingLayout: FC = () => {
  useIndicators();
  const { globalDispatch } = useContext(GlobalContext)!;

  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_NAVIGATION,
        payload: {
          feature: "RANKING",
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
export default RankingView;
