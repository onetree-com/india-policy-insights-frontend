import React, { FC, useContext, useState, useEffect } from "react";
import styles from "components/AtlasVillageDistrictModal/styles.module.scss";
import { ParentChildren, division } from "models/divisions";
import { GlobalContext } from "context/globalContext";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import Radio from "components/Radio";
import { useTranslation } from "react-i18next";
import Loader from "components/Loader";
import { loadDistrictVillages } from "components/CompareVillageModal/VillageModalsUtility";

const ModalContent: FC<{
  district: ParentChildren;
  selectedVillage: { district: division; village: division } | undefined;
  setSelectedVillage: React.Dispatch<
    React.SetStateAction<{ district: division; village: division } | undefined>
  >;
  search?: string;
  searchResults?: ParentChildren[];
  setSearchResults?: React.Dispatch<React.SetStateAction<ParentChildren[]>>;
}> = ({
  district,
  selectedVillage,
  setSelectedVillage,
  search,
  searchResults,
  setSearchResults,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [villages, setVillages] = useState<division[]>([]);
  const { name, subregions } = district;
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const currentLanguage = i18n.language;
  const { globalDispatch } = useContext(GlobalContext)!;

  const handleVillageSelection = (item: division, checked: boolean) => {
    if (checked) {
      setSelectedVillage({
        district: {
          id: district?.id,
          name: district.name,
          nameEn: district.nameEn,
          geoId: district.geoId,
        },
        village: item,
      });
    } else {
      setSelectedVillage(undefined);
    }
  };

  useEffect(() => {
    if (subregions.length > 0) {
      setVillages(subregions);
    }
  }, [subregions]);

  return (
    <>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-content-title"]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text weight={300} size="16px" lineHeight="24px" color="#A51C30">
              {name}
            </Text>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={(): void => {
              setExpand(!expand);
              loadDistrictVillages(
                villages,
                setLoading,
                district,
                currentLanguage,
                globalDispatch,
                search,
                searchResults,
                setSearchResults
              );
            }}>
            {expand ? (
              <ExpandUp color="#565656" />
            ) : (
              <ExpandDown color="#565656" />
            )}
          </div>
        </div>
        {expand && villages.length
          ? villages.map((vil) => (
              <Item
                key={vil?.id}
                item={vil}
                itemSelected={selectedVillage?.village?.id === vil?.id}
                setItemSelected={({ item, checked }) => {
                  handleVillageSelection(item, checked);
                }}
              />
            ))
          : null}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader
              customStyle={{ color: "#383838", size: 24, thickness: 2 }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

const Item: FC<{
  item: division;
  itemSelected: boolean;
  setItemSelected: ({
    item,
    checked,
  }: {
    item: division;
    checked: boolean;
  }) => void;
}> = ({ item, itemSelected, setItemSelected }) => {
  return (
    <div className={styles["modal-content-item"]}>
      <Radio
        isChecked={itemSelected}
        value={item.geoId}
        onChange={() => {
          setItemSelected({ item, checked: !itemSelected });
        }}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default ModalContent;
