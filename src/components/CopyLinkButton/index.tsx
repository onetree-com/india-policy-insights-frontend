import { FC, useContext, useState } from "react";
import styles from "components/CopyLinkButton/styles.module.scss";
import LinkIcon from "assets/icons/LinkIcon";
import useMediaQuery from "hooks/use-media-query";
import { MediaQueries } from "utils/media-queries";
import { GlobalContext } from "context/globalContext";
import { createShortUrl } from "api/getShortUrl";
import {
  encodeDivisions,
  encodeIndicators,
  encodeIndicatorsCategory,
} from "utils/urlEncoder";
import { indicator, indicatorCategory } from "models/indicator";
import { division } from "models/divisions";
import { toast, ToastOptions } from "react-toastify";
import { useLocation } from "react-router-dom";
import { DataViews } from "models/data-view";
import { useTranslation } from "react-i18next";
import CloseModalIcon from "assets/icons/CloseModalIcon";
import Text from "components/Text";
import Tooltip from "components/Popup/Tooltip";
interface Props {
  buttonStyles?: React.CSSProperties;
  indicatorsCategory?: indicatorCategory[];
  indicators?: indicator[];
  indId?: number;
  subregionId?: number;
  lang?: string;
  divisions?: division[];
  dataView?: DataViews;
  deciles?: Array<number>;
  decilesChange?: Array<string>;
}

const CopyLinkButton: FC<Props> = ({
  buttonStyles,
  indicatorsCategory,
  indicators,
  subregionId,
  indId,
  divisions,
  lang,
  dataView,
  deciles,
  decilesChange,
}) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [copyUrl, setCopyUrl] = useState<string>("");

  const toastStyle: ToastOptions = {
    style: { position: "absolute", right: 0, bottom: 50 },
    bodyStyle: { fontFamily: "Helvetica", fontSize: "14px" },
  };

  const handleCopyLink = async () => {
    const abortController = new AbortController();
    const currentLanguage = i18n.language;
    try {
      let baseUrl = pathname;
      baseUrl += `?dataView=${dataView || "2021"}`;
      baseUrl += `&map=${globalState.selectedMetric}`;

      if (indicatorsCategory && indicatorsCategory.length > 0) {
        baseUrl += `&indIds=${encodeIndicatorsCategory(indicatorsCategory!)}`;
      } else if (indicators && indicators.length > 0) {
        baseUrl += `&indIds=${encodeIndicators(indicators!)}`;
      }
      if (subregionId) {
        baseUrl += `&subregionId=${subregionId}`;
      }
      if (indId) {
        baseUrl += `&indId=${indId}`;
      }
      if (lang) {
        baseUrl += `&lang=${lang}`;
      }
      if (divisions && divisions.length > 0) {
        baseUrl += `&subregionIds=${encodeDivisions(divisions)}`;
      }

      if (
        dataView === "2021" &&
        deciles &&
        deciles.length > 0 &&
        deciles.length < 10
      ) {
        baseUrl += `&deciles=${deciles.toString()}`;
      }
      if (
        dataView === "2016 - 2021" &&
        decilesChange &&
        decilesChange.length > 0
      ) {
        baseUrl += `&decilesChange=${decilesChange.toString()}`;
      }

      const result: any = await createShortUrl({
        originalUrl: baseUrl,
        controller: abortController,
      });
      const { protocol, host } = window.location;
      const newUrl = `${protocol}//${host}/link/${result.url}`;
      try {
        navigator.clipboard.writeText(newUrl);
        if (currentLanguage === "en") {
          toast("Link copied successfully", toastStyle);
        } else {
          toast("लिंक काॅपी हो गया है।", toastStyle);
        }
      } catch (error) {
        setCopyUrl(newUrl);
      }
    } catch (err) {
      abortController.abort();
      if (currentLanguage === "en") {
        toast("An error occurred", toastStyle);
      } else {
        toast("कुछ खराब हो गया है।", toastStyle);
      }
    }
  };

  return (
    <>
      <Tooltip
        show={copyUrl !== ""}
        closeFromOutside={() => setCopyUrl("")}
        classname={styles.copyLink}
        customStyles={{
          zIndex: isDesktop ? 1 : globalState.modalOpen ? 0 : 1,
          ...buttonStyles,
        }}>
        <header>
          <Text>{t("please_copy_link")}</Text>
          <CloseModalIcon
            size={10}
            onClick={() => {
              setCopyUrl("");
            }}
          />
        </header>
        <Text className={styles.url}>{copyUrl}</Text>
      </Tooltip>
      <button
        id="copy-link-button"
        style={{
          zIndex: isDesktop ? 1 : globalState.modalOpen ? 0 : 1,
          ...buttonStyles,
        }}
        onClick={handleCopyLink}
        className={
          i18n.language === "hi"
            ? styles["lang-hi-link-icon-container"]
            : styles["lang-en-link-icon-container"]
        }>
        <LinkIcon />
      </button>
    </>
  );
};

export default CopyLinkButton;
