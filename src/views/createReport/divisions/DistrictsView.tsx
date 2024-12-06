import Header from "components/Header";
import NewPDFReport from "components/NewPDFReport";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CreateReportDistrictsView: FC = () => {
  useDivision(DivisionTypes.District);

  return (
    <>
      <Header
        feature="CREATE_REPORT"
        division="DISTRICTS"
        exclude={new Set()}
      />
      <NewPDFReport />
    </>
  );
};

export default CreateReportDistrictsView;
