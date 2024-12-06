import CompareContent from "components/CompareContent";
import Header from "components/Header";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CompareParlimentaryConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Parlimentary_Constituencies);

  return (
    <>
      <Header
        feature="COMPARE"
        division="PARLIMENTARY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <CompareContent />
    </>
  );
};

export default CompareParlimentaryConstituenciesView;
