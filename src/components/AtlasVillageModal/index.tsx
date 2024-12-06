import SearchIcon from "assets/icons/SearchIcon";
import { AtlasModal } from "components/AtlasModal";
import stylesModal from "components/Modal/styles.module.scss";
import useMediaQuery from "hooks/use-media-query";
import { division } from "models/divisions";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import ModalContent from "./ModalContent";
import { AtlasContext } from "context/atlasContext";
import { useTranslation } from "react-i18next";

const AtlasVillageModal: FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVillages: division[];
  setSelectedVillages: React.Dispatch<React.SetStateAction<division[]>>;
}> = ({ showModal, setShowModal, selectedVillages, setSelectedVillages }) => {
  const { atlasState } = useContext(AtlasContext)!;
  const [search, setSearch] = useState<string>("");
  const [tempVillages, setTempVillages] =
    useState<division[]>(selectedVillages);
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);

  useEffect(() => {
    if (showModal) {
      setSearch("");
    }
  }, [showModal]);

  return (
    <>
      <AtlasModal
        title={`${t("State-District")} ${t("filter")}`}
        subtitle={t("viewable_villages")}
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
                  placeholder="Search"
                  value={search}
                  onChange={(ev) => {
                    setSearch!(ev.target.value.toLowerCase());
                  }}
                />
              </div>
            </div>
          </div>
        }
        content={
          <>
            {atlasState.allDistrictVillages ? (
              <ModalContent
                search={search}
                selectedVillages={tempVillages || []}
                setSelectedVillages={setTempVillages}
              />
            ) : null}
          </>
        }
        footer={
          <>
            <button
              id="modal-atlas-division-button"
              disabled={tempVillages.length === 0}
              onClick={() => {
                setShowModal(false);
                setSelectedVillages(tempVillages);
              }}>
              Apply
            </button>
          </>
        }
        onClose={() => {
          setShowModal(false);
          setTempVillages(selectedVillages);
        }}
      />
    </>
  );
};

export default AtlasVillageModal;
