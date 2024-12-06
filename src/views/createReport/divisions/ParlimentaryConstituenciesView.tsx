import Header from "components/Header";
import NewPDFReport from "components/NewPDFReport";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CreateReportParlimentaryConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Parlimentary_Constituencies);

  return (
    <>
      <Header
        feature="CREATE_REPORT"
        division="PARLIMENTARY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <NewPDFReport />
    </>
  );
};

export default CreateReportParlimentaryConstituenciesView;
