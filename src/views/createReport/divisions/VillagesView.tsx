import Header from "components/Header";
import NewPDFReport from "components/NewPDFReport";
import useVillages from "hooks/use-villages";
import { FC } from "react";

const CreateReportVillagesView: FC = () => {
  useVillages();

  return (
    <>
      <Header feature="CREATE_REPORT" division="VILLAGES" exclude={new Set()} />
      <NewPDFReport />
    </>
  );
};

export default CreateReportVillagesView;
