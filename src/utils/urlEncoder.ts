import { division } from "models/divisions";
import { indicator, indicatorCategory } from "models/indicator";

export const encodeDivisions = (divisions: division[]) => {
  return divisions.map((division) => division.id).join();
};

export const encodeVillages = (selectedDivisions: any[]) => {
  return selectedDivisions
    .map((item) => `${item.parent.id}-${item.division.id}`)
    .join();
};

export const encodeIndicators = (indicators: indicator[]) => {
  return indicators.map((indicator) => indicator.indId).join();
};

export const encodeIndicatorsCategory = (
  indicatorsCategory: indicatorCategory[]
) => {
  const result = indicatorsCategory.map((indicatorCategory) => {
    return indicatorCategory.indicators
      .filter((ind) => !ind.deleted)
      .map((ind) => ind.indId);
  });
  return result.flat(1).join();
};
