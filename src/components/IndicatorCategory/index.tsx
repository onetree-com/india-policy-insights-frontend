import { FC, useState, useContext } from "react";
import styles from "components/IndicatorCategory/styles.module.scss";
import Text from "components/Text";
import IndicatorCard from "components/IndicatorCard";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import { indicatorCategory, indicator } from "models/indicator";
import { DeepDiveContext } from "context/deepDiveContext";
import { t } from "i18next";

const IndicatorCategory: FC<indicatorCategory> = ({ catName, indicators }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const { state } = useContext(DeepDiveContext)!;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size="18px" weight={400} lineHeight="20.7px">{`${catName} (${
          indicators ? indicators.length : null
        })`}</Text>
        <div
          onClick={() => {
            setExpanded((preValue) => !preValue);
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {expanded ? (
            <div className={styles.collapseBtn}>
              <Text size="14px" lineHeight="16.8px" weight={400}>
                {t("hide_category")}
              </Text>
              <ExpandUp />
            </div>
          ) : (
            <div className={styles.collapseBtn}>
              <Text size="14px" lineHeight="16.8px" weight={400}>
                {t("show_category")}
              </Text>
              <ExpandDown color="#242328" />
            </div>
          )}
        </div>
      </div>
      <div className={expanded ? styles.expandedIndicators : styles.indicators}>
        {indicators && indicators.length !== 0
          ? indicators.map((indicator: indicator, index: number) => {
              return expanded &&
                (indicator.deleted === false ||
                  indicator.deleted === undefined) ? (
                <IndicatorCard
                  key={`Indicator_category_${index}`}
                  dataView={state.dataView}
                  {...indicator}
                />
              ) : null;
            })
          : null}
      </div>
    </div>
  );
};

export default IndicatorCategory;
