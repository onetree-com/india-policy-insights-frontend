import DeepDiveContent from "components/DeepDiveContent";
import Header from "components/Header";
import useVillages from "hooks/use-villages";
import { FC } from "react";

const DeepDiveVillagesView: FC = () => {
  useVillages();
  return (
    <>
      <Header feature="DEEP_DIVE" division="VILLAGES" exclude={new Set()} />
      <DeepDiveContent />
    </>
  );
};

export default DeepDiveVillagesView;
