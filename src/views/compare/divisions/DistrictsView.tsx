import CompareContent from "components/CompareContent";
import Header from "components/Header";
import {
  DivisionTypes
} from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CompareDistrictsView: FC = () => {
  useDivision(DivisionTypes.District);

  return (
    <>
      <Header feature="COMPARE" division="DISTRICTS" exclude={new Set()} />
      <CompareContent />
    </>
  );
};

export default CompareDistrictsView;
