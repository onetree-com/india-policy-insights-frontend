import DeepDiveContent from "components/DeepDiveContent";
import Header from "components/Header";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const DeepDiveParlimentaryConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Parlimentary_Constituencies);

  return (
    <>
      <Header
        feature="DEEP_DIVE"
        division="PARLIMENTARY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <DeepDiveContent />
    </>
  );
};

export default DeepDiveParlimentaryConstituenciesView;
