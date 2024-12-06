import {
  TableOfIndicators,
  TopIndicatorsChange,
  IndicatorsPerDecile,
  IndicatorsAmountPerChange,
  ImprovementRanking,
  IndicatorsBetterThan,
} from "../models/indicator";

export const reportHasData = ({
  tableOfIndicators,
  topIndicatorsChange,
  indicatorsPerDecile,
  indicatorsAmountPerChange,
  improvementRanking,
  indicatorsBetterThan,
}: {
  tableOfIndicators: TableOfIndicators[];
  topIndicatorsChange: TopIndicatorsChange[][];
  indicatorsPerDecile: IndicatorsPerDecile[];
  indicatorsAmountPerChange: IndicatorsAmountPerChange[];
  improvementRanking: ImprovementRanking | undefined;
  indicatorsBetterThan: IndicatorsBetterThan[];
}): boolean => {
  //spitefully leaveing improvementRanking out of this check as it isn't directly connected to having data on all other variables

  return !(
    tableOfIndicators.length === 0 &&
    topIndicatorsChange.flat(1).length === 0 &&
    indicatorsPerDecile.length === 0 &&
    indicatorsBetterThan.every((ind) => {
      return ind.betterThanAverage === 0;
    }) &&
    indicatorsAmountPerChange.every((ind) => {
      return ind.indicatorCount === 0;
    })
  );
};
