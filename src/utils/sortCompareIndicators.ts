import { indicator } from "models/indicator";
export const sortCompareIndicators = (
  selectedIndicators: indicator[],
  row: string,
  ascending: boolean,
  dataview?: "2021" | "2016 - 2021"
) => {
  const indicatorsWithData: indicator[] = [];
  const indicatorsWithoutData: indicator[] = [];

  selectedIndicators.forEach((element) => {
    if (dataview === "2021" || dataview === undefined) {
      if (element[`row${row}` as keyof indicator]?.prevalence === undefined) {
        indicatorsWithoutData.push({ ...element });
      } else {
        indicatorsWithData.push({ ...element });
      }
    } else {
      if (
        element[`row${row}` as keyof indicator]?.higherValue === undefined ||
        element[`row${row}` as keyof indicator]?.lowerValue === undefined
      ) {
        indicatorsWithoutData.push({ ...element });
      } else {
        indicatorsWithData.push({ ...element });
      }
    }
  });
  const sortedIndicators = indicatorsWithData.sort((a, b) => {
    if (dataview === "2021" || dataview === undefined) {
      if (ascending) {
        return (
          a[`row${row}` as keyof indicator].prevalence -
          b[`row${row}` as keyof indicator].prevalence
        );
      } else {
        return (
          b[`row${row}` as keyof indicator].prevalence -
          a[`row${row}` as keyof indicator].prevalence
        );
      }
    } else {
      if (ascending) {
        return (
          a[`row${row}` as keyof indicator].higherValue -
          a[`row${row}` as keyof indicator].lowerValue -
          (b[`row${row}` as keyof indicator].higherValue -
            b[`row${row}` as keyof indicator].lowerValue)
        );
      } else {
        return (
          b[`row${row}` as keyof indicator].higherValue -
          b[`row${row}` as keyof indicator].lowerValue -
          (a[`row${row}` as keyof indicator].higherValue -
            a[`row${row}` as keyof indicator].lowerValue)
        );
      }
    }
  });
  return [...sortedIndicators, ...indicatorsWithoutData];
};
