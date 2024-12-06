export interface DistrictSelectedMap {
  max: number;
  maxEnd: number;
  median: number;
  medianEnd: number;
  min: number;
  minEnd: number;
  headcount: number;
  prevalence: number;
  name: string;
  stateAbbreviation: string;
  regionId: number;
  noData: boolean;
}

export interface DistrictSelectedMapChanges {
  prevalence: number;
  prevalenceChange: number;
  prevalenceEnd: number;
  changeHex: string;
  regionId: number;
}
