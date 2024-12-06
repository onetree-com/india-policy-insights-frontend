import { GlobalContext } from "context/globalContext";
import {
  DistrictSelectedMap,
  DistrictSelectedMapChanges,
} from "models/district-selected-map";
import {
  division,
  DivisionMeasurement,
  DivisionMeasurementChanges,
} from "models/divisions";
import {
  indicator,
  indicatorChanges,
  indicatorDeciles,
} from "models/indicator";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { getDefaultIndicator } from "utils/calculateSelectedIndicatorN";
import { loadSubregions } from "utils/loadEntities";

export const RankingContext = createContext<
  RankingContextInterface | undefined
>(undefined);

export interface RankingContextInterface {
  rankingState: {
    selectedIndicator?: indicator;
    selectedDivisions: Array<division>;
    indicatorDeciles?: indicatorDeciles;
    selectedDeciles: Array<number>;
    divisionsMeasurements: Array<DivisionMeasurement>;
    allDivisionsMeasurements: Array<DivisionMeasurement>;
    selectAspirationalDistricts: boolean;
    dataView: {
      year: number;
      yearEnd?: number;
    };
    selectedDistrictMap?: DistrictSelectedMap;
    selectedDistrictMapChanges?: DistrictSelectedMapChanges;
    divisionsMeasurementsChanges?: Array<DivisionMeasurementChanges>;
    indicatorChanges?: Array<indicatorChanges>;
    indicatorChangesExtraValue?: Array<indicatorChanges>;
    selectedDecilesChanges?: Array<string>;
    selectedRowTable: {
      id: string;
      name: string;
      fromMapToTable: boolean;
    };
    loading?: boolean;
  };
  rankingDispatch: Dispatch<{ type: RankingActionType; payload: any }>;
}

export enum RankingActionType {
  SELECT_INDICATOR = "SELECT_INDICATOR",
  SELECT_DIVISIONS = "SELECT_DIVISIONS",
  SET_INDICATOR_DECILES = "SET_INDICATOR_DECILES",
  SELECT_DECILES = "SELECT_DECILES",
  SET_DATA_VIEW = "SET_DATA_VIEW",
  SELECT_ASPIRATIONAL_DISTRICTS = "SELECT_ASPIRATIONAL_DISTRICTS",
  SET_DIVISIONS_MEASUREMENTS = "SET_DIVISIONS_MEASUREMENTS",
  SET_ALL_DIVISIONS_MEASUREMENTS = "SET_ALL_DIVISIONS_MEASUREMENTS",
  SELECTED_DISTRICT_MAP = "SELECTED_DISTRICT_MAP",
  SET_INDICATOR_CHANGES = "SET_INDICATOR_CHANGES",
  SET_DIVISIONS_MEASUREMENTS_CHANGES = "SET_DIVISIONS_MEASUREMENTS_CHANGES",
  SELECTED_DISTRICT_MAP_CHANGES = "SELECTED_DISTRICT_MAP_CHANGES",
  SELECT_DECILES_CHANGES = "SELECT_DECILES_CHANGES",
  SELECTED_ROW_TABLE = "SELECTED_ROW_TABLE",
  LOAD_DIVISIONS = "LOAD_DIVISIONS",
  SET_INDICATOR_CHANGES_EXTRA_VALUE = "SET_INDICATOR_CHANGES_EXTRA_VALUE",
}

const RankingReducer = (
  state: RankingContextInterface["rankingState"],
  action: Unpacked<Parameters<RankingContextInterface["rankingDispatch"]>>
): RankingContextInterface["rankingState"] => {
  switch (action.type) {
    case RankingActionType.SELECT_INDICATOR:
      return {
        ...state,
        selectedIndicator: action.payload,
      };
    case RankingActionType.SELECT_DIVISIONS:
      return {
        ...state,
        selectedDivisions: action.payload,
      };
    case RankingActionType.SET_INDICATOR_DECILES:
      return {
        ...state,
        indicatorDeciles: action.payload,
      };
    case RankingActionType.SELECT_ASPIRATIONAL_DISTRICTS:
      return {
        ...state,
        selectAspirationalDistricts: action.payload,
      };
    case RankingActionType.SELECT_DECILES:
      return {
        ...state,
        selectedDeciles: action.payload,
      };
    case RankingActionType.SET_ALL_DIVISIONS_MEASUREMENTS:
      return {
        ...state,
        allDivisionsMeasurements: action.payload,
      };
    case RankingActionType.SET_DIVISIONS_MEASUREMENTS:
      return {
        ...state,
        divisionsMeasurements: action.payload,
      };
    case RankingActionType.SET_DATA_VIEW:
      return {
        ...state,
        dataView: action.payload,
      };
    case RankingActionType.SELECTED_DISTRICT_MAP:
      return {
        ...state,
        selectedDistrictMap: action.payload,
      };
    case RankingActionType.SELECTED_DISTRICT_MAP_CHANGES:
      return {
        ...state,
        selectedDistrictMapChanges: action.payload,
      };
    case RankingActionType.SET_INDICATOR_CHANGES:
      return {
        ...state,
        indicatorChanges: action.payload,
      };
    case RankingActionType.SET_INDICATOR_CHANGES_EXTRA_VALUE:
      return {
        ...state,
        indicatorChangesExtraValue: action.payload,
      };
    case RankingActionType.SET_DIVISIONS_MEASUREMENTS_CHANGES:
      return {
        ...state,
        divisionsMeasurementsChanges: action.payload,
      };
    case RankingActionType.SELECT_DECILES_CHANGES:
      return {
        ...state,
        selectedDecilesChanges: action.payload,
      };
    case RankingActionType.SELECTED_ROW_TABLE:
      return {
        ...state,
        selectedRowTable: action.payload,
      };
    case RankingActionType.LOAD_DIVISIONS:
      if (action.payload.allDivisions.length === 0) {
        return state;
      }
      const divisions = loadSubregions(
        action.payload.allDivisions,
        action.payload.ids
      );
      return { ...state, selectedDivisions: divisions };
    default:
      return state;
  }
};

const RankingProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { globalState } = useContext(GlobalContext)!;
  const [state, dispatch] = useReducer(
    RankingReducer as React.ReducerWithoutAction<
      RankingContextInterface["rankingState"]
    >,
    {
      selectedIndicator:
        globalState.indicators && globalState.indicators.length > 0
          ? getDefaultIndicator(globalState.indicators)
          : undefined,
      selectedDivisions: [],
      selectedDeciles: [],
      divisionsMeasurements: [],
      allDivisionsMeasurements: [],
      dataView: {
        year: 2021,
        yearEnd: 0,
      },
      selectAspirationalDistricts: false,
      selectedRowTable: {
        id: "",
        name: "",
        fromMapToTable: false,
      },
    }
  );
  return (
    <RankingContext.Provider
      value={{ rankingState: state, rankingDispatch: dispatch }}>
      {children}
    </RankingContext.Provider>
  );
};

export default RankingProvider;
