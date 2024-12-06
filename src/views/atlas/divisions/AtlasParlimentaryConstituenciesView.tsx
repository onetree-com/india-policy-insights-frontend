import AtlasContent from "components/AtlasContent";
import Header from "components/Header";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const AtlasParlimentaryConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Parlimentary_Constituencies);

  return (
    <>
      <Header
        feature="ATLAS"
        division="PARLIMENTARY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <AtlasContent />
    </>
  );
};

export default AtlasParlimentaryConstituenciesView;
