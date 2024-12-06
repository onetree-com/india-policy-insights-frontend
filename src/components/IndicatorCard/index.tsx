import { FC } from "react";
import Text from "components/Text";
import styles from "components/IndicatorCard/styles.module.scss";
import Arrow from "assets/icons/Arrow";
import Indicator2016 from "assets/icons/Indicator2016";
import Indicator2021 from "assets/icons/Indicator2021";
import CheckIcon from "assets/icons/CheckIcon";
import ChangeIndicator from "assets/icons/ChangeIndicator";
import CircleOutlined from "assets/icons/CircleOutlined";
import ArrowPlayUp from "assets/icons/ArrowPlayUp";
import { indicator, readingStrategy } from "models/indicator";
import NoDataLoupe from "assets/icons/NoDataLoupe";
import { roundPrevalence } from "utils/roundPrevalences";
import { useTranslation } from "react-i18next";

const IndicatorCard: FC<{ dataView: "2021" | "2016 - 2021" } & indicator> = ({
  dataView,
  prevalence,
  prevalenceEnd,
  indName,
  indReadingStrategy,
  higherValue,
  lowerValue,
  allIndia,
  stateValue,
  deepDiveCompareColor,
  changeColor,
}) => {
  const { t } = useTranslation();
  const noData =
    (dataView === "2021" && prevalence === undefined) ||
    (dataView === "2016 - 2021" &&
      (prevalence === undefined || prevalenceEnd === undefined));
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Text className={styles.title}>{indName}</Text>
          <div className={styles.subtitleContainer}>
            {noData ? (
              <div className={styles.noData}>
                <NoDataLoupe />
                <Text weight={400} size="12px" lineHeight="16.8px">
                  {t("no_data_indicator")}
                </Text>
              </div>
            ) : null}
            {allIndia !== undefined && !noData ? (
              <Text size="12px" style={{ marginRight: "1rem" }}>
                {t("all_india")}:{" "}
                {allIndia === undefined ? "no data" : `${allIndia}%`}
              </Text>
            ) : null}
            {dataView === "2016 - 2021" &&
            stateValue !== undefined &&
            !noData ? (
              <Text size="12px">
                State: {stateValue === undefined ? "no data" : `${stateValue}%`}
              </Text>
            ) : null}
          </div>
        </div>
        {dataView === "2016 - 2021" && prevalence && prevalenceEnd ? (
          <div className={styles.changeIndicator}>
            {prevalence! > prevalenceEnd! ? (
              <Arrow arrowType="down" color={changeColor!} />
            ) : (
              <Arrow color={changeColor!} />
            )}
            <Text size="14px">
              {roundPrevalence(higherValue! - lowerValue!)}%
            </Text>
          </div>
        ) : null}
      </div>
      {!noData ? (
        <PercentageBar
          dataView={dataView}
          prevalence={prevalence!}
          prevalenceEnd={prevalenceEnd!}
          higherValue={higherValue!}
          lowerValue={lowerValue!}
          readingStrategy={indReadingStrategy}
          changeColorValue={
            dataView === "2021"
              ? deepDiveCompareColor ?? changeColor!
              : changeColor!
          }
          stateValue={stateValue!}
        />
      ) : null}
    </div>
  );
};

