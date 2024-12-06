import Modal from "components/Modal";
import styles from "components/Modal/styles.module.scss";
import { FC, useEffect, useState } from "react";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import Radio from "components/Radio";

const VillagePerDistrictsFilterModal: FC<{
  showModal: boolean;
  setShowModal: any;
  selectedDivision: any;
  divisions: any[];
  setSelectedDivision: React.Dispatch<any>;
}> = ({
  showModal,
  setShowModal,
  selectedDivision,
  divisions,
  setSelectedDivision,
}) => {
  const [validation, setValidation] = useState<boolean>(false);
  useEffect(() => {
    if (divisions && divisions.length > 0) {
      setValidation(
        divisions.some((d) =>
          d.subregions.some((s: { geoId: string | string[] }) =>
            s.geoId.includes("VIL")
          )
        )
      );
    }
  }, [divisions, divisions.length]);

  return (
    <Modal
      title={"Villages filter"}
      subtitle={`Select districts via the Search bar or from the list below.`}
      show={showModal}
      btnDisabled={!validation}
      onClose={() =>
        validation && selectedDivision?.id ? setShowModal(false) : null
      }>
      {/* disable modal close when divisionType is villages, so user has to select a district, to then select a village*/}
      {divisions.length > 0 ? (
        <Item
          setShowModal={setShowModal}
          items={divisions}
          setSelectedDivision={setSelectedDivision}
        />
      ) : null}
    </Modal>
  );
};

const Item = ({
  items,
  setShowModal,
  setSelectedDivision,
}: {
  items: any;
  setShowModal: any;
  setSelectedDivision: React.Dispatch<any>;
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  return (
    <div className={styles["modal-content"]}>
      <div className={styles["modal-content-title"]}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text weight={300} size="16px" lineHeight="24px" color="#A51C30">
            {"District, Villages"}
          </Text>
        </div>

        <div
          style={{ cursor: "pointer" }}
          onClick={(): void => setExpand(!expand)}>
          {expand ? (
            <ExpandUp color="#565656" />
          ) : (
            <ExpandDown color="#565656" />
          )}
        </div>
      </div>
      {expand && items.length > 0
        ? items.map((item: any) => (
            <div key={item.geoId} className={styles["modal-content-item"]}>
              <Radio
                value={item.geoId}
                onChange={() => {
                  setShowModal(false);
                  setSelectedDivision(item);
                }}
              />
              <p>{item.name}</p>
            </div>
          ))
        : null}
    </div>
  );
};

export default VillagePerDistrictsFilterModal;
