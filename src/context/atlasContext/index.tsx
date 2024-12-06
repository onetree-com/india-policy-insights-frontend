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

export const AtlasContext = createContext<AtlasContextInterface | undefined>(
  undefined
);

export interface AtlasContextInterface {
  atlasState: {
    selectedIndicator?: indicator;
    selectedDistrictMap?: DistrictSelectedMap;
    selectedDistrictMapChanges?: DistrictSelectedMapChanges;
    selectedVillageMap?: DistrictSelectedMap;
    selectedDivisions: Array<division>;
    indicatorDeciles?: indicatorDeciles;
    selectedDeciles: Array<number>;
    selectedDecilesChanges?: Array<string>;
    divisionsMeasurements: Array<DivisionMeasurement>;
    allDivisionsMeasurements: Array<DivisionMeasurement>;
    isMapLoaded: boolean;
    mapNotAvailable: boolean;
    dataView: {
      year: number;
      yearEnd?: number;
    };
    selectAspirationalDistricts: boolean;
    indicatorChanges?: Array<indicatorChanges>;
    indicatorChangesExtraValue?: Array<indicatorChanges>;
    divisionsMeasurementsChanges?: Array<DivisionMeasurementChanges>;
    selectedIndicatorsData: {
      median: number;
      max: number;
      min: number;
      headcountMax: number;
      headcountMedian: number;
      headcountMin: number;
    };
    allDistrictVillages: Array<division>;
  };
  atlasDispatch: Dispatch<{ type: AtlasActionType; payload: any }>;
}

export enum AtlasActionType {
  SELECT_INDICATOR = "SELECT_INDICATOR",
  SELECT_DIVISIONS = "SELECT_DIVISIONS",
  SET_INDICATOR_DECILES = "SET_INDICATOR_DECILES",
  SELECT_DECILES = "SELECT_DECILES",
  SELECT_DECILES_CHANGES = "SELECT_DECILES_CHANGES",
  SET_DIVISIONS_MEASUREMENTS = "SET_DIVISIONS_MEASUREMENTS",
  SET_ALL_DIVISIONS_MEASUREMENTS = "SET_ALL_DIVISIONS_MEASUREMENTS",
  SET_DATA_VIEW = "SET_DATA_VIEW",
  SELECT_ASPIRATIONAL_DISTRICTS = "SELECT_ASPIRATIONAL_DISTRICTS",
  SELECTED_DISTRICT_MAP = "SELECTED_DISTRICT_MAP",
  SELECTED_DISTRICT_MAP_CHANGES = "SELECTED_DISTRICT_MAP_CHANGES",
  SET_IS_MAP_LOADED = "SET_IS_MAP_LOADED",
  SET_MAP_NOT_AVAILABLE = "SET_MAP_NOT_AVAILABLE",
  SELECTED_VILLAGE_MAP = "SELECTED_VILLAGE_MAP",
  SET_INDICATOR_CHANGES = "SET_INDICATOR_CHANGES",
  SET_DIVISIONS_MEASUREMENTS_CHANGES = "SET_DIVISIONS_MEASUREMENTS_CHANGES",
  LOAD_DIVISIONS = "LOAD_DIVISIONS",
  SET_SELECTED_INDICATORS_DATA = "SET_SELECTED_INDICATORS_DATA",
  SET_INDICATOR_CHANGES_EXTRA_VALUE = "SET_INDICATOR_CHANGES_EXTRA_VALUE",
  SET_ALL_DISTRICT_VILLAGES = "SET_ALL_DISTRICT_VILLAGES",
}

