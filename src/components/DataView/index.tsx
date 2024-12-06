import React, { FC, useContext, useMemo } from "react";
import Text from "components/Text";
import styles from "components/DataView/styles.module.scss";
import cx from "classnames";
import useMediaQuery from "hooks/use-media-query";
import { MediaQueries } from "utils/media-queries";
import { DataViews } from "models/data-view";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import Tooltip from "components/Tooltip";
import { useTranslation } from "react-i18next";

const DataView: FC<{
  dataView: DataViews;
  setDataView: (payload: DataViews) => void;
}> = ({ dataView, setDataView }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Text color="#3d4247" weight={300} lineHeight="11px" size="10px">
        {t("data_view")}
      </Text>
      <DataViewBtnContainer dataView={dataView} setDataView={setDataView} />
    </div>
  );
};

export const DataViewBtnContainer: FC<{
  noText?: boolean;
  dataView?: DataViews;
  setDataView?: (payload: DataViews) => void;
}> = ({ dataView = "2021", setDataView = () => {}, noText }) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { t } = useTranslation();

  const text = useMemo(
    () =>
      noText
        ? ""
        : dataView === "2021"
        ? t("You_are_exploring_2021_values")
        : t("You_are_exploring_change_between_2016_and_2021"),
    [noText, dataView, t]
  );

  return (
    <>
      <section className={styles.btnContainer}>
        <DataViewButton
          dataView={"2021"}
          active={dataView === "2021"}
          setActive={setDataView}
        />

        {globalState.divisionType !== DivisionTypes.Village && (
          <div className={styles.btnHover}>
            <DataViewButton
              dataView={"2016 - 2021"}
              active={dataView === "2016 - 2021"}
              setActive={setDataView}
            />
            <div className={styles.tooltipContainer}>
              <Tooltip
                top="auto"
                bottom="-16px"
                left="-100px"
                arrow={false}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "rgba(46, 45, 45, 0.85)",
                  borderRadius: "4px",
                  textTransform: "none",
                  fontFamily: "Helvetica",
                  fontSize: "11px",
                  fontWeight: "400",
                }}
                label={
                  t("feature_not_available") + `${globalState.divisionType}`
                }
              />
            </div>
          </div>
        )}

        {isDesktop && !noText && (
          <span style={{ width: "133px" }} className={styles.text}>
            {t(text)}
          </span>
        )}
        {!isDesktop && !noText && (
          <span style={{ width: "100%" }} className={styles.text}>
            {t(text)}
          </span>
        )}
      </section>
    </>
  );
};

const DataViewButton: FC<{
  dataView: DataViews;
  active: boolean;
  setActive: (payload: DataViews) => void;
  disabled?: boolean;
}> = ({ active, setActive, dataView, disabled }) => {
  return (
    <button
      style={{
        whiteSpace: "nowrap",
        color: "black",
        fontSize: "12px",
        ...(disabled && { cursor: "not-allowed" }),
        ...(active && { color: "white" }),
      }}
      id={`button-data-view-${dataView}`}
      className={cx({ [styles.active]: active })}
      onClick={() => setActive(dataView)}
      disabled={disabled}>
      {dataView}
    </button>
  );
};

export default DataView;
