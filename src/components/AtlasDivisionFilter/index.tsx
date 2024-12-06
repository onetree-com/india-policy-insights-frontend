import { useCallback, useEffect, useMemo } from "react";

import AddIcon from "assets/icons/AddIcon";
import AtlasDivisionModal from "components/AtlasDivisionModal";
import IconContainer from "components/IconContainer";
import styles from "components/StateDistrictFilter/styles.module.scss";
import stylesIndicator from "components/Indicator/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { ParentChildren, division } from "models/divisions";
import { FC, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import CloseIcon from "assets/icons/CloseIcon";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { singularGeographyText } from "utils/formatter";
import { useTranslation } from "react-i18next";

const AtlasDistrictFilter: FC = () => {
  const location = useLocation();
  const { resetZoomOnMap } = useGlobalActions();
  const { atlasDispatch, atlasState } = useContext(AtlasContext)!;
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { t } = useTranslation();

  const [filterByAspirationalDistricts, setFilterByAspirationalDistricts] =
    useState<boolean>(false);

  //const isDesktop = useMediaQuery(MediaQueries.DESKTOP)
  const [showModal, setShowModal] = useState<boolean>(
    location.search.split("=")[1] === "Village"
  );

  const [selectedParentChildren, setSelectedParentChildren] = useState<
    Array<Pick<ParentChildren, "id" | "subregions">>
  >([]);

  const [selectedItems, setSelectedItems] = useState<{
    [parent: number]: division[];
  }>({});

  const [tempDivisions, setTempDivisions] = useState<{
    [parent: number]: division[];
  }>({});

  const selectedDivisions = useMemo(
    () => selectedParentChildren.flatMap((x) => x.subregions),
    [selectedParentChildren]
  );

  useEffect(() => {
    if (filterByAspirationalDistricts) {
      const parsedItems = Object.entries(selectedItems).map(
        ([id, division]) => {
          return {
            id,
            subregions: division.filter((x) => x.aspirational),
          };
        }
      );
      setSelectedParentChildren(
        parsedItems as unknown as Array<
          Pick<ParentChildren, "id" | "subregions">
        >
      );
    } else {
      setSelectedParentChildren(
        globalState.allDivisions.map((state) => {
          return {
            id: state.id,
            subregions: state.subregions,
          };
        })
      );
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByAspirationalDistricts]);

  useEffect(() => {
    let timer: any;
    if (!showModal) {
      timer = setTimeout(
        () =>
          globalDispatch({
            type: GlobalActionType.SET_MODAL,
            payload: showModal,
          }),
        1000
      );
      return;
    }
    globalDispatch({
      type: GlobalActionType.SET_MODAL,
      payload: showModal,
    });
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

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
    atlasDispatch({
      type: AtlasActionType.SELECTED_DISTRICT_MAP,
      payload: undefined,
    });
    atlasDispatch({
      type: AtlasActionType.SELECTED_DISTRICT_MAP_CHANGES,
      payload: undefined,
    });
    atlasDispatch({
      type: AtlasActionType.SELECT_DIVISIONS,
      payload: subregions,
    });
  }, [
    selectedDivisions,
    filterByAspirationalDistricts,
    globalState.allDivisions,
    globalState.divisionType,
    atlasDispatch,
  ]);

  const geographyText = () => {
    return globalState.divisionType === DivisionTypes.District
      ? t("state_district")
      : singularGeographyText(globalState.divisionType, t);
  };

  const setPlaceholder = () => {
    const selected =
      selectedDivisions.length > 0
        ? selectedDivisions
        : atlasState.selectedDivisions;
    if (selected.length === 1) {
      if (selectedParentChildren && selectedParentChildren.length === 0) {
        return selected[0].name;
      } else {
        return Object.values(tempDivisions)[0] &&
          Object.values(tempDivisions)[0][0].name
          ? Object.values(tempDivisions)[0][0].name
          : "";
      }
    }
    return selected.length === 0
      ? t(`${geographyText()} `) + t("filter")
      : `${selected.length} ` +
          `${t(globalState.divisionType)} ` +
          t("selected");
  };

  const reduceDivisions = useCallback(
    (divisions: { [parent: number]: division[] }): any[] => {
      return Object.entries(divisions)
        .filter(([_, divs]) => divs.length > 0)
        .reduce(
          (acc, [id, subregions]) => [...acc, { id, subregions }],
          Array.of<any>()
        );
    },
    []
  );

  const isAllDivisionsSelected = () => {
    const selected =
      selectedDivisions.length >= atlasState.selectedDivisions.length
        ? selectedDivisions
        : atlasState.selectedDivisions;

    return (
      globalState.allDivisions.flatMap((x) => x.subregions).length !==
      selected.length
    );
  };

  return (
    <>
      <div className={styles.container}>
        <Text
          color="#3d4247"
          weight={300}
          lineHeight="11px"
          size="10px"
          style={{
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
          {t(`${geographyText()} `) + t("filter")}
        </Text>
        {isAllDivisionsSelected() ? (
          <div
            style={{ marginBottom: "0", marginTop: "10px" }}
            className={stylesIndicator["reset-filter"]}>
            <p>{t("reset_filter")}</p>
            <CloseIcon
              onClick={(): void => {
                let newDivisions: { [parent: number]: division[] } = [];
                const newDivisionsFlat: any = [];
                globalState.allDivisions.forEach((d) => {
                  newDivisions[d.id] = d.subregions;
                  newDivisionsFlat.push(d.subregions);
                });
                setSelectedParentChildren(reduceDivisions(newDivisions));
                atlasDispatch({
                  type: AtlasActionType.SELECT_DIVISIONS,
                  payload: newDivisionsFlat.flat(),
                });
                setSelectedItems(newDivisions);
                setTempDivisions(newDivisions);
                resetZoomOnMap(true);
                if (globalState.divisionType === DivisionTypes.District) {
                  setFilterByAspirationalDistricts(false);
                }
              }}
            />
          </div>
        ) : null}
        <div
          className={styles["filter-districts-view"]}
          onClick={(): void => {
            setShowModal(true);
          }}
          style={{
            cursor: "pointer",
          }}>
          <Text weight={300} color="#5E6771" size="14px" lineHeight="24px">
            {setPlaceholder()}
          </Text>
          <IconContainer>
            <AddIcon />
          </IconContainer>
        </div>
        {globalState.divisionType === "Districts" && (
          <div className={styles["filter-aspirational-districts"]}>
            <Text weight={300} color="#5E6771" size="12px" lineHeight="17px">
              {t("filter_aspirational")}
            </Text>
            <ToogleSwitch
              value={filterByAspirationalDistricts}
              customSetter={setFilterByAspirationalDistricts}
            />
          </div>
        )}
      </div>
      <AtlasDivisionModal
        showModal={showModal}
        setShowModal={setShowModal}
        setSelectedDivisions={setSelectedParentChildren}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        stateSelectedDivisions={atlasState.selectedDivisions}
        tempDivisions={tempDivisions}
        setTempDivisions={setTempDivisions}
        filterByAspirationalDistricts={filterByAspirationalDistricts}
        setFilterByAspirationalDistricts={setFilterByAspirationalDistricts}
        clearSelectedMapDivision={() => {
          atlasDispatch({
            type: AtlasActionType.SELECTED_DISTRICT_MAP,
            payload: undefined,
          });
          atlasDispatch({
            type: AtlasActionType.SELECTED_DISTRICT_MAP_CHANGES,
            payload: undefined,
          });
        }}
      />
    </>
  );
};

export default AtlasDistrictFilter;
