import CloseModalIcon from "assets/icons/CloseModalIcon";
import SearchIcon from "assets/icons/SearchIcon";
import { indicator, indicatorCategory } from "models/indicator";
import React, { FC, useState } from "react";

import styles from "components/Indicator/styles.module.scss";
import Loader from "components/Loader";
import stylesModal from "components/Modal/styles.module.scss";
import Text from "components/Text";
import ModalContent from "./ModalContent";
import { AtlasModal } from "components/AtlasModal";
import useMediaQuery from "hooks/use-media-query";
import { MediaQueries } from "utils/media-queries";
import { dispatchGTMEvent } from "utils/tagManager";
import { useTranslation } from "react-i18next";

const IndicatorModal: FC<{
  loading?: boolean;
  indicators: Array<indicatorCategory>;
  indicatorSelected: indicator;
  setIndicatorSelected: React.Dispatch<React.SetStateAction<indicator>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  loading,
  indicators,
  indicatorSelected,
  setIndicatorSelected,
  showModal,
  setShowModal,
}) => {
  const [selected, setSelected] = useState<indicator | undefined>(
    indicatorSelected
  );
  const [search, setSearch] = useState<string>("");
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { t, i18n } = useTranslation();

  return (
    <AtlasModal
      title={t("indicator")}
      subtitle={t("select_indicator_via")}
      show={showModal}
      style={{
        content: {
          overflowY: "auto",
          height: isDesktop ? "calc(80vh - 295px)" : "calc(80vh - 230px)",
          width: "calc(100% - 16px)",
        },
      }}
      onClose={() => {
        dispatchGTMEvent({
          event: "indicator_select_cancel",
        });
        setShowModal(false);
      }}
      header={
        <>
          <div
            className={stylesModal.search}
            style={{
              padding: "11px",
            }}>
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
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                }}
              />
            </div>
          </div>
          <div className={stylesModal.filter}>
            <Text color="#A51C30" weight={400} size="16px" lineHeight="24px">
              {i18n.language === "en"
                ? selected?.indNameEn
                : selected?.indNameHi}
            </Text>
            <CloseModalIcon
              onClick={() => setSelected(undefined)}
              size={9}
              style={{ cursor: "pointer" }}
            />
          </div>
        </>
      }
      content={
        <>
          {indicators &&
            indicators.map((indicator) => (
              <ModalContent
                key={indicator.catId}
                title={indicator.catName}
                items={indicator.indicators}
                search={search}
                selected={selected?.indId}
                setSelected={setSelected}
              />
            ))}
        </>
      }
      footer={
        <>
          <button
            id="modal-atlas-indicator-button"
            className={`${loading ? styles.loading : null}`}
            disabled={!selected}
            onClick={() => {
              setIndicatorSelected(selected!);
              setShowModal(false);
            }}>
            {loading && <Loader />}
            {loading ? "Applying" : t("apply")}
          </button>
        </>
      }
    />
  );
};

export default IndicatorModal;
