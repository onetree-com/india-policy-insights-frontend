import Header from "components/Header";
import useVillages from "hooks/use-villages";
import { FC } from "react";
import AtlasVillageContent from "components/AtlasVillageContent/AtlasVillageContent";

const AtlasVillagesView: FC = () => {
  useVillages();

  return (
    <>
      <Header feature="ATLAS" division="VILLAGES" exclude={new Set()} />
      <AtlasVillageContent />
    </>
  );
};

export default AtlasVillagesView;
