import React, { FC, useMemo, useContext } from "react";
import styles from "components/AtlasVillageDistrictModal/styles.module.scss";
import Checkbox from "components/Checkbox";
import { division } from "models/divisions";
import { sortAlphabetically } from "utils/list-utility";
import { AtlasContext } from "context/atlasContext";

const ModalContent: FC<{
  search: string;
  selectedVillages: division[];
  setSelectedVillages: React.Dispatch<React.SetStateAction<division[]>>;
}> = ({ search, selectedVillages, setSelectedVillages }) => {
  const { atlasState } = useContext(AtlasContext)!;

  const sortedGlobalStateDivisions = useMemo(() => {
    const sortedList = sortAlphabetically(atlasState.allDistrictVillages);
    return sortedList;
  }, [atlasState.allDistrictVillages]);

  const filteredItems = useMemo(() => {
    let result =
      search === ""
        ? sortedGlobalStateDivisions
        : sortedGlobalStateDivisions.filter((i) =>
            i.name.toLowerCase().includes(search)
          );
    return result;
  }, [sortedGlobalStateDivisions, search]);

  const selectVillage = (item: division) => {
    const village = selectedVillages.find((v) => v.id === item.id);
    if (village) {
      setSelectedVillages([
        ...selectedVillages.filter((v) => v.id !== item.id),
      ]);
    } else {
      setSelectedVillages([...selectedVillages.concat(item)]);
    }
  };

  return (
    <>
      <div className={styles["modal-content"]}>
        {search !== "" &&
          filteredItems.map((item) => (
            <Item
              key={item.id}
              item={item}
              itemSelected={selectedVillages.includes(item)}
              setItemSelected={(item) => selectVillage(item)}
            />
          ))}
        {search === "" && sortedGlobalStateDivisions.length
          ? sortedGlobalStateDivisions.map((item) => (
              <Item
                key={item.id}
                item={item}
                itemSelected={selectedVillages.includes(item)}
                setItemSelected={(item) => selectVillage(item)}
              />
            ))
          : null}
      </div>
    </>
  );
};

const Item: FC<{
  item: division;
  itemSelected: boolean;
  setItemSelected: (item: division) => void;
}> = ({ item, itemSelected, setItemSelected }) => {
  return (
    <div className={styles["modal-content-item"]}>
      <Checkbox
        isChecked={itemSelected}
        onClick={() => {
          setItemSelected(item);
        }}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default ModalContent;
