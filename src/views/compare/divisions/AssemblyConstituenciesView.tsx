import CompareContent from "components/CompareContent";
import Header from "components/Header";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CompareAssemblyConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Assembly_Constituencies);

  return (
    <>
      <Header
        feature="COMPARE"
        division="ASSEMBLY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <CompareContent />
    </>
  );
};

export default CompareAssemblyConstituenciesView;
