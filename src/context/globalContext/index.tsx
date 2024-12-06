import { division, DivisionKey, ParentChildren } from "models/divisions";
import { FeatureKey, FeatureKeyRoute } from "models/features";
import { indicator, indicatorCategory } from "models/indicator";
import { createContext, Dispatch, FC, ReactNode, useReducer } from "react";
import { sortAlphabetically } from "utils/list-utility";
import { loadDivision } from "utils/loadEntities";

export const GlobalContext = createContext<GlobalContextInterface | undefined>(
  undefined
);

export type GlobalNavigationType = {
  feature: FeatureKey;
  division: DivisionKey;
  exclude?: Set<FeatureKey>;
};

export type RankingToCompareType = {
  division: division;
  indicator: indicator;
};

export interface GlobalContextInterface {
  globalState: {
    navigation: GlobalNavigationType;
    selectedDivision?: Geography;
    allDivisions: ParentChildren[];
    divisionType: DivisionTypes;
    indicators: Array<indicatorCategory>;
    selectedMetric: "prevalence" | "headcount";
    rankingToCompareInfo?: RankingToCompareType | undefined;
    rankingToDeepDiveDivision?: division;
    modalOpen?: boolean;
    fromLink?: boolean;
    resetMapZoom?: boolean;
    loading?: boolean;
  };
  globalDispatch: Dispatch<{ type: GlobalActionType; payload: any }>;
}

export enum GlobalActionType {
  SET_NAVIGATION = "SET_NAVIGATION",
  SELECT_DIVISION = "SELECT_DIVISION",
  SET_ALL_DIVISIONS = "SET_ALL_DIVISIONS",
  SET_DIVISION_TYPE = "SET_DIVISION_TYPE",
  SET_ALL_INDICATORS = "SET_ALL_INDICATORS",
  SELECT_METRIC = "SELECT_METRIC",
  RANKING_TO_COMPARE_INFO = "RANKING_TO_COMPARE_INFO",
  RANKING_TO_DEEP_DIVE_DIVISION = "RANKING_TO_DEEP_DIVE_DIVISION",
  SET_MODAL = "SET_MODAL",
  LOAD_SELECTED_DIVISION = "LOAD_SELECTED_DIVISION",
  RESET_MAP_ZOOM = "RESET_MAP_ZOOM",
  RESET_DIVISION = "RESET_DIVISION",
  SHOW_LOADING_SCREEN = "SHOW_LOADING_SCREEN",
  HIDE_LOADING_SCREEN = "HIDE_LOADING_SCREEN",
  LOAD_DISTRICT_VILLAGES = "LOAD_DISTRICT_VILLAGES",
  SET_FROM_LINK = "SET_FROM_LINK",
}

export enum DivisionTypes {
  District = "Districts",
  Village = "Villages",
  Assembly_Constituencies = "Assembly Constituencies",
  Parlimentary_Constituencies = "Parliamentary Constituencies",
}

