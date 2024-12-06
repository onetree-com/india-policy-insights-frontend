import Header from "components/Header";
import NewPDFReport from "components/NewPDFReport";
import { DivisionTypes } from "context/globalContext";
import useDivision from "hooks/use-disvision";
import { FC } from "react";

const CreateReportAssemblyConstituenciesView: FC = () => {
  useDivision(DivisionTypes.Assembly_Constituencies);

  return (
    <>
      <Header
        feature="CREATE_REPORT"
        division="ASSEMBLY_CONSTITUENCIES"
        exclude={new Set()}
      />
      <NewPDFReport />
    </>
  );
};

export default CreateReportAssemblyConstituenciesView;
