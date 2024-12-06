import Header from "components/Header";
import RankingContent from "components/RankingContent";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const RankingParlimentaryConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Parlimentary_Constituencies);

  return (
    <>
      <Header
        feature="RANKING"
        division="PARLIMENTARY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <RankingContent />
    </>
  );
};

export default RankingParlimentaryConstituenciesView;
