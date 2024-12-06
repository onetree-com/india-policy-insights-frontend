import { DivisionTypes } from "context/globalContext";
import { TFunction } from "i18next";
import { DistrictSelectedMap } from "models/district-selected-map";
import { division, ParentChildren } from "models/divisions";

export const tooltipLeft = (index: number, range: string) => {
  if (index === 0) {
    return { left: "-10px" };
  } else if (index === 9) {
    return { right: range.length > 6 ? "-15px" : "-5px" };
  } else {
    return { left: "-4px" };
  }
};

export const prevalenceHeadcountText = (
  selectedMetric: "prevalence" | "headcount",
  t: TFunction
) => {
  return selectedMetric === "prevalence" ? t("percent") : t("head_count");
};

export const selectedGeographyText = (
  selectedDivisions: Array<division>,
  allDivisions: ParentChildren[],
  divisionTye: DivisionTypes,
  t: TFunction,
  selectedDistrictMap?: DistrictSelectedMap
) => {
  if (selectedDistrictMap) {
    return selectedDistrictMap.name;
  }
  if (
    allDivisions.flatMap((x) => x.subregions).flatMap((y) => y.id).length ===
    selectedDivisions.length
  ) {
    return t("all_india");
  }

  return `${selectedDivisions.length} ` + t(`${divisionTye} `) + t("selected");
};
