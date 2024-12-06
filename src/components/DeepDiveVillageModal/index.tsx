import SearchIcon from "assets/icons/SearchIcon";
import { AtlasModal } from "components/AtlasModal";
import stylesModal from "components/Modal/styles.module.scss";
import useMediaQuery from "hooks/use-media-query";
import React, { FC, Fragment, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import ModalContent from "./ModalContent";
import { GlobalContext } from "context/globalContext";
import { DeepDiveActionType, DeepDiveContext } from "context/deepDiveContext";
import Text from "components/Text";
import CloseModalIcon from "assets/icons/CloseModalIcon";
import { ParentChildren, division } from "models/divisions";
import Loader from "components/Loader";
import { useTranslation } from "react-i18next";
import { handleSearch } from "components/CompareVillageModal/VillageModalsUtility";

const DeepDiveVillageModal: FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showModal, setShowModal }) => {
  const { globalState } = useContext(GlobalContext)!;
  const { state, dispatch } = useContext(DeepDiveContext)!;
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ParentChildren[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [tempVillage, setTempVillage] = useState<
    | {
        district: { id: number; name: string; nameEn: string; geoId: string };
        village: division;
      }
    | undefined
  >({
    district: {
      id: state?.selectedDivision?.district?.id,
      name: state?.selectedDivision?.district?.name,
      nameEn: state?.selectedDivision?.district?.nameEn,
      geoId: state?.selectedDivision?.district?.geoId,
    },
    village: state?.selectedDivision?.village,
  });
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const REGCOUNT = 5000;

  useEffect(() => {
    if (showModal) {
      setSearch("");
    }
  }, [showModal]);

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

  return (
    <>
      <AtlasModal
        title={t("district_villages_filter")}
        subtitle={t("villages_via_search")}
        show={showModal}
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
                {tempVillage ? tempVillage?.village?.name : ""}
              </Text>
              <div className={stylesModal.wrapper}>
                <CloseModalIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setTempVillage(undefined);
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
                      key={division.id}
                      district={{
                        id: division.id,
                        name: division.name,
                        nameEn: division.nameEn,
                        subregions: division.subregions,
                        geoId: division.geoId,
                        abbreviation: "",
                      }}
                      search={search.trim()}
                      setSearchResults={setSearchResults}
                      searchResults={searchResults}
                      selectedVillage={tempVillage || undefined}
                      setSelectedVillage={setTempVillage}
                    />
                  </Fragment>
                ))
              : null}
            {search.trim().length > 2 && searchResults.length > 0
              ? searchResults.map((res) => (
                  <Fragment key={res.id}>
                    <ModalContent
                      district={{
                        id: res.id,
                        name: res.name,
                        nameEn: res.nameEn,
                        subregions: res.subregions,
                        geoId: res.geoId,
                        abbreviation: "",
                      }}
                      search={search.trim()}
                      setSearchResults={setSearchResults}
                      searchResults={searchResults}
                      selectedVillage={tempVillage || undefined}
                      setSelectedVillage={setTempVillage}
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
              disabled={tempVillage === undefined}
              onClick={() => {
                setShowModal(false);
                dispatch({
                  type: DeepDiveActionType.SELECT_VILLAGE,
                  payload: tempVillage,
                });
              }}>
              {t("apply")}
            </button>
          </>
        }
        onClose={() => {
          setShowModal(false);
          setTempVillage(undefined);
        }}
      />
    </>
  );
};

export default DeepDiveVillageModal;
