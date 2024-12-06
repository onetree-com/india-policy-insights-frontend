import { FC, useContext, useEffect, useMemo, useState } from "react";
import styles from "components/IndicatorRangeChanges/styles.module.scss";
import Text from "components/Text";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { indicatorChanges } from "models/indicator";
import cx from "classnames";
import CloseIcon from "assets/icons/CloseIcon";
import { GlobalContext } from "context/globalContext";
import { roundUp } from "utils/formatter";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { updateAtlasSelectedDecile } from "components/AtlasIndicator";

const IndicatorRangeChanges: FC = () => {
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { state: navState } = useLocation();
  const [selectedDeciles, setSelectedDeciles] = useState<Array<string>>(
    navState?.decilesChange
      ? ((navState?.decilesChange as string).split(",") as any[]).map(
          (dec) => dec
        )
      : []
  );
  const { t } = useTranslation();

  const indicatorChanges = useMemo<indicatorChanges[]>(() => {
    if (!atlasState.indicatorChanges) return [];
    const sortedChanges: indicatorChanges[] = [];
    atlasState.indicatorChanges?.forEach((it) => {
      sortedChanges.unshift(it);
    });
    return sortedChanges;
  }, [atlasState.indicatorChanges]);

  const indicatorChangesCutoffs = useMemo<indicatorChanges[]>(() => {
    const cutoffs: indicatorChanges[] = [];
    atlasState?.indicatorChangesExtraValue?.forEach((item) => {
      cutoffs.unshift(item);
    });
    return cutoffs;
  }, [atlasState.indicatorChangesExtraValue]);

  useEffect(() => {
    atlasDispatch({
      type: AtlasActionType.SELECT_DECILES_CHANGES,
      payload:
        selectedDeciles.length === 0
          ? indicatorChanges.map((x) => x.changeHex)
          : selectedDeciles,
    });
  }, [indicatorChanges, selectedDeciles, atlasDispatch]);

  if (indicatorChanges?.length === 0) return <div />;

  return (
    <div className={styles.container}>
      {selectedDeciles.length === 0 ? (
        <Text
          style={{ marginTop: "22.04px", marginBottom: "18px" }}
          lineHeight="17px"
          weight={300}
          size="12px"
          color="#575A5C">
          {t("click_to_filter_category")}
        </Text>
      ) : (
        <div className={styles["reset-filter"]}>
          <p>{t("reset_filter")}</p>
          <CloseIcon
            onClick={(): void => {
              setSelectedDeciles([]);
            }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}>
        <div className={styles.bar}>
          {indicatorChanges?.map((indicator, key) => (
            <IndicatorRangeChangesBarColor
              key={key}
              index={key}
              isActive={selectedDeciles.includes(indicator.changeHex)}
              setIsActive={(decile, decileId) => {
                updateAtlasSelectedDecile(
                  decile,
                  atlasState,
                  globalState,
                  selectedDeciles,
                  setSelectedDeciles,
                  decileId
                );
              }}
              changeDescription={t(indicator.changeDescription)}
              decileId={indicator.prevalenceChangeId}
              color={indicator.changeHex}
              prevalenceChangeCutoffs={indicator.prevalenceChangeCutoffs}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}>
          {indicatorChangesCutoffs?.map((i, index) => {
            return (
              <span
                className={styles.cutoffText}
                style={
                  index === 3
                    ? { marginLeft: 12 }
                    : index === 1
                    ? { marginRight: 12 }
                    : {}
                }>
                {roundUp(i?.prevalenceChangeCutoffs)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const IndicatorRangeChangesBarColor: FC<{
  index: number;
  decileId: number;
  color: string;
  changeDescription: string;
  prevalenceChangeCutoffs: number;
  isActive: boolean;
  setIsActive: (decile: string, decileId: number) => void;
}> = ({
  index,
  color,
  decileId,
  changeDescription,
  prevalenceChangeCutoffs,
  isActive,
  setIsActive,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const { atlasState } = useContext(AtlasContext)!;
  const districts = atlasState.divisionsMeasurementsChanges?.filter(
    (division) => division.changeHex === color
  );
  const districtsTotal = districts?.length;
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={styles.barColorContainer}>
      <section
        className={cx(
          styles.customTooltip,
          styles.bottom,
          showTooltip && styles["inline-block"]
        )}
        style={{
          left: index === 3 ? "-20px" : "10px",
          transform: "translateY(-110%)",
        }}>
        <label>
          {districtsTotal} {`${globalState ? t(globalState.divisionType) : ""}`}
        </label>
        <label>{t(changeDescription.toLowerCase().replace(" ", "_"))}</label>
      </section>
      <Text
        style={{ textAlign: "center" }}
        lineHeight="10px"
        weight={300}
        size="8px"
        color="#3D4247">
        {t(changeDescription.toLowerCase().replace(" ", "_"))}
      </Text>
      <button
        className={cx(isActive && styles.active)}
        onClick={() => {
          setIsActive(color, decileId);
        }}
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        style={{ backgroundColor: color }}></button>
    </div>
  );
};

export default IndicatorRangeChanges;
