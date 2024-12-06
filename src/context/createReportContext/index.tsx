import { createContext, Dispatch, FC, ReactNode, useReducer } from "react";
import { indicator, indicatorCategory } from "models/indicator";
import { division } from "models/divisions";

export const CreateReportContext = createContext<ContextInterface | undefined>(
  undefined
);

export interface ContextInterface {
  state: {
    dataView: "2021" | "2016 - 2021";
    allIndicators: indicatorCategory[];
    selectedIndicators: indicator[];
    selectedDivision: {
      stateId: number;
      stateName: string;
      district: division;
      village: division;
    };
    populationProfile: {
      population: number;
      density: number;
      female: number;
      male: number;
      literate: number;
    };
    mapLoaded: boolean;
  };
  dispatch: Dispatch<{ type: CreateReportActionType; payload: any }>;
}

export enum CreateReportActionType {
  UPDATE_DATAVIEW = "UPDATE_DATAVIEW",
  SELECT_INDICATOR = "SELECT_INDICATOR",
  DESELECT_INDICATOR = "DESELECT_INDICATOR",
  DESELECT_ALL_INDICATORS = "DESELECT_ALL_INDICATORS",
  UPDATE_POPULATION_PROFILE = "UPDATE_POPULATION_PROFILE",
  SELECT_VILLAGE = "SELECT_VILLAGE",
  MAP_LOADED = "MAP_LOADED",
}

const CreateReportReducer = (
  state: {
    dataView: "2021" | "2016 - 2021";
    allIndicators: indicatorCategory[];
    selectedDivision: { district: division; village: division };
    selectedIndicators: indicator[];
  },
  action: { type: CreateReportActionType; payload: any }
) => {
  switch (action.type) {
    case CreateReportActionType.UPDATE_DATAVIEW:
      return { ...state, dataView: action.payload };
    case CreateReportActionType.SELECT_VILLAGE:
      return {
        ...state,
        selectedDivision: {
          district: action.payload.district,
          village: action.payload.village,
        },
      };
    case CreateReportActionType.SELECT_INDICATOR:
      if (
        state.selectedIndicators.findIndex((indicator) => {
          return indicator.indId === action.payload.indId;
        }) === -1 &&
        state.selectedIndicators.length < 25
      ) {
        //indicator doesn't exist so will be added
        return {
          ...state,
          selectedIndicators: [...state.selectedIndicators, action.payload],
        };
      } else {
        return { ...state };
      }
    case CreateReportActionType.DESELECT_INDICATOR:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.filter((value) => {
          return value.indId !== action.payload.indId;
        }),
      };
    case CreateReportActionType.DESELECT_ALL_INDICATORS:
      return { ...state, selectedIndicators: [] };
    case CreateReportActionType.UPDATE_POPULATION_PROFILE:
      const { id, regionId, urban, ...profile } = action.payload;
      return {
        ...state,
        populationProfile: { ...profile },
      };
    case CreateReportActionType.MAP_LOADED:
      return { ...state, mapLoaded: action.payload };
    default:
      return state;
  }
};

const CreateReportProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    CreateReportReducer as React.ReducerWithoutAction<any>,
    {
      dataView: "2021",
      allIndicators: [],
      selectedIndicators: [],
      divisionType: "District",
      populationProfile: {
        districtName: "Hardoi",
        totalPop: "1,199,103",
        popDensity: "683 Persons/sq.Km",
        sexRatio: "868 females / 1000 males",
        urbanPercentage: 34,
        literatePercentage: 49,
      },
    }
  );
  return (
    <CreateReportContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateReportContext.Provider>
  );
};

export default CreateReportProvider;