export const PercentageBar: FC<{
  dataView: "2021" | "2016 - 2021";
  changeColorValue: string;
  readingStrategy?: readingStrategy;
  className?: string;
  lowerValue: number;
  higherValue: number;
  prevalence: number;
  prevalenceEnd: number;
  stateValue: number;
}> = ({
  dataView,
  readingStrategy: type,
  lowerValue,
  higherValue,
  prevalence,
  prevalenceEnd,
  changeColorValue,
  stateValue,
  className,
}) => {
  return dataView === "2016 - 2021" ? (
    <section className={`${styles.changeContentContainer} ${className}`}>
      {type === readingStrategy.LowerIsBetter ? (
        <div
          style={{ marginRight: "0.75rem" }}
          className={styles.iconContainer}>
          <CheckIcon />
        </div>
      ) : null}
      <div className={styles.percentageBar}>
        <div className={styles.change}>
          <div
            className={styles.classname}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: `${lowerValue}%`,
              width: `${higherValue! - lowerValue!}%`,
              marginRight: `${100 - higherValue!}%`,
            }}>
            {roundPrevalence(lowerValue) === prevalence ? (
              <div className={styles.lowerIndicator}>
                <Text size="12px">{prevalence}%</Text>
                <Indicator2016
                  color={changeColorValue}
                  style={{ marginBottom: "20px", marginTop: "6px" }}
                />
              </div>
            ) : (
              <div className={styles.lowerIndicator}>
                <Indicator2021
                  color={changeColorValue}
                  style={{ marginBottom: "8px", marginTop: "20px" }}
                />
                <Text size="12px">{prevalenceEnd}%</Text>
              </div>
            )}
            <div
              className={styles.arrows}
              style={{
                left: `${lowerValue!}%`,
                width: `${higherValue! - lowerValue!}%`,
                backgroundColor: `${changeColorValue}`,
              }}>
              <ChangeIndicator
                type={lowerValue === prevalence ? "right" : "left"}
              />
            </div>
            {roundPrevalence(higherValue) === prevalenceEnd ? (
              <div
                className={styles.higherIndicator}
                style={{
                  marginLeft: `${higherValue - lowerValue}%`,
                }}>
                <Indicator2021
                  color={changeColorValue}
                  style={{ marginBottom: "6px", marginTop: "20px" }}
                />
                <Text size="12px">{prevalenceEnd}%</Text>
              </div>
            ) : (
              <div
                className={styles.higherIndicator}
                style={{
                  marginLeft: `${higherValue - lowerValue}%`,
                }}>
                <Text size="12px">{prevalence}%</Text>
                <Indicator2016
                  color={changeColorValue}
                  style={{ marginBottom: "20px", marginTop: "8px" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {type === readingStrategy.HigherIsBetter ? (
        <div style={{ marginLeft: "0.75rem" }} className={styles.iconContainer}>
          <CheckIcon />
        </div>
      ) : null}
    </section>
  ) : (
    <section className={`${styles.currentContentContainer} ${className}`}>
      <div
        className={`${
          type === readingStrategy.LowerIsBetter
            ? styles.percentageIndicatorWithCheck
            : styles.percentageIndicator
        }`}>
        {type === readingStrategy.LowerIsBetter ? (
          <CheckIcon style={{ marginRight: "0.5rem" }} />
        ) : null}
        <Text weight={400} size="10px" lineHeight="11.5px">
          0%
        </Text>
      </div>

      <div className={styles.percentageBar}>
        <div
          className={styles.valueIndicator}
          style={{
            backgroundColor: changeColorValue,
            width: `${prevalence}%`,
          }}>
          <div className={styles.circleIndicator}>
            <Text
              size="14px"
              weight={prevalence !== 0 ? 700 : 400}
              lineHeight="16.1px"
              color={changeColorValue}>
              {prevalence}%
            </Text>
            <CircleOutlined centerColor={changeColorValue} />
          </div>
        </div>
        <div
          style={{ marginLeft: `${stateValue!}%` }}
          className={styles.stateIndicator}>
          <ArrowPlayUp />
          <Text
            size="12px"
            weight={400}
            style={{ whiteSpace: "nowrap" }}
            lineHeight="13.8px">
            {stateValue === undefined ? "no data" : `${stateValue}%`}
          </Text>
        </div>
      </div>
      <div
        className={`${
          type === readingStrategy.HigherIsBetter
            ? styles.percentageIndicatorWithCheck
            : styles.percentageIndicator
        }`}>
        {type === readingStrategy.HigherIsBetter ? <CheckIcon /> : null}
        <Text weight={400} size="10px" lineHeight="11.5px">
          100%
        </Text>
      </div>
    </section>
  );
};

export default IndicatorCard;