const AtlasReducer = (
  state: AtlasContextInterface["atlasState"],
  action: Unpacked<Parameters<AtlasContextInterface["atlasDispatch"]>>
): AtlasContextInterface["atlasState"] => {
  switch (action.type) {
    case AtlasActionType.SELECT_INDICATOR:
      return {
        ...state,
        selectedIndicator: action.payload,
      };
    case AtlasActionType.SELECT_DIVISIONS:
      return {
        ...state,
        selectedDivisions: action.payload,
      };
    case AtlasActionType.SET_INDICATOR_DECILES:
      return {
        ...state,
        indicatorDeciles: action.payload,
      };
    case AtlasActionType.SELECT_DECILES:
      return {
        ...state,
        selectedDeciles: action.payload,
      };
    case AtlasActionType.SELECT_DECILES_CHANGES:
      return {
        ...state,
        selectedDecilesChanges: action.payload,
      };
    case AtlasActionType.SET_ALL_DIVISIONS_MEASUREMENTS:
      return {
        ...state,
        allDivisionsMeasurements: action.payload,
      };
    case AtlasActionType.SET_DIVISIONS_MEASUREMENTS:
      return {
        ...state,
        divisionsMeasurements: action.payload,
      };
    case AtlasActionType.SET_DATA_VIEW:
      return {
        ...state,
        dataView: action.payload,
      };
    case AtlasActionType.SELECT_ASPIRATIONAL_DISTRICTS:
      return {
        ...state,
        selectAspirationalDistricts: action.payload,
      };
    case AtlasActionType.SELECTED_DISTRICT_MAP:
      return {
        ...state,
        selectedDistrictMap: action.payload,
      };
    case AtlasActionType.SET_IS_MAP_LOADED:
      return {
        ...state,
        isMapLoaded: action.payload,
      };
    case AtlasActionType.SELECTED_VILLAGE_MAP:
      return {
        ...state,
        selectedVillageMap: action.payload,
      };
    case AtlasActionType.SELECTED_DISTRICT_MAP_CHANGES:
      return {
        ...state,
        selectedDistrictMapChanges: action.payload,
      };
    case AtlasActionType.SET_INDICATOR_CHANGES:
      return {
        ...state,
        indicatorChanges: action.payload,
      };
    case AtlasActionType.SET_INDICATOR_CHANGES_EXTRA_VALUE:
      return {
        ...state,
        indicatorChangesExtraValue: action.payload,
      };
    case AtlasActionType.SET_DIVISIONS_MEASUREMENTS_CHANGES:
      return {
        ...state,
        divisionsMeasurementsChanges: action.payload,
      };
    case AtlasActionType.LOAD_DIVISIONS:
      if (action.payload.allDivisions.length === 0) {
        return state;
      }
      const divisions = loadSubregions(
        action.payload.allDivisions,
        action.payload.ids
      );
      return { ...state, selectedDivisions: divisions };
    case AtlasActionType.SET_SELECTED_INDICATORS_DATA:
      return {
        ...state,
        selectedIndicatorsData: action.payload,
      };
    case AtlasActionType.SET_ALL_DISTRICT_VILLAGES:
      return {
        ...state,
        selectedDivisions: action.payload[0].subregions,
        allDistrictVillages: action.payload[0].subregions,
      };
    case AtlasActionType.SET_MAP_NOT_AVAILABLE:
      return { ...state, mapNotAvailable: action.payload };
    default:
      return state;
  }
};

const AtlasProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { globalState } = useContext(GlobalContext)!;

  const [state, dispatch] = useReducer(
    AtlasReducer as React.ReducerWithoutAction<
      AtlasContextInterface["atlasState"]
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
      mapNotAvailable: false,
      dataView: {
        year: 2021,
        yearEnd: 0,
      },
      selectAspirationalDistricts: false,
      isMapLoaded: false,
      selectedIndicatorsData: {
        median: 0,
        max: 0,
        min: 0,
        headcountMax: 0,
        headcountMedian: 0,
        headcountMin: 0,
      },
      allDistrictVillages: [],
    }
  );
  return (
    <AtlasContext.Provider
      value={{ atlasState: state, atlasDispatch: dispatch }}>
      {children}
    </AtlasContext.Provider>
  );
};

export default AtlasProvider;
