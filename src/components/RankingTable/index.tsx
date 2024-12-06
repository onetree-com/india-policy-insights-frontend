import Arrow from "assets/icons/Arrow";
import ArrowDropDouble from "assets/icons/ArrowDropDouble";
import ArrowDropDoubleSort from "assets/icons/ArrowDropDoubleSort";
import cx from "classnames";
import { BodyTableDataRanking } from "components/RankingSidebar";
import styles from "components/RankingTable/styles.module.scss";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { RankingActionType, RankingContext } from "context/rankingContext";
import useMediaQuery from "hooks/use-media-query";
import useSortableData from "hooks/use-sortable-data";
import {
  DistrictSelectedMap,
  DistrictSelectedMapChanges,
} from "models/district-selected-map";
import {
  division,
  DivisionMeasurement,
  DivisionMeasurementChanges,
} from "models/divisions";
import {
  indicator,
  indicatorChanges,
  indicatorDeciles,
} from "models/indicator";
import { Dispatch, FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSafari } from "utils/browserDetector";
import { roundUp } from "utils/formatter";
import { MediaQueries } from "utils/media-queries";
import { roundPrevalence, roundHeadcount } from "../../utils/roundPrevalences";
import { useTranslation } from "react-i18next";

const setDeepPath = (globalState: any) => {
  if (globalState && globalState.divisionType) {
    switch (globalState.divisionType) {
      case DivisionTypes.Parlimentary_Constituencies:
        return "parliamentary-constituencies";
      case DivisionTypes.District:
        return "districts";
      case DivisionTypes.Assembly_Constituencies:
        return "assembly-constituencies";
      case DivisionTypes.Village:
        return "villages";
    }
  } else {
    return "";
  }
};

