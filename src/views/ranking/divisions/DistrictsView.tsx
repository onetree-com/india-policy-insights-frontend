import Header from "components/Header";
import RankingContent from "components/RankingContent";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const RankingDistrictsView: FC = () => {
  useDivision(DivisionTypes.District);

  return (
    <>
      <Header feature="RANKING" division="DISTRICTS" exclude={new Set()} />
      <RankingContent />
    </>
  );
};

export default RankingDistrictsView;
