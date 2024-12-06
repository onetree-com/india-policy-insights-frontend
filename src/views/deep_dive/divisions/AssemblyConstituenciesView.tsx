import DeepDiveContent from "components/DeepDiveContent";
import Header from "components/Header";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const DeepDiveAssemblyConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Assembly_Constituencies);

  return (
    <>
      <Header
        feature="DEEP_DIVE"
        division="ASSEMBLY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <DeepDiveContent />
    </>
  );
};

export default DeepDiveAssemblyConstituenciesView;
