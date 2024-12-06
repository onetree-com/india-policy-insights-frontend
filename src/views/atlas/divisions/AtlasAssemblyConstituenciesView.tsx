import AtlasContent from "components/AtlasContent";
import Header from "components/Header";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const AtlasAssemblyConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Assembly_Constituencies);

  return (
    <>
      <Header
        feature="ATLAS"
        division="ASSEMBLY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <AtlasContent />
    </>
  );
};

export default AtlasAssemblyConstituenciesView;
