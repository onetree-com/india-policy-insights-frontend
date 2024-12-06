import AtlasContent from "components/AtlasContent";
import Header from "components/Header";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const AtlasDistrictsView: FC = () => {
  useDivision(DivisionTypes.District);

  return (
    <>
      <Header feature="ATLAS" division="DISTRICTS" exclude={new Set()} />
      <AtlasContent />
    </>
  );
};

export default AtlasDistrictsView;
