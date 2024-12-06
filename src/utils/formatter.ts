import { DivisionTypes } from "context/globalContext";
import { TFunction } from "i18next";

export const commarize = (value: number) => {
  const len = Math.round(value).toString().length;
  const unit = len >= 12 ? "T" : len >= 9 ? "B" : len >= 7 ? "M" : "K";

  if (len <= 5) {
    return roundHeadcount(value, 1000).toLocaleString().substring(0, 3) + unit;
  } else if (len === 6) {
    return roundHeadcount(value, 1000).toLocaleString().substring(0, 3) + unit;
  } else if (len === 7) {
    return (
      roundHeadcount(value, 1000000).toLocaleString().substring(0, 3) + unit
    );
  } else if (len > 7 && len <= 9) {
    return (
      roundHeadcount(value, 1000000).toLocaleString().substring(0, 4) + unit
    );
  } else if (len === 10) {
    return (
      roundHeadcount(value, 1000000000).toLocaleString().substring(0, 3) + unit
    );
  }
  return "";
};

const roundHeadcount = (val: any, divider: any) => {
  if (!val || !divider) return 0;
  let roundingDigit = 0;
  if ((val / divider).toString().includes(".")) {
    //if string doesn't include '.' it is a whole value, so there's no need to reassign it
    roundingDigit = Number((val / divider).toString().split(".")[1][1]);
  }
  return roundingDigit >= 5
    ? Math.ceil(Number((val / divider).toString()) * 10) / 10
    : val / divider;
};

export const roundUp = (num: any) => {
  const rounded = Math.round(num * 10) / 10;
  return rounded.toFixed(1);
};

export const rangeValues = (raw: any) => {
  if (raw === null || raw === undefined || isNaN(raw)) {
    return "";
  }
  return raw.toLocaleString("en-US");
};

export const singularGeographyText = (
  divisionType?: DivisionTypes,
  t?: TFunction
) => {
  if (!divisionType) {
    return "";
  }
  switch (divisionType) {
    case DivisionTypes.District:
      return t!("District");
    case DivisionTypes.Village:
      return t!("Village");
    case DivisionTypes.Parlimentary_Constituencies:
      return t!("Parliamentary Constituency");
    case DivisionTypes.Assembly_Constituencies:
      return t!("Assembly Constituency");
    default:
      return "";
  }
};
