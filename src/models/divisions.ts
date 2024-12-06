export interface ParentChildren {
  id: number;
  geoId: string;
  name: string;
  nameEn: string;
  abbreviation: string;
  subregions: division[];
  nameHi?: string;
  isVillages?: boolean;
  parentId?: number;
  parentName?: string;
}
export interface division {
  parentId?: number;
  parentName?: string;
  id: number;
  geoId: string;
  name: string;
  nameEn: string;
  aspirational?: boolean;
}

export interface ParentDivision {
  parent: { id: number; name: string; abbreviation: string };
  division: division;
}

export enum RegionTypes {
  "Districts" = 2,
  "Parliamentary Constituencies" = 3,
  "Assembly Constituencies" = 4,
  "Villages" = 5,
  "AllIndia" = 6,
}

export interface DivisionMeasurement {
  id: number;
  prevalence: number;
  prevalenceEnd: number;
  prevalenceColor: string;
  headcountColor: string;
  prevalenceDecile: number;
  headcountDecile: number;
  name: string;
  stateName: string;
  stateAbbreviation: string;
  headcount: number;
  headcountRank: number;
  prevalenceRank: number;
  geoId: string;
  prevalenceChange?: number;
  prevalenceChangeRank?: number;
}

export interface DivisionMeasurementChanges {
  changeCutoffs: number;
  changeDescription: string;
  changeHex: string;
  changeId: number;
  decile: number;
  headcount: number;
  indId: number;
  indName: number;
  indReadingStrategy: number;
  prevalence: number;
  prevalenceEnd: number;
  prevalenceChange: number;
  regionId: number;
  year: number;
  yearEnd: number;
  geoId: string;
  name: string;
  stateName: string;
  stateAbbreviation: string;
}

export type DivisionKey =
  | "VILLAGES"
  | "DISTRICTS"
  | "ASSEMBLY_CONSTITUENCIES"
  | "PARLIMENTARY_CONSTITUENCIES";

type DivisionType = {
  readonly label: string;
  readonly route: string;
};

const DivisionList: { [key in DivisionKey]: DivisionType } = {
  VILLAGES: {
    label: "Villages",
    route: "villages",
  },
  DISTRICTS: {
    label: "Districts",
    route: "districts",
  },
  ASSEMBLY_CONSTITUENCIES: {
    label: "Assembly Constituencies",
    route: "assembly-constituencies",
  },
  PARLIMENTARY_CONSTITUENCIES: {
    label: "Parliamentary Constituencies",
    route: "parliamentary-constituencies",
  },
};

export default DivisionList;
