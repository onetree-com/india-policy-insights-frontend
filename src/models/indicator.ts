export interface indicatorCategory {
  catId: number;
  catName: string;
  catNameHi?: string;
  indicators: indicator[];
}

export enum readingStrategy {
  HigherIsBetter = 1,
  LowerIsBetter = 2,
  Neutral = 0,
}
export interface indicator {
  deleted?: boolean;
  value: any;
  row2: any;
  row3: any;
  row4: any;
  row1: any;
  catId?: number;
  catName?: string;
  catNameHi?: string;
  indId?: number;
  indName?: string;
  indNameEn?: string;
  indNameHi?: string;
  indSourceId?: number;
  indDefinition?: string;
  indDescription?: string;
  indDescriptionHi?: string;
  indReadingStrategy?: readingStrategy;
  indExternalId?: number;
  year?: number;
  yearEnd?: number;
  metric?: 1 | 2 | 3;
  prevalence?: number;
  prevalenceEnd?: number;
  prevalenceRank?: number;
  prevalenceColor: string;
  lowerValue?: number;
  higherValue?: number;
  headcount?: number;
  headcountRank?: number;
  indTypedId?: number;
  allIndia?: number;
  stateValue?: number;
  deepDiveCompareColor?: string;
  description?: string;
  changeColor?: string;
}

export interface indicatorMeasuarement {
  decile: number;
  headcount: number;
  headcountColor: string;
  indId: number;
  indName: string;
  indReadingStrategy: number;
  prevalence: number;
  prevalenceColor: string;
  regionId: number;
  year: number;
  yearEnd: number;
  deepDiveCompareColor?: string;
}

export interface indicatorDeciles {
  indId: number;
  indName: string;
  year: number;
  prevalenceHx: Array<string>;
  prevalenceCutoffs: Array<number>;
  headcountHx: Array<string>;
  headcountCutoffs: Array<number>;
  deciles: Array<number>;
}

export interface indicatorChanges {
  changeDescription: string;
  changeHex: string;
  indicatorId: number;
  indicatorName: string;
  prevalenceChangeCutoffs: number;
  prevalenceChangeId: number;
}

export interface IndicatorsBetterThan {
  betterThanAverage: number;
  totalIndicators: number;
}

export interface ImprovementRanking {
  ranking: number;
  sharedBy: number;
}

export interface IndicatorsAmountPerChange {
  prevalenceChangeCategory: number;
  indicatorCount: number;
}

export interface TopIndicatorsChange {
  indicator: string;
}

export interface IndicatorsPerDecile {
  prevDecile: number;
  count: number;
}

export interface TableOfIndicators {
  catId: number;
  catName: string;
  catNameHi: string;
  indicators: {
    indId: number;
    catId: number;
    catName: string;
    catNameHi: string;
    name: string;
    nameHi: string;
    goiAbv: string;
    indiaPrevalence: number;
    statePrevalence: number;
    regionPrevalence: number;
    change: number;
    prevalenceChangeCategory: number;
    prevDecile: number;
  }[];
}
