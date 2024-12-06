import SearchIcon from "assets/icons/SearchIcon";
import { AtlasModal } from "components/AtlasModal";
import stylesModal from "components/Modal/styles.module.scss";
import useMediaQuery from "hooks/use-media-query";
import React, { FC, Fragment, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import ModalContent from "./ModalContent";
import { CompareContext, SelectedDivisionType } from "context/compareContext";
import { GlobalContext } from "context/globalContext";
import Text from "components/Text";
import CloseModalIcon from "assets/icons/CloseModalIcon";
import { ParentChildren } from "models/divisions";
import Loader from "components/Loader";
import { useTranslation } from "react-i18next";
import { handleSearch } from "./VillageModalsUtility";
import Portal from "components/Portal";

const CompareVillageModal: FC<{
  showModal?: boolean;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  showEditModal?: boolean;
  setShowEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
  divisionIndex?: number;
  selectedVillages: SelectedDivisionType[];
  setSelectedVillages: React.Dispatch<
    React.SetStateAction<SelectedDivisionType[]>
  >;
}> = ({
  showModal,
  setShowModal,
  selectedVillages,
  setSelectedVillages,
  divisionIndex,
  setShowEditModal,
  showEditModal,
}) => {
  const { state } = useContext(CompareContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ParentChildren[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempVillages, setTempVillages] = useState<SelectedDivisionType[]>(
    state.selectedDivisions!
  );
  //! divisionIndex indicates if division should be modified and where it's located inside state.selectedDivisions
  const [tempVillage, setTempVillage] = useState<
    SelectedDivisionType | undefined
  >(divisionIndex !== undefined ? tempVillages[divisionIndex] : undefined);
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const REGCOUNT = 5000;
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length > 2) {
        handleSearch(
          search.trim(),
          setLoading,
          REGCOUNT,
          currentLanguage,
          setSearchResults
        );
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (showModal) {
      setSearch("");
    }
  }, [showModal, showEditModal]);
  useEffect(() => {
    setTempVillages(state.selectedDivisions!);
  }, [state.selectedDivisions]);

  useEffect(() => {
    if (divisionIndex !== undefined) {
      setTempVillage(tempVillages[divisionIndex]);
    }
  }, [tempVillages, divisionIndex]);

  const getVillageText = () => {
    if (divisionIndex !== undefined) {
      return tempVillage?.division.name;
    } else {
      if (tempVillages && tempVillages.length > 1) {
        return `${tempVillages.length} ${t("villages")} ${t(
          "selected"
        )}`.toLowerCase();
      } else if (tempVillages && tempVillages.length === 1) {
        return tempVillages[0]?.division.name;
      } else {
        return "";
      }
    }
  };

  return (
    <Portal>
      <AtlasModal
        title={t("district_villages_filter")}
        subtitle={t("villages_via_search")}
        show={divisionIndex !== undefined ? showEditModal! : showModal!}
        style={{
          content: {
            overflowY: "auto",
            height: isDesktop ? "calc(80vh - 223px)" : "calc(80vh - 270px)",
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
            <div className={stylesModal.search}>
              <div
                style={{
                  padding: "0px",
                  marginLeft: "0px",
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
            <div className={stylesModal.filter}>
              <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
                {getVillageText()}
              </Text>
              <div className={stylesModal.wrapper}>
                {globalState.navigation.feature === "COMPARE" ? (
                  tempVillages && divisionIndex === undefined ? (
                    <Text
                      size="16px"
                      lineHeight="10.5px"
                      style={{ marginRight: "5px" }}>
                      <span className={stylesModal.bold}>
                        {tempVillages.length}
                      </span>
                      {" / 4"}
                    </Text>
                  ) : null
                ) : null}
                <CloseModalIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (divisionIndex === undefined) {
                      setTempVillages([]);
                    } else {
                      setTempVillage(undefined);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        }
        content={
          <>
            {globalState.allDivisions && search.trim().length <= 2
              ? globalState.allDivisions.map((division) => (
                  <Fragment key={division.id}>
                    <ModalContent
                      divisionIndex={divisionIndex}
                      district={{
                        id: division.id,
                        name: division.name,
                        nameEn: division.nameEn,
                        isVillages: division.isVillages,
                        subregions: division.subregions,
                        geoId: division.geoId,
                        abbreviation: "",
                      }}
                      setSelectedVillage={setTempVillage}
                      selectedVillage={tempVillage}
                      search={search}
                      selectedVillages={tempVillages || []}
                      setSelectedVillages={setTempVillages}
                    />
                  </Fragment>
                ))
              : null}
            {search.trim().length > 2 && searchResults.length > 0
              ? searchResults.map((res) => (
                  <Fragment key={res.id}>
                    <ModalContent
                      divisionIndex={divisionIndex}
                      district={{
                        id: res.id,
                        name: res.name,
                        nameEn: res.nameEn,
                        isVillages: res.isVillages,
                        subregions: res.subregions,
                        geoId: res.geoId,
                        abbreviation: "",
                      }}
                      setSelectedVillage={setTempVillage}
                      selectedVillage={tempVillage}
                      search={search.trim()}
                      setSearchResults={setSearchResults}
                      searchResults={searchResults}
                      selectedVillages={tempVillages || []}
                      setSelectedVillages={setTempVillages}
                    />
                  </Fragment>
                ))
              : null}
            {loading ? <Loader /> : null}
          </>
        }
        footer={
          <>
            <button
              id="modal-atlas-division-button"
              disabled={
                divisionIndex !== undefined
                  ? !tempVillage
                  : tempVillages.length === 0
              }
              onClick={() => {
                if (divisionIndex !== undefined) {
                  setShowEditModal!(false);
                  setSelectedVillages([
                    ...tempVillages.map((selectedVillage, index) => {
                      return index !== divisionIndex
                        ? selectedVillage
                        : tempVillage!;
                    }),
                  ]);
                } else {
                  setShowModal!(false);
                  setSelectedVillages(tempVillages);
                }
              }}>
              {t("apply")}
            </button>
          </>
        }
        onClose={() => {
          if (divisionIndex !== undefined) {
            setShowEditModal!(false);
          } else {
            setShowModal!(false);
          }
          setTempVillages(selectedVillages);
        }}
      />
    </Portal>
  );
};

export default CompareVillageModal;