const RankingTable: FC<{ tbodyData: BodyTableDataRanking[] }> = ({
  tbodyData,
}) => {
  const { items, requestSort, sortConfig } = useSortableData(tbodyData);
  const { rankingState, rankingDispatch } = useContext(RankingContext)!;

  const onClick = (value: string) => {
    requestSort(value);
  };
  const { globalDispatch } = useContext(GlobalContext)!;

  return (
    <div className={styles.container}>
      <table>
        {rankingState.dataView.yearEnd ? (
          <RankingChangeHeader sortConfig={sortConfig} onClick={onClick} />
        ) : (
          <RankingHeader sortConfig={sortConfig} onClick={onClick} />
        )}
        <tbody>
          {items.map((row, index) => (
            <Tr
              rankingState={rankingState}
              globalDispatch={globalDispatch}
              rankingDispatch={rankingDispatch}
              key={index}
              row={row}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Tr: FC<{
  row: BodyTableDataRanking;
  globalDispatch?: Dispatch<{
    type: GlobalActionType;
    payload: any;
  }>;
  rankingDispatch?: Dispatch<{
    type: RankingActionType;
    payload: any;
  }>;
  rankingState: {
    selectedIndicator?: indicator;
    selectedDivisions: Array<division>;
    indicatorDeciles?: indicatorDeciles;
    selectedDeciles: Array<number>;
    divisionsMeasurements: Array<DivisionMeasurement>;
    selectAspirationalDistricts: boolean;
    dataView: {
      year: number;
      yearEnd?: number;
    };
    selectedDistrictMap?: DistrictSelectedMap;
    selectedDistrictMapChanges?: DistrictSelectedMapChanges;
    divisionsMeasurementsChanges?: Array<DivisionMeasurementChanges>;
    indicatorChanges?: Array<indicatorChanges>;
    selectedDecilesChanges?: Array<string>;
    selectedRowTable: {
      id: string;
      name: string;
    };
  };
}> = ({ row, globalDispatch, rankingDispatch, rankingState }) => {
  const [menu, setMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const { rankingToCompareInfo } = useGlobalActions();
  const ref = useRef<HTMLTableRowElement>(null);
  const { t } = useTranslation();
  const { globalState } = useContext(GlobalContext)!;

  useEffect(() => {
    let handler = (event: any) => {
      const { current } = ref;
      if (current && !current.contains(event.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mouseout", handler);
    return () => {
      document.removeEventListener("mouseout", handler);
    };
  }, []);

  const goToDeepDive = () => {
    globalDispatch!({
      type: GlobalActionType.RANKING_TO_DEEP_DIVE_DIVISION,
      payload: {
        id: row.id,
        geoId: row.geoId,
        name: row.district,
      },
    });
    navigate(`/deep-dive/${setDeepPath(globalState)}`);
  };

  const goToCompare = () => {
    rankingToCompareInfo({
      division: {
        id: row.id,
        geoId: row.geoId,
        name: row.district,
        nameEn: row.district,
      },
      indicator: rankingState.selectedIndicator!,
    });

    navigate(`/compare/${setDeepPath(globalState)}`);
  };

  return (
    <tr
      id={String(row.id)}
      ref={ref}
      onClick={(e) => {
        if (
          rankingState &&
          rankingState.selectedRowTable &&
          rankingState.selectedRowTable.name &&
          rankingState.selectedRowTable.name.toLowerCase() ===
            row.district.toLowerCase()
        ) {
          rankingDispatch!({
            type: RankingActionType.SELECTED_ROW_TABLE,
            payload: {
              id: "",
              name: "",
              fromMapToTable: false,
            },
          });
        } else {
          rankingDispatch!({
            type: RankingActionType.SELECTED_ROW_TABLE,
            payload: {
              id: row.id,
              name: row.district,
              fromMapToTable: false,
            },
          });
        }
        if (ref.current) {
          if (
            e.clientX > ref.current.offsetWidth - 24 &&
            e.clientX < ref.current.offsetWidth
          ) {
            setMenu(!menu);
          }
        }
      }}
      className={cx(
        rankingState.selectedRowTable?.name?.toLowerCase() ===
          row?.district?.toLowerCase() && styles.selectedRowStyle
      )}>
      <TableDataElements dataView={rankingState.dataView} row={row} />
      {menu && (
        <div
          className={styles.menu}
          style={
            isSafari()
              ? { top: (ref.current?.offsetTop ?? 0) + 38, height: 100 }
              : {}
          }>
          <p onClick={goToDeepDive}>{t("Deep Dive")}</p>
          <p onClick={goToCompare}>{t("Compare")}</p>
        </div>
      )}
    </tr>
  );
};

type TableDataElementsProps = {
  dataView: {
    year: number;
    yearEnd?: number;
  };
  row: BodyTableDataRanking;
};

const TableDataElements = ({ dataView, row }: TableDataElementsProps) => {
  const arrowDirection = (r: BodyTableDataRanking) => {
    if (!r.prevalenceChange) {
      return "";
    }

    return r.prevalenceChange < 0 ? "rotate(180deg)" : "";
  };

  return dataView.yearEnd ? (
    <>
      <td>
        <div className={styles.textContainer}>
          {row.district}, {row.stateAbbreviation}
        </div>
      </td>
      <td></td>
      <td>
        <Arrow
          color={row.changeHex}
          style={{
            marginBottom: -6,
            transform: arrowDirection(row),
          }}
        />
        {row.prevalenceChange !== undefined
          ? roundPrevalence(row.prevalenceChange)
          : 0}
      </td>
      <td>{row.prevalenceEnd ? roundPrevalence(row.prevalenceEnd) : 0}</td>
      <td></td>
      <td>{row.prevalence ? roundPrevalence(row.prevalence) : 0}</td>
    </>
  ) : (
    <>
      <td>
        <div className={styles.textContainer}>
          {row.district}, {row.stateAbbreviation}
        </div>
      </td>
      <td></td>
      <td style={{ fontFamily: "Helvetica-Bold" }}>{row.prevalenceRank}</td>
      <td>{roundUp(row.prevalencePercent)}%</td>
      <td style={{ fontFamily: "Helvetica-Bold" }}>{row.headcountRank}</td>
      <td>{roundHeadcount(row.headcountPercent)}</td>
    </>
  );
};

type RankingChangeHeaderProps = {
  onClick: Function;
  sortConfig: {
    key: string;
    direction: string;
  } | null;
};

const RankingChangeHeader = ({
  onClick,
  sortConfig,
}: RankingChangeHeaderProps) => {
  const { globalState } = useContext(GlobalContext)!;
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { t } = useTranslation();
  const isParliamentary =
    globalState.divisionType === DivisionTypes.Parlimentary_Constituencies;
  return (
    <thead>
      <tr>
        <th
          onClick={() => onClick("district")}
          style={
            !isDesktop && isParliamentary
              ? { display: "flex", alignItems: "center" }
              : {}
          }>
          {` ${
            isParliamentary ? t("Parliamentary Constituency") : t("District")
          }, ${t("state")}`}{" "}
          {headerArrows(sortConfig, "district")}
        </th>
        <th></th>
        <th onClick={() => onClick("prevalenceChange")}>
          2016 - 2021 {headerArrows(sortConfig, "prevalenceChange")}
        </th>
        <th
          colSpan={2}
          style={{ minWidth: "100px" }}
          onClick={() => onClick("prevalenceEnd")}>
          2021 {headerArrows(sortConfig, "prevalenceEnd")}
        </th>
        <th
          colSpan={2}
          style={{ minWidth: "100px" }}
          onClick={() => onClick("prevalence")}>
          2016
          {headerArrows(sortConfig, "prevalence")}
        </th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
  );
};

const RankingHeader = ({ onClick, sortConfig }: RankingChangeHeaderProps) => {
  const { globalState } = useContext(GlobalContext)!;
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { t } = useTranslation();
  const isParliamentary =
    globalState.divisionType === DivisionTypes.Parlimentary_Constituencies;
  return (
    <thead>
      <tr>
        <th
          onClick={() => onClick("district")}
          style={
            !isDesktop && isParliamentary
              ? { display: "flex", alignItems: "center" }
              : {}
          }>
          {` ${
            isParliamentary ? t("Parliamentary Constituency") : t("District")
          }, ${t("state")}`}{" "}
          {headerArrows(sortConfig, "district")}
        </th>
        <th></th>
        <th
          colSpan={2}
          style={{ minWidth: "100px" }}
          onClick={() => onClick("prevalencePercent")}>
          {t("prevalence")} {headerArrows(sortConfig, "prevalencePercent")}
        </th>
        <th
          colSpan={2}
          style={{ minWidth: "100px" }}
          onClick={() => onClick("headcountPercent")}>
          {t("head_count")}
          {headerArrows(sortConfig, "headcountPercent")}
        </th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th>{t("rank")}</th>
        <th>{t("percent")}</th>
        <th>{t("rank")}</th>
        <th>{t("count")}</th>
      </tr>
    </thead>
  );
};

const headerArrows = (
  sortConfig: {
    key: string;
    direction: string;
  } | null,
  key: string
) => {
  return sortConfig === null || sortConfig.key !== key ? (
    <ArrowDropDouble />
  ) : (
    <ArrowDropDoubleSort ascending={sortConfig.direction === "ascending"} />
  );
};

export default RankingTable;
