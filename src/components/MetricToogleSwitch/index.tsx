import cx from "classnames";
import styles from "components/MetricToogleSwitch/styles.module.scss";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { FC, useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { MediaQueries } from "utils/media-queries";

const MetricToogleSwitch: FC<{
  onChange?: (value: "prevalence" | "headcount") => void;
  showHeadcount?: boolean;
  isAssembly?: boolean;
}> = ({ onChange = () => {}, showHeadcount, isAssembly }) => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const handleChange = useCallback(
    (value: "prevalence" | "headcount") => {
      globalDispatch({
        type: GlobalActionType.SELECT_METRIC,
        payload: value,
      });
      showHeadcount ? onChange(value) : onChange("prevalence");
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () =>
      handleChange(
        (navState && (navState.map as "prevalence" | "headcount")) ||
          "prevalence"
      ),
    [handleChange, navState, showHeadcount]
  );

  return (
    <div
      className={styles["map-displayed"]}
      style={{
        zIndex: isDesktop ? 1 : globalState.modalOpen ? 0 : 1,
      }}>
      <p>{t("map_displayed")}:</p>
      <div className={styles["map-displayed-options"]}>
        <span
          id="prevalence"
          onClick={(): void => handleChange("prevalence")}
          className={cx(
            globalState.selectedMetric === "prevalence" && styles.active
          )}>
          {t("prevalence")}
        </span>
        {showHeadcount && !isAssembly ? (
          <span
            id="headcount"
            onClick={(): void => handleChange("headcount")}
            className={cx(
              globalState.selectedMetric === "headcount" && styles.active
            )}>
            {t("head_count")}
          </span>
        ): null}
      </div>
    </div>
  );
};

export default MetricToogleSwitch;
