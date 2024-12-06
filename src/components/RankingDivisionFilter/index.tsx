import AtlasDivisionModal from "components/AtlasDivisionModal";
import styles from "components/StateDistrictFilter/styles.module.scss";
import Text from "components/Text";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { RankingActionType, RankingContext } from "context/rankingContext";
import { ParentChildren, division } from "models/divisions";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Selector } from "./../StateDistrictFilter/index";
import { useTranslation } from "react-i18next";

const RankingDivisionFilter: FC = () => {
  const location = useLocation();
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;
  const [showModal, setShowModal] = useState<boolean>(
    location.search.split("=")[1] === "Village"
  );
  const [filterByAspirationalDistricts, setFilterByAspirationalDistricts] =
    useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { t } = useTranslation();
  const [selectedParentChildren, setSelectedParentChildren] = useState<
    Array<Pick<ParentChildren, "id" | "subregions">>
  >([]);

  const selectedDivisions = useMemo(
    () => selectedParentChildren.flatMap((x) => x.subregions),
    [selectedParentChildren]
  );
  const [selectedItems, setSelectedItems] = useState<{
    [parent: number]: division[];
  }>({});

  const [tempDivisions, setTempDivisions] = useState<{
    [parent: number]: division[];
  }>({});

  useEffect(() => {
    var subregions =
      selectedDivisions.length > 0
        ? selectedDivisions
        : globalState.allDivisions.flatMap((x) => x.subregions);

    switch (globalState.divisionType) {
      case DivisionTypes.District:
        if (filterByAspirationalDistricts)
          subregions = subregions.filter((x) => x.aspirational);
        break;
      case DivisionTypes.Village:
        subregions = selectedDivisions.length > 0 ? selectedDivisions : [];
        break;
      default:
        break;
    }

    rankingDispatch({
      type: RankingActionType.SELECT_DIVISIONS,
      payload: subregions,
    });
  }, [
    selectedDivisions,
    filterByAspirationalDistricts,
    globalState.allDivisions,
    globalState.divisionType,
    rankingDispatch,
  ]);

  const setStateDistrictPlaceholder = () => {
    const selected =
      selectedDivisions.length > 0
        ? selectedDivisions
        : rankingState.selectedDivisions;
    if (selected.length === 1) {
      if (selectedParentChildren && selectedParentChildren.length === 0) {
        return selected[0].name;
      } else {
        return selectedParentChildren.at(0)?.subregions.at(0)?.name;
      }
    }
    return selected.length === 0
      ? t("filter_districts_view")
      : selected.length === 1
      ? selectedParentChildren.at(0)?.subregions.at(0)?.name!
      : `${selected.length} ${t(globalState.divisionType)} ` + t("selected");
  };

  return (
    <>
      <div className={styles.rankingContainer}>
        <Text
          color="#3d4247"
          weight={300}
          lineHeight="11px"
          size="10px"
          style={{
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
          {t("State-District") + " " + t("filter")}
        </Text>
        <Selector
          setShowModal={(value) => {
            setShowModal(value);
          }}
          placeholder={setStateDistrictPlaceholder()!}
        />
      </div>
      <AtlasDivisionModal
        showModal={showModal}
        setShowModal={setShowModal}
        setSelectedDivisions={setSelectedParentChildren}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        stateSelectedDivisions={rankingState.selectedDivisions}
        tempDivisions={tempDivisions}
        setTempDivisions={setTempDivisions}
        filterByAspirationalDistricts={filterByAspirationalDistricts}
        setFilterByAspirationalDistricts={setFilterByAspirationalDistricts}
        clearSelectedMapDivision={() => {
          rankingDispatch({
            type: RankingActionType.SELECTED_DISTRICT_MAP,
            payload: undefined,
          });
          rankingDispatch({
            type: RankingActionType.SELECTED_DISTRICT_MAP_CHANGES,
            payload: undefined,
          });
        }}
      />
    </>
  );
};

export default RankingDivisionFilter;
