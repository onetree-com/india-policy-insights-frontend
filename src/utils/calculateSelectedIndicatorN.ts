import { Features } from "models/features";
import { indicatorCategory, indicator } from "../models/indicator";

export const calculateSelectedIndicatorN = (
  selectedIndicators: indicatorCategory[],
  allIndicators: indicatorCategory[],
  feature?: Features,
  t?: (key: string) => string
) => {
  if (!t) {
    return "";
  }
  if (
    selectedIndicators &&
    allIndicators &&
    selectedIndicators.length !== 0 &&
    allIndicators.length !== 0
  ) {
    const allIndicatorsCount = allIndicators.reduce((preValue, item) => {
      return item.indicators ? preValue + item.indicators.length : preValue;
    }, 0);

    let selectedIndicatorCount = 0;
    let selectedIndicatorName = "";

    for (const indCat of selectedIndicators) {
      for (const ind of indCat.indicators) {
        if (!ind.deleted) {
          selectedIndicatorCount++;
          selectedIndicatorName = ind.indName as string;
        }
      }
    }

    const unSelectedIndicatorCount = selectedIndicators.reduce(
      (preValue, item) => {
        return item.indicators
          ? preValue +
              item.indicators.filter((indicator) => {
                return indicator.deleted === true;
              }).length
          : preValue;
      },
      0
    );

    if (selectedIndicatorCount === 1) {
      return selectedIndicatorName;
    } else if (
      (selectedIndicatorCount === allIndicatorsCount ||
        unSelectedIndicatorCount === 0) &&
      feature !== Features.DEEP_DIVE
    ) {
      return "All indicators selected";
    } else if (selectedIndicatorCount === 0 && feature === Features.DEEP_DIVE) {
      return "Select an indicator";
    } else {
      return (
        `${allIndicatorsCount - unSelectedIndicatorCount} ` +
        t("indicators") +
        `${" "}` +
        t("selected")
      );
    }
  } else {
    return "";
  }
};

export const filterIndicators = (
  search: string,
  title: string,
  allIndicators: indicator[],
  setExpand: any
) => {
  const parsedSearch = search.trim();
  let result =
    parsedSearch === "" || title.toLowerCase().includes(parsedSearch)
      ? [...allIndicators]!.sort((a, b) =>
          (a.indName || "").localeCompare(b.indName || "")
        )
      : allIndicators!.filter((i) =>
          i.indName?.toLowerCase().includes(parsedSearch)
        );

  if (
    parsedSearch !== "" &&
    result.some((i) => i.indName?.toLowerCase().includes(parsedSearch))
  ) {
    setExpand(true);
  } else {
    setExpand(false);
  }
  return result;
};

export const getDefaultIndicator = (indicators: indicatorCategory[]) => {
  const defaultIndicatorName = "Female School Attendance";
  const defaultIndicatorNameHi = "कन्या पाठशाला उपस्थिति";
  const allIndicators = indicators.flatMap((i) => i.indicators);
  const defaultIndicator = allIndicators.find(
    (f) =>
      f.indName === defaultIndicatorName || f.indName === defaultIndicatorNameHi
  );
  return defaultIndicator;
};

export const calculateSelectedIndicatorCount = (
  selectedIndicators: indicatorCategory[] | undefined,
  allIndicators: indicatorCategory[]
): number => {
  if (
    selectedIndicators &&
    allIndicators &&
    selectedIndicators.length !== 0 &&
    allIndicators.length !== 0
  ) {
    const selectedIndicatorCount = selectedIndicators.reduce(
      (preValue, item) => {
        return item.indicators
          ? preValue +
              item.indicators.filter((indicator) => {
                return indicator.deleted === false ||
                  indicator.deleted === undefined
                  ? true
                  : false;
              }).length
          : preValue;
      },
      0
    );
    return selectedIndicatorCount;
  } else {
    return 0;
  }
};

export const getSelectedIndicatorNames = (
  selectedIndicators: indicatorCategory[] | undefined,
  selectedIndicatorsFlatCln?: indicator[]
): string => {
  if (
    (selectedIndicators && selectedIndicators.length !== 0) ||
    (selectedIndicatorsFlatCln && selectedIndicatorsFlatCln.length !== 0)
  ) {
    const selectedIndicatorsNames: string[] = [];

    if (selectedIndicators && selectedIndicators.length !== 0) {
      selectedIndicators.forEach((category) => {
        if (category.indicators) {
          category.indicators.forEach((indicator) => {
            if (!indicator.deleted || indicator.deleted === undefined) {
              selectedIndicatorsNames.push(indicator.indName ?? "");
            }
          });
        }
      });
    }

    if (selectedIndicatorsFlatCln && selectedIndicatorsFlatCln.length !== 0) {
      selectedIndicatorsFlatCln.forEach((indicator) => {
        if (!indicator.deleted || indicator.deleted === undefined) {
          selectedIndicatorsNames.push(indicator.indName ?? "");
        }
      });
    }

    if (selectedIndicatorsNames.length === 0) {
      return "";
    } else {
      return selectedIndicatorsNames.join(", ");
    }
  } else {
    return "";
  }
};
