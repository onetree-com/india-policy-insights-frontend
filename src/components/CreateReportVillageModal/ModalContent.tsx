import React, { FC, useContext, useState, useEffect } from "react";
import styles from "components/AtlasVillageDistrictModal/styles.module.scss";
import { ParentChildren, division } from "models/divisions";
import { GlobalContext } from "context/globalContext";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import Radio from "components/Radio";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";
import { loadDistrictVillages } from "components/CompareVillageModal/VillageModalsUtility";
import Loader from "components/Loader";

const ModalContent: FC<{
  district: ParentChildren;
  search: string;
  selectedVillage: { district: division; village: division } | undefined;
  setSelectedVillage: React.Dispatch<
    React.SetStateAction<{ district: division; village: division } | undefined>
  >;
  searchResults?: ParentChildren[];
  setSearchResults?: React.Dispatch<React.SetStateAction<ParentChildren[]>>;
}> = ({
  district,
  search,
  selectedVillage,
  setSelectedVillage,
  searchResults,
  setSearchResults,
}) => {
  const [expand, setExpand] = useState<boolean>(search.length > 2);
  const [villages, setVillages] = useState<division[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { name, subregions } = district;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const { globalDispatch } = useContext(GlobalContext)!;

  const handleVillageSelection = (item: division, checked: boolean) => {
    if (checked) {
      dispatchGTMEvent({
        event: "region_select_click",
        action: "Include",
        value: `${item.nameEn}`,
      });
      setSelectedVillage({
        district: {
          parentId: district?.parentId,
          parentName: district?.parentName,
          id: district?.id,
          name: district.name,
          nameEn: district.nameEn,
          geoId: district.geoId,
        },
        village: item,
      });
    } else {
      dispatchGTMEvent({
        event: "region_select_click",
        action: "Exclude",
        value: `${item.nameEn}`,
      });
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
        {search === "" ||
        name.toLowerCase().includes(search) ||
        villages.some((i) => i.name.toLowerCase().includes(search)) ? (
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
        ) : null}
        {expand &&
        (villages.length > 1 ||
          villages.some((vill) => {
            return vill.name !== "";
          }))
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
          : null}{" "}
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
