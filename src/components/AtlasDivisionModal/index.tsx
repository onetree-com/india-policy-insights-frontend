import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import { AtlasModal } from "components/AtlasModal";
import Loader from "components/Loader";
import stylesModal from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import useUrlParams from "hooks/use-url-params";
import { division, ParentChildren } from "models/divisions";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MediaQueries } from "utils/media-queries";
import ModalContent from "./ModalContent";
import { sortAlphabetically } from "utils/list-utility";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import Portal from "components/Portal";

const AtlasDivisionModal: FC<{
  loading?: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDivisions: React.Dispatch<
    React.SetStateAction<Array<Pick<ParentChildren, "id" | "subregions">>>
  >;
  stateSelectedDivisions: any;
  selectedItems?: any;
  setSelectedItems?: any;
  tempDivisions?: any;
  setTempDivisions?: any;
  clearSelectedMapDivision?: any;
  filterByAspirationalDistricts?: boolean;
  setFilterByAspirationalDistricts?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = ({
  loading,
  showModal,
  setShowModal,
  setSelectedDivisions,
  selectedItems,
  setSelectedItems,
  stateSelectedDivisions,
  tempDivisions,
  setTempDivisions,
  clearSelectedMapDivision,
  filterByAspirationalDistricts,
  setFilterByAspirationalDistricts,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const [search, setSearch] = useState<string>("");
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { t } = useTranslation();
  const filterRef = useRef(null);
  const { resetZoomOnMap } = useGlobalActions();
  let initialFilterByAspDistricts = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (!showModal) {
      initialFilterByAspDistricts.current = filterByAspirationalDistricts!;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByAspirationalDistricts]);

  const sortedGlobalStateDivisions = useMemo(() => {
    const sortedList = sortAlphabetically(globalState.allDivisions);
    return sortedList.map((item) => {
      item.subregions = sortAlphabetically(item.subregions);
      return item;
    });
  }, [globalState.allDivisions]);

  const noneDivisionSelected = (tempDivisions: any) => {
    if (!tempDivisions) {
      return true;
    }
    const valuesList: [][] = Object.values(tempDivisions);
    return !valuesList.some((item) => item.length > 0);
  };
  const setAllDivisions = (shouldUpdateSelectedDivisions = false) => {
    let newDivisions: { [parent: number]: division[] } = {};
    if (stateSelectedDivisions.length === 0 || shouldUpdateSelectedDivisions) {
      globalState.allDivisions.forEach((d) => {
        newDivisions[d.id] = d.subregions;
      });
    } else {
      const selectedDivisionsIds: any = {};
      stateSelectedDivisions.forEach((d: any) => {
        selectedDivisionsIds[d.id] = true;
      });
      globalState.allDivisions.forEach((d) => {
        const selectedStateDivisions: any = [];
        d.subregions.forEach((item) => {
          if (selectedDivisionsIds[item.id]) {
            selectedStateDivisions.push(item);
          }
        });
        if (selectedStateDivisions.length !== 0) {
          newDivisions[d.id] = [...selectedStateDivisions];
        }
      });
    }
    setSelectedItems(newDivisions);
    setTempDivisions(newDivisions);

    if (shouldUpdateSelectedDivisions) {
      setSelectedDivisions(() => reduceDivisions(newDivisions));
      resetZoomOnMap(true);
    }
  };

  useEffect(() => {
    if (globalState.allDivisions.length > 0) {
      setAllDivisions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.allDivisions, stateSelectedDivisions]);

  const showFilterByAspirationalDistricts = useMemo<boolean>(
    () => globalState.divisionType === DivisionTypes.District,
    [globalState.divisionType]
  );

  useEffect(() => {
    if (showModal) {
      setSearch("");
    }
  }, [showModal]);

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

  const { searchParams } = useUrlParams();

  useEffect(() => {
    if (searchParams.subregionsId) {
      const subregionsIdArray = (searchParams.subregionsId as string).split(
        ","
      ) as any[];
      let divisions: any = [];
      globalState.allDivisions.forEach((division) => {
        const div = division.subregions.filter((sub) => {
          let isExist = false;
          subregionsIdArray.forEach((subregionIdArray) => {
            if (subregionIdArray === sub.id.toString()) {
              isExist = true;
            }
          });
          return isExist;
        });
        if (div.length > 0) {
          divisions.push({
            id: division.id.toString(),
            subregions: div,
          });
        }
      });
    }
  }, [searchParams, globalState.allDivisions]);

  const selectedDivisionStr = () => {
    let selectedDivision = Object.values(tempDivisions).flatMap(
      (divisions) => divisions
    );

    if (filterByAspirationalDistricts) {
      selectedDivision = selectedDivision.filter(
        (item: any) => item.aspirational
      );
    }

    const selectedDivisionStr = selectedDivision
      .map((division: any) => division.name)
      .join(", ");

    return {
      str: selectedDivisionStr,
      length: selectedDivision.length,
    };
  };

  const getSingularTextGeography = (divisionType: DivisionTypes) => {
    const key: { [key in DivisionTypes]: string } = {
      [DivisionTypes.Assembly_Constituencies]: "Assembly Constituency",
      [DivisionTypes.Parlimentary_Constituencies]: "Parliamentary Constituency",
      [DivisionTypes.District]: "District",
      [DivisionTypes.Village]: "village",
    };

    return key[divisionType];
  };

  return (
    <Portal>
      <AtlasModal
        title={
          globalState.divisionType
            ? `${
                globalState.divisionType === DivisionTypes.District
                  ? t("state") + "-"
                  : ""
              }${t(getSingularTextGeography(globalState.divisionType))} ` +
              t("filter")
            : "State-District Filter"
        }
        subtitle={
          globalState.divisionType
            ? t("select") + ` ${t(globalState.divisionType)} ` + t("via_search")
            : t("districts_via_search")
        }
        show={showModal}
        style={{
          content: {
            overflowY: "auto",
            height: isDesktop ? "calc(78vh - 330px)" : "calc(75vh - 270px)",
            width: "calc(100% - 16px)",
          },
        }}
        header={
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}>
            <div
              className={stylesModal.search}
              style={{
                padding: showFilterByAspirationalDistricts ? "0px" : "11px",
              }}>
              {showFilterByAspirationalDistricts && (
                <div className={stylesModal.filterByAspirationalDistricts}>
                  <Text
                    weight={400}
                    color="#575A5C"
                    size="12px"
                    lineHeight="17px">
                    {t("filter_aspirational")}
                  </Text>
                  <ToogleSwitch
                    value={filterByAspirationalDistricts!}
                    customSetter={setFilterByAspirationalDistricts}
                  />
                </div>
              )}

              <div
                style={{
                  padding: !showFilterByAspirationalDistricts
                    ? "0px"
                    : " 0 11px 11px 11px",
                  marginLeft: !showFilterByAspirationalDistricts
                    ? "0px"
                    : " 11px",
                }}
                className={stylesModal.searchContainer}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={search}
                  onChange={(ev) => {
                    setSearch!(ev.target.value.toLowerCase());
                  }}
                />
              </div>
            </div>
            <>
              <div className={stylesModal.filter} ref={filterRef}>
                <Text color="#A51C30" weight={400} size="16px">
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: filterRef.current!
                        ? `${
                            (filterRef.current! as HTMLElement).offsetWidth - 50
                          }px`
                        : "200px",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}>
                    {selectedDivisionStr().str}
                  </span>
                </Text>

                <CloseModalIcon
                  onClick={() => {
                    dispatchGTMEvent({
                      event: "region_select_cancel",
                    });
                    setTempDivisions({});
                  }}
                  style={{
                    flexShrink: 0,
                  }}
                />
              </div>
              <Text color="#575A5C" size="12px" style={{ marginTop: "6px" }}>
                {t("total_selected")}: {selectedDivisionStr().length}
              </Text>
            </>
          </div>
        }
        content={
          <>
            {globalState.allDivisions
              ? sortedGlobalStateDivisions.map((division) => (
                  <ModalContent
                    key={division.geoId}
                    id={division.id}
                    title={division.name}
                    titleEn={division.nameEn}
                    items={division.subregions}
                    search={search}
                    selectedDivisions={tempDivisions[division.id] || []}
                    setSelectedDivisions={setTempDivisions}
                    filterByAspirationalDistricts={
                      filterByAspirationalDistricts
                    }
                  />
                ))
              : null}
          </>
        }
        footer={
          <>
            <button
              id="modal-atlas-division-button"
              className={`${loading ? stylesModal.loading : null}`}
              onClick={() => {
                setShowModal(false);
                if (
                  noneDivisionSelected(tempDivisions) &&
                  !filterByAspirationalDistricts
                ) {
                  setAllDivisions(true);
                } else {
                  let newTemp = tempDivisions;
                  if (filterByAspirationalDistricts) {
                    for (const t in newTemp) {
                      newTemp[t] = newTemp[t].filter(
                        (a: any) => a.aspirational
                      );
                    }
                  }
                  setSelectedItems(newTemp);
                  clearSelectedMapDivision();
                  setSelectedDivisions(() => reduceDivisions(newTemp));
                }
              }}>
              {loading && <Loader />}
              {loading ? "Applying" : t("apply")}
            </button>
          </>
        }
        onClose={() => {
          setShowModal(false);
          if (setFilterByAspirationalDistricts) {
            setFilterByAspirationalDistricts(
              initialFilterByAspDistricts.current!
            );
          }
          setTempDivisions(selectedItems);
        }}
      />
    </Portal>
  );
};

export default AtlasDivisionModal;
