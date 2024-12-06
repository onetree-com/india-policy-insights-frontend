import SearchIcon from "assets/icons/SearchIcon";
import { AtlasModal } from "components/AtlasModal";
import Loader from "components/Loader";
import stylesModal from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { ParentChildren, ParentDivision } from "models/divisions";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import ModalContent from "./ModalContent";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { sortAlphabetically } from "utils/list-utility";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { useTranslation } from "react-i18next";
import CloseModalIcon from "assets/icons/CloseModalIcon";

const AtlasVillageDistrictModal: FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showModal, setShowModal }) => {
  const { globalState } = useContext(GlobalContext)!;
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { selectDivision } = useGlobalActions();
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<ParentDivision>();
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);

  const sortedGlobalStateDivisions = useMemo(() => {
    const sortedList = sortAlphabetically(globalState.allDivisions);
    return sortedList.map((item) => {
      item.subregions = sortAlphabetically(item.subregions);
      return item;
    });
  }, [globalState.allDivisions]);

  useEffect(() => {
    if (showModal) {
      setSearch("");
    }
  }, [showModal]);

  useEffect(() => {
    if (globalState.selectedDivision) {
      const parentDivision: ParentDivision = {
        parent: {
          id: globalState.selectedDivision?.state?.id!,
          name: globalState.selectedDivision?.state?.name!,
          abbreviation: globalState.selectedDivision?.stateAbbreviation!,
        },
        division: globalState.selectedDivision?.division!,
      }!;

      setSelectedDistrict(parentDivision);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.selectedDivision]);

  const [filterByAspirationalDistricts, setFilterByAspirationalDistricts] =
    useState<boolean>(false);

  return (
    <>
      <AtlasModal
        title={t("state_district_filter")}
        subtitle={t("districts_via_search")}
        show={showModal}
        style={{
          content: {
            overflowY: "auto",
            height: isDesktop ? "calc(80vh - 310px)" : "calc(80vh - 260px)",
            width: "calc(100% - 16px)",
          },
        }}
        header={
          <div
            style={{
              width: "100%",
              display: "grid",
              gap: "24px",
            }}>
            <div
              className={stylesModal.search}
              style={{
                padding: "0px",
              }}>
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

              <div
                style={{
                  padding: " 0 11px 11px 11px",
                  marginLeft: " 11px",
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
            </div>{" "}
            <div className={stylesModal.filter}>
              <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
                {selectedDistrict === undefined
                  ? ""
                  : `${selectedDistrict?.division?.name}, ${selectedDistrict?.parent?.abbreviation}`}
              </Text>
              <CloseModalIcon
                onClick={() => setSelectedDistrict(undefined)}
                size={9}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        }
        content={
          <>
            {globalState.allDivisions ? (
              sortedGlobalStateDivisions.map((division: ParentChildren) => (
                <ModalContent
                  key={division.id}
                  division={division}
                  search={search}
                  selectedDivision={selectedDistrict!}
                  setSelectedDivision={setSelectedDistrict}
                  filterByAspirationalDistricts={filterByAspirationalDistricts}
                />
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}>
                <Loader
                  customStyle={{ color: "#383838", size: 24, thickness: 2 }}
                />
              </div>
            )}
          </>
        }
        footer={
          <>
            <button
              id="modal-atlas-division-button"
              disabled={selectedDistrict === undefined}
              onClick={() => {
                selectDivision(selectedDistrict!);
                atlasDispatch({
                  type: AtlasActionType.SELECTED_VILLAGE_MAP,
                  payload: undefined,
                });
                setShowModal(false);
              }}>
              {t("apply")}
            </button>
          </>
        }
        onClose={() => {
          if (
            globalState.divisionType === DivisionTypes.Village &&
            !atlasState.isMapLoaded
          ) {
            return;
          }
          setShowModal(false);
        }}
      />
    </>
  );
};

export default AtlasVillageDistrictModal;
