export enum Features {
  ATLAS = "Atlas",
  RANKING = "Ranking",
  DEEP_DIVE = "Deep Dive",
  COMPARE = "Compare",
  CREATE_REPORT = "Create Report",
}

export type FeatureKey =
  | "ATLAS"
  | "RANKING"
  | "DEEP_DIVE"
  | "COMPARE"
  | "CREATE_REPORT";
export enum FeatureKeyRoute {
  ATLAS = "ATLAS",
  RANKING = "RANKING",
  DEEP_DIVE = "DEEP_DIVE",
  COMPARE = "COMPARE",
  CREATE_REPORT = "CREATE_REPORT",
}

type FeatureType = {
  readonly label: string;
  readonly route: string;
};

const FeatureList: { [key in FeatureKey]: FeatureType } = {
  ATLAS: {
    label: "Atlas",
    route: "atlas",
  },
  RANKING: {
    label: "Ranking",
    route: "ranking",
  },
  DEEP_DIVE: {
    label: "Deep Dive",
    route: "deep-dive",
  },
  COMPARE: {
    label: "Compare",
    route: "compare",
  },
  CREATE_REPORT: {
    label: "Create Report",
    route: "create-report",
  },
};

export default FeatureList;
