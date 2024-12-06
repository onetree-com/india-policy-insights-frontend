import { DivisionTypes } from "context/globalContext";
import { readingStrategy } from "models/indicator";

enum ChangeColors {
  SigImproved = "#2E7265",
  Improved = "#6D9F95",
  Worsened = "#E87D7F",
  SigWorsened = "#DF4649",
}

//colors ranked from 1-5 where 1 is the strongest color and 5 the lightest color
enum CurrentColors {
  Better1 = "#086192",
  Better2 = "#008DD2",
  Better3 = "#44A3DB",
  Better4 = "#8BC4F2",
  Better5 = "#ABC4CC",
  Worse1 = "#E31E24",
  Worse2 = "#E94E3A",
  Worse3 = "#EE7A62",
  Worse4 = "#F4A294",
  Worse5 = "#CCB1B1",
}

enum CurrentColorsVillages {
  Better1 = "#086192",
  Better2 = "#8BC4F2",
  Neutral = "#C5B3B8",
  Worse2 = "#EB7F69",
  Worse1 = "#E31E24",
}

export const calculateChangeColor = (
  value: number,
  valueEnd: number,
  type: readingStrategy,
  dataView: "2021" | "2016 - 2021",
  divisionType: string
): string => {
  if (dataView === "2016 - 2021") {
    if (value > valueEnd) {
      switch (true) {
        case value - valueEnd >= 50:
          return type === readingStrategy.LowerIsBetter
            ? ChangeColors.SigImproved
            : ChangeColors.SigWorsened;
        default:
          return type === readingStrategy.LowerIsBetter
            ? ChangeColors.Improved
            : ChangeColors.Worsened;
      }
    } else {
      switch (true) {
        case valueEnd - value >= 50:
          return type === readingStrategy.LowerIsBetter
            ? ChangeColors.SigWorsened
            : ChangeColors.SigImproved;

        default:
          return type === readingStrategy.LowerIsBetter
            ? ChangeColors.Worsened
            : ChangeColors.Improved;
      }
    }
  } else {
    if (divisionType === (DivisionTypes.Village as string)) {
      switch (true) {
        case value === 0:
          return "#3D4247";
        case value > 0 && value <= 20:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColorsVillages.Better1
            : CurrentColorsVillages.Worse1;
        case value > 20 && value <= 40:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColorsVillages.Better2
            : CurrentColorsVillages.Worse2;
        case value > 40 && value <= 60:
          return CurrentColorsVillages.Neutral;
        case value > 60 && value <= 80:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColorsVillages.Worse2
            : CurrentColorsVillages.Better2;
        default:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColorsVillages.Worse1
            : CurrentColorsVillages.Better1;
      }
    } else {
      switch (true) {
        case value === 0:
          return "#3D4247";
        case value > 0 && value <= 10:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Better1
            : CurrentColors.Worse1;
        case value > 10 && value <= 20:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Better2
            : CurrentColors.Worse2;
        case value > 20 && value <= 30:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Better3
            : CurrentColors.Worse3;
        case value > 30 && value <= 40:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Better4
            : CurrentColors.Worse4;
        case value > 40 && value <= 50:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Better5
            : CurrentColors.Worse5;
        case value > 50 && value <= 60:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Worse5
            : CurrentColors.Better5;
        case value > 60 && value <= 70:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Worse4
            : CurrentColors.Better4;
        case value > 70 && value <= 80:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Worse3
            : CurrentColors.Better3;
        case value > 80 && value <= 90:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Worse2
            : CurrentColors.Better2;
        default:
          return type === readingStrategy.LowerIsBetter
            ? CurrentColors.Worse1
            : CurrentColors.Better1;
      }
    }
  }
};
