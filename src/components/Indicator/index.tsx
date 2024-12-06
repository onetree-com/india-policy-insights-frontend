import AddIcon from "assets/icons/AddIcon";
import CloseIcon from "assets/icons/CloseIcon";
import EditIcon from "assets/icons/EditIcon";
import IconContainer from "components/IconContainer";
import styles from "components/Indicator/styles.module.scss";
import ModalIndicatorsCompare from "components/Modal/ModalIndicatorsCompare";
import ModalIndicatorsDeepDive from "components/Modal/ModalIndicatorsDeepDive";
import { Selector } from "components/StateDistrictFilter";
import Text from "components/Text";
import Tooltip from "components/Tooltip";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { division } from "models/divisions";
import { Features } from "models/features";
import { indicator, indicatorCategory } from "models/indicator";
import {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { calculateSelectedIndicatorN } from "utils/calculateSelectedIndicatorN";
import { MediaQueries } from "utils/media-queries";
import ModalIndicators from "../Modal/ModalIndicators";
import { useTranslation } from "react-i18next";

const Indicator: FC<{
  allIndicators?: indicatorCategory[];
  selectedIndicators?: indicatorCategory[];
  selectedIndicatorsFlat?: indicator[];
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
  dispatch?: ({ type, payload }: { type: any; payload: any }) => void;
  stylesCompare?: CSSProperties;
}> = ({
  allIndicators,
  selectedIndicators,
  selectedIndicatorsFlat,
  selectedDivisions,
  dispatch,
  stylesCompare,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [active, setActive] = useState<number[]>([]);
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { t } = useTranslation();
  const title = (
    <Text
      color="#3d4247"
      weight={300}
      lineHeight="11px"
      size="10px"
      style={{ marginBottom: 8 }}>
      {t("indicator")}
    </Text>
  );
  return (
    <>
      {globalState.navigation.feature === "ATLAS" && (
        <div className={styles.container}>
          {title}
          <div className={styles.title}>
            <Text lineHeight="24px" weight={400} size="14px" color="#3D4247">
              Anaemia [Any - All Women]
            </Text>
            <IconContainer onClick={() => setShowModal(true)}>
              <EditIcon />
            </IconContainer>
          </div>
          <Text
            style={{ letterSpacing: "0.04em" }}
            lineHeight="10.5px"
            weight={300}
            size="10px"
            color="#575A5C">
            Lower values reflect better outcomes.
          </Text>
          {active.length === 0 ? (
            <Text
              style={{ marginTop: "22.04px", marginBottom: "18px" }}
              lineHeight="17px"
              weight={300}
              size="12px"
              color="#575A5C">
              Click to filter by decile
            </Text>
          ) : (
            <div className={styles["reset-filter"]}>
              <p>Reset filter</p>
              <CloseIcon onClick={(): void => setActive([])} />
            </div>
          )}
          <IndicatorRange active={active} setActive={setActive} />
          <div style={{ marginTop: "25px" }}>
            <Text
              style={{ letterSpacing: "0.04em" }}
              lineHeight="10px"
              weight={300}
              size="10px"
              color="#3D4247">
              All India: Percent (%)
            </Text>
            <div className={styles.percent}>
              <p>
                Median: <span>60.9%</span>
              </p>
              <p>
                min: <span>13.4%</span>
              </p>
              <p>
                max: <span>97.2%</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {globalState.navigation.feature === "RANKING" && (
        <div className={styles.rankingContainer}>
          {title}
          <Selector
            setShowModal={setShowModal}
            placeholder="Select an indicator"
          />
        </div>
      )}
      {globalState.navigation.feature === "COMPARE" ? (
        !isDesktop ? (
          <div
            style={stylesCompare}
            onClick={(): void => setShowModal(true)}
            className={styles.addSelectorMobile}>
            <span>{"Indicators"}</span>
            <AddIcon color="#3D4247" />
          </div>
        ) : (
          <div
            onClick={(): void => setShowModal(true)}
            className={styles.addSelector}>
            <input
              style={{ background: "inherit", pointerEvents: "none" }}
              type="text"
              placeholder={t("add_indicators")}
            />
            <IconContainer background="#e7e7e7">
              <AddIcon />
            </IconContainer>
          </div>
        )
      ) : null}
      {globalState.navigation.feature === "DEEP_DIVE" ? (
        <div
          className={`${styles.DeepDiveContainer} ${styles.rankingContainer}`}>
          <Text
            color="#3d4247"
            style={{ textTransform: "uppercase" }}
            weight={300}
            lineHeight="11px"
            size="10px">
            {t("indicators")}
          </Text>
          <Selector
            setShowModal={setShowModal}
            placeholder={
              calculateSelectedIndicatorN(
                selectedIndicators!,
                allIndicators!,
                Features.DEEP_DIVE,
                t
              ) || ""
            }
          />
        </div>
      ) : null}
      {globalState.navigation.feature === "CREATE_REPORT" ? (
        <div
          className={`${styles.CreateReportContainer} ${styles.rankingContainer}`}>
          <Text color="#3d4247" weight={300} lineHeight="11px" size="10px">
            {t("indicators")}
          </Text>
          <Selector
            setShowModal={setShowModal}
            placeholder={
              selectedIndicatorsFlat?.length !== 0
                ? `${selectedIndicatorsFlat?.length} ` +
                  t("indicator") +
                  `${selectedIndicatorsFlat?.length! > 1 ? "s " : " "}` +
                  t("selected")
                : t("select_indicators")
            }
          />
        </div>
      ) : null}
      {allIndicators !== undefined ? (
        selectedIndicators !== undefined && !selectedIndicatorsFlat ? (
          <ModalIndicatorsDeepDive
            title={t("indicators")}
            subtitle={t("select_indicator_via")}
            show={showModal}
            onClose={() => setShowModal(false)}
            allIndicators={allIndicators!}
            selectedIndicators={selectedIndicators!}
            dispatch={dispatch!}
          />
        ) : globalState.navigation.feature === "COMPARE" ? (
          <ModalIndicatorsCompare
            title={t("indicators")}
            subtitle={t("select_indicator_via")}
            show={showModal}
            selectedDivisions={selectedDivisions}
            seeSelectedIndicators
            onClose={() => setShowModal(false)}
            allIndicators={allIndicators!}
            selectedIndicatorsFlat={selectedIndicatorsFlat!}
            dispatch={dispatch!}
          />
        ) : (
          <ModalIndicators
            title={t("indicators")}
            subtitle={t("select_indicator_via")}
            show={showModal}
            selectedDivisions={selectedDivisions}
            seeSelectedIndicators
            onClose={() => setShowModal(false)}
            allIndicators={allIndicators!}
            selectedIndicatorsFlat={selectedIndicatorsFlat!}
            dispatch={dispatch!}
          />
        )
      ) : null}
    </>
  );
};

export const IndicatorRange: FC<{
  showOnlyColors?: boolean;
  active: number[];
  setActive: Dispatch<SetStateAction<number[]>>;
  isClickable?: boolean;
  style?: CSSProperties;
}> = ({ showOnlyColors, active, setActive, isClickable = true, style }) => {
  const { globalState } = useContext(GlobalContext)!;
  const values: {
    idx: number;
    range: string;
    color: string;
  }[] = [
    { idx: 0.8, range: "0-10", color: "#086192" },
    { idx: 8.1, range: "11-20", color: "#008dd2" },
    { idx: 19.2, range: "21-30", color: "#44a3db" },
    { idx: 28.6, range: "31-40", color: "#8bc4f2" },
    { idx: 39.1, range: "41-50", color: "#abc4cc" },
    { idx: 45.3, range: "51-60", color: "#ccb1b1" },
    { idx: 66.5, range: "61-70", color: "#f4a294" },
    { idx: 75.6, range: "71-80", color: "#ee7a62" },
    { idx: 88.4, range: "81-90", color: "#e94e3a" },
    { idx: 96.7, range: "91-100", color: "#e31e24" },
  ];

  const villageValues: {
    idx: number;
    range: string;
    color: string;
  }[] = [
    { idx: 0.8, range: "0-20", color: "#086192" },
    { idx: 8.1, range: "21-40", color: "#8bc4f2" },
    { idx: 19.2, range: "41-60", color: "#C5B3B8" },
    { idx: 28.6, range: "61-80", color: "#EB7F69" },
    { idx: 39.1, range: "81-100", color: "#E31E24" },
  ];
  const toggleActive = (key: number) => {
    setActive((prevActive) => [
      ...prevActive,
      globalState.divisionType !== DivisionTypes.Village
        ? values[key].idx
        : villageValues[key].idx,
    ]);
  };

  const toggleActiveStyles = (key: number) => {
    if (
      active.includes(
        globalState.divisionType !== DivisionTypes.Village
          ? values[key].idx
          : villageValues[key].idx
      )
    ) {
      return styles.active;
    } else {
      return "";
    }
  };

  return (
    <div className={styles.range} style={style}>
      {!showOnlyColors && (
        <div className={styles["better-worse"]}>
          <Text>Better</Text>
          <div className={styles.line}></div>
          <Text>Worse</Text>
        </div>
      )}
      <div
        className={
          globalState.divisionType !== DivisionTypes.Village
            ? styles.bar
            : styles.villageBar
        }>
        {globalState.divisionType !== DivisionTypes.Village
          ? values.map(({ idx, color, range }, key) => (
              <BarColor
                key={key}
                id={key}
                idx={idx}
                color={color}
                range={range}
                toggleActive={toggleActive}
                toggleActiveStyles={toggleActiveStyles}
                showOnlyColors={showOnlyColors}
                isClickable={isClickable}
              />
            ))
          : villageValues.map(({ idx, color, range }, key) => (
              <BarColor
                key={key}
                id={key}
                idx={idx}
                color={color}
                range={range}
                toggleActive={toggleActive}
                toggleActiveStyles={toggleActiveStyles}
                showOnlyColors={showOnlyColors}
                isClickable={isClickable}
              />
            ))}
      </div>
    </div>
  );
};

export const BarColor: FC<{
  showOnlyColors?: boolean;
  idx: string | number;
  id: number;
  color: string;
  range: string;
  toggleActive?: (key: number) => void;
  toggleActiveStyles?: (key: number) => string;
  isClickable?: boolean;
}> = ({
  showOnlyColors,
  idx,
  color,
  range,
  id,
  toggleActive,
  toggleActiveStyles,
  isClickable,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      {isClickable && (
        <Tooltip show={showTooltip} arrow={false} label={String(range)} />
      )}
      <Tooltip
        show={showTooltip}
        arrow={false}
        label={String(range)}
        top="15px"
        left="0px"
      />
      <button
        style={{
          backgroundColor: color,
          cursor: isClickable ? "pointer" : "auto",
        }}
        className={
          isClickable && toggleActiveStyles ? toggleActiveStyles(id) : ""
        }
        onClick={() => (isClickable && toggleActive ? toggleActive(id) : null)}
        id={`bar-color-${id}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}></button>
      {!showOnlyColors && <p>{idx}</p>}
    </div>
  );
};
export default Indicator;
