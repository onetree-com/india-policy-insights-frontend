import DeepDiveContent from "components/DeepDiveContent";
import Header from "components/Header";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const DeepDiveDistrictsView: FC = () => {
  useDivision(DivisionTypes.District);

  return (
    <>
      <Header feature="DEEP_DIVE" division="DISTRICTS" exclude={new Set()} />
      <DeepDiveContent />
    </>
  );
};

export default DeepDiveDistrictsView;
