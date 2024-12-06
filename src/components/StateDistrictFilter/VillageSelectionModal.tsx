import CompareVillageModal from "components/CompareVillageModal";
import {
  CompareActionType,
  CompareContext,
  SelectedDivisionType,
} from "context/compareContext";
import { FC, useContext, useEffect, useState } from "react";

const VillageSelectionModal: FC<{
  showModal: boolean;
  setShowModal: any;
}> = ({ showModal, setShowModal }) => {
  const { dispatch } = useContext(CompareContext)!;

  const [selectedVillages, setSelectedVillages] = useState<
    SelectedDivisionType[]
  >([]);

  useEffect(() => {
    if (selectedVillages.length !== 0) {
      dispatch({
        type: CompareActionType.SELECT_DIVISIONS,
        payload: selectedVillages,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVillages]);

  return (
    <CompareVillageModal
      showModal={showModal}
      setShowModal={setShowModal}
      selectedVillages={selectedVillages}
      setSelectedVillages={setSelectedVillages}
    />
  );
};

export default VillageSelectionModal;
