export const roundPrevalence = (prevalence: number | undefined): number => {
  if (!prevalence) return 0;

  const parsedPrev = prevalence.toString();
  return Number(parsedPrev.charAt(parsedPrev.length - 1)) >= 5
    ? Math.ceil(prevalence * 10) / 10
    : parseFloat(prevalence.toFixed(1));
};

export const roundHeadcount = (headcount: number | undefined) => {
  if (!headcount) return 0;
  return Math.floor((headcount * 10) % 1) >= 5
    ? (Math.ceil(headcount * 10) / 10).toLocaleString("en-US")
    : parseFloat(headcount.toFixed(0)).toLocaleString("en-US");
};
