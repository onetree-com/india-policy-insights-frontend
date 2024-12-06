import { FC, useContext } from "react";
import styles from "./styles.module.scss";
import { PercentageBar } from "components/IndicatorCard";
import Text from "components/Text";
import Arrow from "assets/icons/Arrow";
import ArrowPlayUp from "assets/icons/ArrowPlayUp";
import { readingStrategy } from "models/indicator";
import { CompareContext } from "context/compareContext/index";
import { roundPrevalence } from "utils/roundPrevalences";
import NoDataLoupe from "assets/icons/NoDataLoupe";
import { useTranslation } from "react-i18next";

const DisplayValues: FC<{
  lowerValue: number;
  higherValue: number;
  prevalence: number;
  prevalenceEnd: number;
  stateValue: number;
  color: string;
  indReadingStrategy: readingStrategy;
  isDesktop: boolean;
}> = ({
  lowerValue,
  higherValue,
  prevalence,
  prevalenceEnd,
  stateValue,
  color,
  indReadingStrategy,
  isDesktop,
}) => {
  const { state } = useContext(CompareContext)!;
  const { t } = useTranslation();
  const noData =
    ((state.dataView === "2021" || state.dataView === undefined) &&
      prevalence === undefined) ||
    (state.dataView === "2016 - 2021" &&
      (prevalence === undefined || prevalenceEnd === undefined));

  return !noData ? (
    isDesktop ? (
      <>
        <PercentageBar
          className={`${
            state.dataView === "2021" ? styles.percentageBar : styles.changeBar
          }`}
          dataView={state.dataView}
          lowerValue={lowerValue}
          higherValue={higherValue}
          prevalence={prevalence}
          prevalenceEnd={prevalenceEnd}
          changeColorValue={color}
          readingStrategy={indReadingStrategy}
          stateValue={stateValue}
        />
        {state.dataView === "2016 - 2021" ? (
          <section className={styles.changeIndicator}>
            {prevalence! > prevalenceEnd! ? (
              <Arrow arrowType="down" color={color} />
            ) : (
              <Arrow color={color} />
            )}
            <Text size="14px">
              {roundPrevalence(higherValue! - lowerValue!)}%
            </Text>
          </section>
        ) : null}
      </>
    ) : (
      <>
        {state.dataView === "2021" || state.dataView === undefined ? (
          <section className={styles.currentDataMobile}>
            <div className={styles.dataContainer}>
              <Text weight={400} size="16px" lineHeight="18.4px" color={color}>
                {`${prevalence}%`}
              </Text>
              <div className={styles.percentageBarMobile}>
                <div
                  style={{
                    width: `${prevalence}%`,
                    height: "100%",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    backgroundColor: `${color}`,
                  }}></div>
              </div>
            </div>
            <div className={styles.stateValue}>
              <ArrowPlayUp />
              <Text
                weight={300}
                size="12px"
                lineHeight="10.5px">{`${stateValue}%`}</Text>
            </div>
          </section>
        ) : (
          <section className={styles.changeDataMobile}>
            <div className={styles.changeIndicatorMobile}>
              <Arrow
                color={color}
                arrowType={higherValue === prevalenceEnd ? "up" : "down"}
              />
              <Text
                weight={700}
                size="18px"
                lineHeight="16.1px">{`${roundPrevalence(
                higherValue - lowerValue
              )}%`}</Text>
            </div>

            <div className={styles.values}>
              <Text weight={300} size="10px" lineHeight="20px">
                2016 :
              </Text>
              <Text weight={400} size="10px" lineHeight="20px">
                {` ${prevalence}%`}
              </Text>
            </div>
            <div className={styles.values}>
              <Text weight={300} size="10px" lineHeight="20px">
                2021 :
              </Text>
              <Text weight={400} size="10px" lineHeight="20px">
                {` ${prevalenceEnd}%`}
              </Text>
            </div>
          </section>
        )}
      </>
    )
  ) : (
    <div className={styles.noData}>
      <NoDataLoupe />
      <Text weight={400} size="12px" lineHeight="16.8px">
        {t("no_data_indicator")}
      </Text>
    </div>
  );
};

export default DisplayValues;
