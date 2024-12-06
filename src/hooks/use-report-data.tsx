import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateReportContext } from "context/createReportContext";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import { getIndicatorsBetterThan } from "api/getIndicatorsBetterThan";
import { getImprovementRanking } from "api/getImprovementRanking";
import { getIndicatorsAmountPerChange } from "api/getIndicatorsAmountPerChange";
import { getTopIndicatorsChange } from "api/getTopIndicatorsChange";
import { getIndicatorsPerDecile } from "api/getIndicatorsPerDecile";
import { getTableOfIndicators } from "api/getTableOfIndicators";
import {
  ImprovementRanking,
  IndicatorsAmountPerChange,
  IndicatorsBetterThan,
  IndicatorsPerDecile,
  TableOfIndicators,
  TopIndicatorsChange,
} from "models/indicator";

const useReportData = () => {
  const { globalState } = useContext(GlobalContext)!;
  const { state } = useContext(CreateReportContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [indicatorsBetterThan, setIndicatorsBetterThan] = useState<
    IndicatorsBetterThan[]
  >([]);
  const [improvementRanking, setImprovementRanking] =
    useState<ImprovementRanking>();
  const [indicatorsAmountPerChange, setIndicatorsAmountPerChange] = useState<
    IndicatorsAmountPerChange[]
  >([]);
  const [indicatorsPerDecile, setIndicatorsPerDecile] = useState<
    IndicatorsPerDecile[]
  >([]);
  const [topIndicatorsChange, setTopIndicatorsChange] = useState<
    TopIndicatorsChange[][]
  >([]);
  const [tableOfIndicators, setTableOfIndicators] = useState<
    TableOfIndicators[]
  >([]);
  useEffect(() => {
    const controller = new AbortController();
    const divisionId =
      globalState.divisionType === DivisionTypes.Village
        ? state.selectedDivision?.village?.id
        : globalState.selectedDivision?.division?.id;

    if (divisionId !== undefined) {
      Promise.all([
        getIndicatorsPerDecile({
          controller,
          RegionType: globalState.divisionType,
          regionId: divisionId,
        }),
        getTableOfIndicators({
          controller,
          year: 2016,
          yearEnd: 2021,
          RegionType: globalState.divisionType,
          regionId: divisionId,
          currentLanguage,
        }),
        getIndicatorsAmountPerChange({
          controller,
          year: 2016,
          yearEnd: 2021,
          RegionType: globalState.divisionType,
          regionId: divisionId,
        }),
        Promise.all([
          getTopIndicatorsChange({
            controller,
            year: 2016,
            yearEnd: 2021,
            RegionType: globalState.divisionType,
            regionId: divisionId,
            count: 10,
            improvement: false,
            currentLanguage,
          }),
          getTopIndicatorsChange({
            controller,
            year: 2016,
            yearEnd: 2021,
            RegionType: globalState.divisionType,
            regionId: divisionId,
            count: 10,
            improvement: true,
            currentLanguage,
          }),
        ]),
        Promise.all([
          getIndicatorsBetterThan({
            RegionType: globalState.divisionType,
            RegionId: divisionId,
            Year: 2021,
            controller,
            RegionToCompareType: 6,
          }),
          getIndicatorsBetterThan({
            RegionType: globalState.divisionType,
            RegionId: divisionId,
            Year: 2021,
            controller,
            RegionToCompareType:
              globalState.divisionType !== DivisionTypes.Village ? 1 : 2,
          }),
        ]),
        getImprovementRanking({
          controller,
          year: 2016,
          yearEnd: 2021,
          RegionType: globalState.divisionType,
          regionId: divisionId,
        }),
      ]).then((response) => {
        setIndicatorsPerDecile(response[0] as IndicatorsPerDecile[]);
        setTableOfIndicators(response[1] as TableOfIndicators[]);
        setIndicatorsAmountPerChange(
          response[2] as IndicatorsAmountPerChange[]
        );
        setTopIndicatorsChange(response[3] as TopIndicatorsChange[][]);
        setIndicatorsBetterThan(response[4] as IndicatorsBetterThan[]);
        setImprovementRanking(response[5] as ImprovementRanking);
      });
    }
    return () => {
      controller.abort();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalState.selectedDivision?.division?.id,
    state.selectedDivision?.village?.id,
    currentLanguage,
  ]);

  return {
    tableOfIndicators,
    topIndicatorsChange,
    indicatorsPerDecile,
    indicatorsAmountPerChange,
    improvementRanking,
    indicatorsBetterThan,
  };
};

export default useReportData;
