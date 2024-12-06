import { SelectedDivisionType } from "context/compareContext";
import { division, ParentChildren } from "models/divisions";
import { indicator, indicatorCategory } from "models/indicator";

export const loadDivision = (
  allDivisions: ParentChildren[],
  subregionId: number
) => {
  let index = -1;
  const result = allDivisions.find((a) => {
    const subregionIndex = a.subregions.findIndex((s) => s.id === subregionId);
    if (subregionIndex > -1) {
      index = subregionIndex;
      return a;
    }
    return undefined;
  });
  const subregion = result?.subregions[index];
  const division: SelectedDivisionType = {
    parent: { id: result?.id!, name: result?.name! },
    division: subregion!,
  };
  return division;
};

export const loadSubregion = (
  allDivisions: ParentChildren[],
  subregionId: number
) => {
  let index = -1;
  const result = allDivisions.find((a) => {
    const subregionIndex = a.subregions.findIndex((s) => s.id === subregionId);
    if (subregionIndex > -1) {
      index = subregionIndex;
      return a;
    }
    return undefined;
  });
  return result?.subregions[index];
};

export const loadDivisions = (allDivisions: ParentChildren[], ids: string) => {
  const subregionsIdArray = (ids as string).split(",") as any[];
  const subregionIds = subregionsIdArray.map(Number);
  let divisions: SelectedDivisionType[] = [];
  subregionIds.forEach((subregionId) => {
    const division = loadDivision(allDivisions, subregionId);
    divisions.push(division);
  });
  return divisions;
};

export const loadSubregions = (allDivisions: ParentChildren[], ids: string) => {
  const subregionsIdArray = (ids as string).split(",") as any[];
  const subregionIds = subregionsIdArray.map(Number);
  let subregions: division[] = [];
  subregionIds.forEach((subregionId) => {
    const subregion = loadSubregion(allDivisions, subregionId);
    subregions.push(subregion!);
  });
  return subregions;
};

export const loadIndicators = (
  allIndicators: indicatorCategory[],
  indicatorIds: string
) => {
  const indIdsStr = (indicatorIds as string).split(",") as any[];
  const indIds = indIdsStr.map(Number);
  let indicators: indicator[] = [];
  indIds.forEach((indId) => {
    allIndicators.find((a) => {
      const result = a.indicators.find((i) => i.indId === indId);
      if (result) {
        indicators.push(result!);
        return true;
      }
      return false;
    });
  });
  return indicators;
};

export const loadIndicatorsCategory = (
  allIndicators: indicatorCategory[],
  indicatorIds: string
) => {
  const indIdsStr = (indicatorIds as string).split(",") as any[];
  const indIds = indIdsStr.map(Number);

  allIndicators.forEach((cat) => {
    cat.indicators.forEach((ind) => {
      ind.deleted = indIds.findIndex((id) => ind.indId === id) === -1;
    });
  });
  return [...allIndicators];
};
