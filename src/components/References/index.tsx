import ArrowPlayRight from "assets/icons/ArrowPlayRight";
import ArrowPlayUp from "assets/icons/ArrowPlayUp";
import CheckIcon from "assets/icons/CheckIcon";
import DistrictIndicator from "assets/icons/DistrictIndicator";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import Indicator2016 from "assets/icons/Indicator2016";
import Indicator2021 from "assets/icons/Indicator2021";
import styles from "components/References/styles.module.scss";
import Text from "components/Text";
import { GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { DataViews } from "models/data-view";
import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { singularGeographyText } from "utils/formatter";
import { MediaQueries } from "utils/media-queries";

const References: FC<{
  dataView: DataViews;
}> = ({ dataView }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { t } = useTranslation();

  const content =
    dataView === "2016 - 2021" ? (
      <div className={styles.container}>
        <div
          className={`${styles.colorIndicator} ${
            globalState.navigation.feature === "COMPARE"
              ? styles.compare
              : styles.deep_dive
          }`}>
          <div>
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={{
                textAlign: "center",
                bottom: "15px",
                width: "100%",
                position: "absolute",
              }}>
              {t("highest_improvement")}
            </Text>
            <div className={styles.indicatorSigImproved}></div>
          </div>
          <div>
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={{
                whiteSpace: "nowrap",
                textAlign: "center",
                padding: "0px 3px",
                bottom: "15px",
                width: "100%",
                position: "absolute",
              }}>
              {t("improved")}
            </Text>
            <div className={styles.indicatorImproved}></div>
          </div>
          <div>
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={{
                whiteSpace: "nowrap",
                textAlign: "center",
                padding: "0px 3px",
                bottom: "15px",
                width: "100%",
                position: "absolute",
              }}>
              {t("worsened")}
            </Text>
            <div className={styles.indicatorWorsened}></div>
          </div>
          <div>
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={{
                textAlign: "center",
              }}>
              {t("extremely_worsened")}
            </Text>
            <div className={styles.indicatorSigWorsened}></div>
          </div>
        </div>
        <div className={styles.iconReferences}>
          <div className={styles.icon}>
            <Indicator2016 />
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={isDesktop ? { whiteSpace: "nowrap" } : {}}>
              {t("2016_value")}
            </Text>
          </div>
          <div className={styles.icon}>
            <Indicator2021 />
            <Text
              size={isDesktop ? "10px" : "9px"}
              lineHeight="10.35px"
              weight={300}
              style={isDesktop ? { whiteSpace: "nowrap" } : {}}>
              {t("2021_value")}
            </Text>
          </div>
          {globalState.navigation.feature === "DEEP_DIVE" && (
            <div className={styles.icon}>
              <CheckIcon />
              <Text
                size={isDesktop ? "10px" : "9px"}
                lineHeight="10.35px"
                weight={300}
                style={{ whiteSpace: "nowrap", marginLeft: "5px" }}>
                {t("better_outcomes")}
              </Text>
            </div>
          )}
          {globalState.navigation.feature === "DEEP_DIVE" ? null : (
            <>
              <div className={styles.icon}>
                <ArrowPlayRight />
                <Text
                  size={isDesktop ? "10px" : "9px"}
                  lineHeight="10.35px"
                  weight={300}
                  style={isDesktop ? { whiteSpace: "nowrap" } : {}}>
                  {t("national_value")}
                </Text>
              </div>
              <div className={styles.icon}>
                <CheckIcon />
                <Text
                  size={isDesktop ? "10px" : "9px"}
                  lineHeight="10.35px"
                  weight={300}
                  style={{
                    whiteSpace: isDesktop ? "nowrap" : "normal",
                    marginLeft: "5px",
                  }}>
                  {t("better_outcomes")}
                </Text>
              </div>
              <div
                className={styles.item}
                style={!isDesktop ? { marginLeft: 10 } : {}}>
                <Text
                  size={isDesktop ? "10px" : "9px"}
                  style={isDesktop ? { whiteSpace: "nowrap" } : {}}>
                  {t("all_values")}
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    ) : (
      <div className={styles.references}>
        <div style={isDesktop ? {} : { gap: "2%" }} className={styles.items}>
          <div className={styles.item}>
            <DistrictIndicator
              size={isDesktop ? undefined : 30}
              style={isDesktop ? {} : { marginRight: 2 }}
            />
            <Text size={isDesktop ? "10px" : "9px"}>
              {`${t(singularGeographyText(globalState.divisionType, t))} ` +
                t("value")}
            </Text>
          </div>
          <div className={styles.item}>
            <ArrowPlayUp
              size={isDesktop ? undefined : 36}
              style={isDesktop ? {} : { marginBottom: 3 }}
            />
            <Text size={isDesktop ? "10px" : "9px"}>{t("state_value")}</Text>
          </div>
          {globalState.navigation.feature === "DEEP_DIVE" ? null : (
            <div className={styles.item}>
              <ArrowPlayRight
                size={isDesktop ? undefined : 30}
                style={isDesktop ? {} : { marginTop: 3 }}
              />
              <Text size={isDesktop ? "10px" : "9px"}>
                {t("national_value")}
              </Text>
            </div>
          )}
          <div className={styles.item}>
            <CheckIcon
              size={isDesktop ? undefined : 20}
              style={{ marginRight: "6px" }}
            />
            <Text size={isDesktop ? "10px" : "9px"}>
              {t("better_outcomes")}
            </Text>
          </div>
          <div className={styles.item}>
            <Text size={isDesktop ? "10px" : "9px"}>{t("all_values")}</Text>
          </div>
        </div>
      </div>
    );
  return isDesktop ? (
    content
  ) : (
    <div>
      <div
        onClick={() => {
          setExpanded((preValue) => !preValue);
        }}
        className={styles.header}>
        {expanded ? (
          <>
            <Text size="14px" lineHeight="16.8px" weight={400}>
              Hide references
            </Text>
            <ExpandUp />
          </>
        ) : (
          <>
            <Text size="14px" lineHeight="16.8px" weight={400}>
              Show references
            </Text>
            <ExpandDown color="#242328" />
          </>
        )}
      </div>
      {expanded ? content : null}
    </div>
  );
};

export default References;
