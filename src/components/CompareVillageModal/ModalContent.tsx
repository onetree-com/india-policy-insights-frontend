import React, { FC, useContext, useState, useEffect, Fragment } from "react";
import styles from "components/AtlasVillageDistrictModal/styles.module.scss";
import Checkbox from "components/Checkbox";
import { ParentChildren, division } from "models/divisions";
import { SelectedDivisionType } from "context/compareContext";
import { GlobalContext } from "context/globalContext";
import Text from "components/Text";
import ExpandUp from "assets/icons/ExpandUp";
import ExpandDown from "assets/icons/ExpandDown";
import Loader from "components/Loader";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";
import { loadDistrictVillages } from "./VillageModalsUtility";
import Tooltip from "components/Popup/Tooltip";

const ModalContent: FC<{
  district: ParentChildren;
  selectedVillages: SelectedDivisionType[];
  setSelectedVillages: React.Dispatch<
    React.SetStateAction<SelectedDivisionType[]>
  >;
  selectedVillage: SelectedDivisionType | undefined;
  setSelectedVillage: React.Dispatch<
    React.SetStateAction<SelectedDivisionType | undefined>
  >;
  divisionIndex?: number;
  search?: string;
  searchResults?: ParentChildren[];
  setSearchResults?: React.Dispatch<React.SetStateAction<ParentChildren[]>>;
}> = ({
  district,
  selectedVillages,
  setSelectedVillages,
  divisionIndex,
  selectedVillage,
  setSelectedVillage,
  search,
  searchResults,
  setSearchResults,
}) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [villages, setVillages] = useState<division[]>([]);
  const { name, subregions, isVillages } = district;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const { globalDispatch } = useContext(GlobalContext)!;

  const handleVillageSelection = (
    item: division,
    checked: boolean,
    villageId: number
  ) => {
    if (divisionIndex !== undefined) {
      const division = selectedVillages.find((village) => {
        return village?.division?.id === item.id;
      });
      if (!division) {
        dispatchGTMEvent({
          event: "region_select_click",
          action: "Include",
          value: item.nameEn,
        });
        setSelectedVillage({
          parent: { id: district.id, name: district.name },
          division: item,
        });
      }

      return;
    }
    if (checked && selectedVillages.length < 4) {
      dispatchGTMEvent({
        event: "region_select_click",
        action: "Include",
        value: item.nameEn,
      });
      setSelectedVillages([
        ...selectedVillages,
        {
          parent: { id: district.id, name: district.name },
          division: item,
        },
      ]);
    } else {
      dispatchGTMEvent({
        event: "region_select_click",
        action: "Exclude",
        value: item.nameEn,
      });
      setSelectedVillages([
        ...selectedVillages.filter((s) => s.division.id !== villageId),
      ]);
    }
  };

  useEffect(() => {
    if (subregions.length > 0 && isVillages) {
      setVillages(subregions);
    }
  }, [subregions, isVillages]);

  const isDisabled = (vil: division) => {
    if (divisionIndex !== undefined) {
      return selectedVillages.find((it, index) => {
        return index !== divisionIndex && it.division.id === vil.id;
      })
        ? styles.disabled
        : "";
    }
  };

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
                isDisabled={isDisabled}
                key={vil.id}
                item={vil}
                itemSelected={
                  divisionIndex !== undefined
                    ? selectedVillage?.division?.id === vil.id
                    : selectedVillages.find((v) => v.division.id === vil.id) !==
                      undefined
                }
                setItemSelected={({ item, checked }) => {
                  handleVillageSelection(item, checked, vil.id);
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
  isDisabled: (vil: division) => string | undefined;
}> = ({ item, itemSelected, setItemSelected, isDisabled }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  return (
    <Fragment key={item.geoId}>
      {isDisabled(item) ? (
        <div style={{ position: "relative" }}>
          <Tooltip
            customStyles={{
              position: "absolute",
              color: "#fff",
              backgroundColor: "#757575",
              padding: "8px",
              borderRadius: "5px",
              right: 10,
              top: 10,
            }}
            show={showTooltip}
            closeFromOutside={() => {
              setShowTooltip((pre) => !pre);
            }}>
            <Text>{t("already_selected")}</Text>
          </Tooltip>
        </div>
      ) : null}
      <div
        className={`${styles["modal-content-item"]} ${isDisabled(item)}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}>
        <Checkbox
          customStyles={isDisabled(item) ? { cursor: "not-allowed" } : {}}
          isChecked={itemSelected}
          onClick={() => {
            setItemSelected({ item, checked: !itemSelected });
          }}
        />
        <p>{item.name}</p>
      </div>
    </Fragment>
  );
};

export default ModalContent;
