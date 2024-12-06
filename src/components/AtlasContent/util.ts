export function maxMinAvg(arr: any, key: string) {
  if (!arr || arr.length === 0) return { median: 0, max: 0, min: 0 };
  const parsedArray = arr.filter((item: any) => {
    if (item[key] === undefined) {
      return false;
    } else {
      return true;
    }
  });

  const sortedArr = parsedArray.sort((a: any, b: any) => {
    return a[key] < b[key] ? -1 : 1;
  });
  let median;

  const halfLength = sortedArr.length / 2;
  if (sortedArr.length % 2 === 0) {
    median = (sortedArr[halfLength][key] + sortedArr[halfLength - 1][key]) / 2;
  } else {
    median = sortedArr[Math.floor(halfLength)][key];
  }

  return {
    median,
    min: sortedArr[0][key],
    max: sortedArr[sortedArr.length - 1][key],
  };
}

export function getSelectedDivisionsData(
  selectedDivisions: any,
  divisionsData: any
) {
  const selectedDivisionsIds: any = {};
  selectedDivisions.forEach((division: any) => {
    selectedDivisionsIds[division.id] = true;
  });
  const nSelectedDivisions = Object.values(selectedDivisionsIds).length !== 0;
  const selectedDivisionsData = divisionsData.filter((division: any) => {
    if (nSelectedDivisions) {
      return selectedDivisionsIds[division.id];
    } else {
      return true;
    }
  });
  return selectedDivisionsData;
}