export type Geography = {
  stateId?: number;
  state: division;
  stateAbbreviation?: string;
  division: division;
  village?: division;
};
const GlobalReducer = (
  state: {
    navigation: GlobalNavigationType;
    selectedDivision?: Geography;
    allDivisions: ParentChildren[];
    divisionType?: DivisionTypes;
    indicators: Array<indicator>;
  },
  action: { type: GlobalActionType; payload: any }
) => {
  switch (action.type) {
    case GlobalActionType.SELECT_DIVISION:
      return {
        ...state,
        selectedDivision: {
          stateId: action.payload.parent.id,
          state: action.payload.parent,
          division: action.payload.division,
          stateAbbreviation: action.payload.parent.abbreviation,
        },
      };
    case GlobalActionType.SET_ALL_DIVISIONS:
      if (state.divisionType !== DivisionTypes.Village) {
        return {
          ...state,
          allDivisions: Array.isArray(action.payload) ? action.payload : [],
        };
      } else {
        if (
          state.navigation.feature === FeatureKeyRoute.COMPARE ||
          state.navigation.feature === FeatureKeyRoute.DEEP_DIVE ||
          state.navigation.feature === FeatureKeyRoute.CREATE_REPORT
        ) {
          // set allDivisions as districts, so then the subregions will be villages
          if (!Array.isArray(action.payload)) return;
          const allDistricts = action.payload
            .flatMap((x: ParentChildren) =>
              x.subregions.map((subreg) => {
                return { ...subreg, parentId: x.id, parentName: x.name };
              })
            )
            .map((s: division) => {
              return {
                parentId: s.parentId,
                parentName: s.parentName,
                id: s.id,
                name: s.name,
                subregions: [],
              };
            });
          const sortedList = sortAlphabetically(allDistricts);
          return {
            ...state,
            allDivisions: sortedList,
          };
        }
        let selectedDivision;
        if (!state?.selectedDivision?.division) {
          selectedDivision = {
            state: {
              id: action.payload[0]?.id,
              geoId: action.payload[0]?.geoId,
              name: action.payload[0]?.name,
            },
            stateAbbreviation: action.payload[0]?.abbreviation,
            division: action.payload[0]?.subregions[0],
          };
        } else {
          const stateData = action.payload.find((st: any) => {
            return st.id === state.selectedDivision?.state.id;
          });
          selectedDivision = {
            state: {
              id: stateData.id,
              geoId: stateData.geoId,
              name: stateData.name,
            },
            stateAbbreviation: stateData.abbreviation,
            division: {
              ...stateData.subregions.find((region: any) => {
                return region.id === state.selectedDivision?.division.id;
              }),
            },
          };
        }
        return {
          ...state,
          allDivisions: Array.isArray(action.payload) ? action.payload : [],
          selectedDivision: selectedDivision,
        };
      }
    case GlobalActionType.SET_DIVISION_TYPE:
      if (state.divisionType === undefined) {
        return { ...state, divisionType: action.payload };
      } else {
        return { ...state };
      }

    case GlobalActionType.SET_ALL_INDICATORS:
      return {
        ...state,
        indicators: Array.isArray(action.payload) ? action.payload : [],
      };
    case GlobalActionType.SELECT_METRIC:
      return {
        ...state,
        selectedMetric: action.payload,
      };
    case GlobalActionType.RANKING_TO_COMPARE_INFO:
      return {
        ...state,
        rankingToCompareInfo: action.payload,
      };
    case GlobalActionType.RANKING_TO_DEEP_DIVE_DIVISION:
      return {
        ...state,
        rankingToDeepDiveDivision: action.payload,
      };
    case GlobalActionType.SET_NAVIGATION:
      return {
        ...state,
        navigation: action.payload,
      };
    case GlobalActionType.SET_MODAL:
      return {
        ...state,
        modalOpen: action.payload,
      };
    case GlobalActionType.SET_FROM_LINK:
      return { ...state, fromLink: true };
    case GlobalActionType.LOAD_SELECTED_DIVISION:
      if (state.allDivisions.length === 0) {
        return state;
      }
      const subregionId = parseInt(action.payload);
      const division = loadDivision(state.allDivisions, subregionId);
      return {
        ...state,
        selectedDivision: {
          stateId: division.parent.id,
          state: division.parent,
          division: division.division,
        },
      };
    case GlobalActionType.RESET_MAP_ZOOM:
      return { ...state, resetMapZoom: action.payload };
    case GlobalActionType.RESET_DIVISION:
      return {
        ...state,
        selectedDivision: {},
        rankingToDeepDiveDivision: undefined,
      };
    case GlobalActionType.SHOW_LOADING_SCREEN:
      return {
        ...state,
        loading: true,
      };
    case GlobalActionType.HIDE_LOADING_SCREEN:
      return {
        ...state,
        loading: false,
      };

    case GlobalActionType.LOAD_DISTRICT_VILLAGES:
      const index = state.allDivisions.findIndex(
        (a) => a.id === action.payload.districtId
      );
      if (index >= 0) {
        const sortedList = sortAlphabetically(
          action.payload.data[0].subregions
        );
        return {
          ...state,
          allDivisions: [
            ...state.allDivisions.slice(0, index),
            {
              ...state.allDivisions[index],
              isVillages: action.payload.isVillages,
              subregions: sortedList,
            },
            ...state.allDivisions.slice(index + 1),
          ],
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    GlobalReducer as React.ReducerWithoutAction<any>,
    {
      divisionType: undefined,
      navigation: {},
      selectedDivision: undefined,
      allDivisions: [],
      selectedMetric: "prevalence",
      modalOpen: false,
      loading: false,
    }
  );
  return (
    <GlobalContext.Provider
      value={{ globalState: state, globalDispatch: dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
