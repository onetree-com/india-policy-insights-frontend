import { indicator } from "models/indicator";
import { roundPrevalence } from "./roundPrevalences";

export const updateColumn = (
  regionIndicators: indicator[],
  stateIndicators: indicator[],
  allIndiaIndicators: indicator[],
  selectedIndicators: indicator[],
  row: string,
  dataView?: string
) => {
  let inds = [...selectedIndicators];
  regionIndicators?.forEach((regionIndicator: indicator) => {
    const roundedIndicatorPrevalence =
      regionIndicator.prevalence !== undefined
        ? roundPrevalence(regionIndicator.prevalence!)
        : undefined;
    const roundedIndicatorPrevalenceEnd =
      regionIndicator.prevalenceEnd !== undefined
        ? roundPrevalence(regionIndicator.prevalenceEnd!)
        : undefined;
    let allIndiaIndicator = allIndiaIndicators.find((item) => {
      return item.indId === regionIndicator.indId;
    });
    let stateIndicator = stateIndicators.find((item) => {
      return item.indId === regionIndicator.indId;
    });

    const indId = inds.findIndex((indicator) => {
      return indicator.indId === regionIndicator.indId;
    });

    if (inds[indId].allIndia === undefined) {
      inds[indId].allIndia = roundPrevalence(
        dataView === "2021" || dataView === undefined
          ? allIndiaIndicator?.prevalence
          : allIndiaIndicator?.prevalenceEnd
      );
    }
    inds[indId].indName = regionIndicator.indName;
    inds[indId][row as keyof indicator] = {
      prevalence: roundedIndicatorPrevalence,
      prevalenceEnd: roundedIndicatorPrevalenceEnd,
      stateValue: roundPrevalence(
        dataView === "2021" || dataView === undefined
          ? stateIndicator?.prevalence
          : stateIndicator?.prevalenceEnd
      ),
      lowerValue:
        regionIndicator.prevalence! < regionIndicator.prevalenceEnd!
          ? regionIndicator.prevalence
          : regionIndicator.prevalenceEnd,
      higherValue:
        regionIndicator.prevalence! > regionIndicator.prevalenceEnd!
          ? regionIndicator.prevalence
          : regionIndicator.prevalenceEnd,
      color: !dataView
        ? regionIndicator.deepDiveCompareColor
        : dataView === "2021"
        ? regionIndicator.deepDiveCompareColor ??
          regionIndicator.prevalenceColor
        : regionIndicator.changeColor,
    };
  });
  return inds;
};

export const updateTable = (
  data: { region: indicator[]; state: indicator[]; allIndia: indicator[] }[],
  selectedIndicators: indicator[],
  dataView?: string
) => {
  let selectedIndicatorsWithData = [...selectedIndicators];
  data.forEach((indicators, index) => {
    const parsedRegionInds: indicator[] = [];
    if (indicators.region.length !== selectedIndicators.length) {
      selectedIndicators.forEach((ind) => {
        const indWithData = indicators.region.find((it) => {
          return it.indId === ind.indId;
        });
        parsedRegionInds.push({ ...ind, ...indWithData });
      });
    } else {
      indicators.region.forEach((ind) => {
        parsedRegionInds.push({ ...ind });
      });
    }

    selectedIndicatorsWithData = updateColumn(
      parsedRegionInds,
      indicators.state,
      indicators.allIndia,
      selectedIndicatorsWithData,
      `row${index + 1}`,
      dataView
    );
  });

  return selectedIndicatorsWithData;
};
