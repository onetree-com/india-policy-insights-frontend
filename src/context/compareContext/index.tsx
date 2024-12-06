import { createContext, Dispatch, FC, ReactNode, useReducer } from "react";
import { indicatorCategory, indicator } from "models/indicator";
import { division } from "models/divisions";
import { DataViews } from "models/data-view";
import { loadDivisions, loadIndicators } from "utils/loadEntities";
import { sortCompareIndicators } from "utils/sortCompareIndicators";

export const CompareContext = createContext<ContextInterface | undefined>(
  undefined
);

export interface SelectedDivisionType {
  parent: { id: number; name: string };
  division: division;
}

export interface ContextInterface {
  state: {
    dataView: DataViews;
    allIndicators: indicatorCategory[];
    selectedIndicators: indicator[];
    selectedDivisions?: SelectedDivisionType[];
  };
  dispatch: Dispatch<{ type: CompareActionType; payload: any }>;
}

export enum CompareActionType {
  UPDATE_DATAVIEW = "UPDATE_DATAVIEW",
  SET_ALL_INDICATORS = "SET_ALL_INDICATORS",
  BULK_UPDATE_INDICATORS = "BULK_UPDATE_INDICATORS",
  SELECT_INDICATOR = "SELECT_INDICATOR",
  SELECT_INDICATORS = "SELECT_INDICATORS",
  DESELECT_INDICATOR = "DESELECT_INDICATOR",
  DESELECT_ALL_INDICATORS = "DESELECT_ALL_INDICATORS",
  SORT_INDICATORS = "SORT_INDICATORS",
  SELECT_DIVISION = "SELECT_DIVISION",
  SELECT_DIVISIONS = "SELECT_DIVISIONS",
  DESELECT_DIVISION = "DESELECT_DIVISION",
  EDIT_DIVISION = "EDIT_DIVISION",
  LOAD_SELECTED_INDICATORS = "LOAD_SELECTED_INDICATORS",
  LOAD_SELECTED_DIVISIONS = "LOAD_SELECTED_DIVISIONS",
}

const CompareReducer = (
  state: {
    dataView: DataViews;
    allIndicators: indicatorCategory[];
    selectedIndicators: indicator[];
    selectedDivisions: {
      parent: { id: number; name: string };
      division: division;
    }[];
  },
  action: { type: CompareActionType; payload: any }
) => {
  switch (action.type) {
    case CompareActionType.UPDATE_DATAVIEW:
      return { ...state, dataView: action.payload };

    case CompareActionType.SELECT_DIVISION:
      if (
        state.selectedDivisions &&
        state.selectedDivisions.length !== 0 &&
        state.selectedDivisions.some((item) => {
          return item.division.id === action.payload.division.id;
        })
      ) {
        //item is selected so will be removed
        return {
          ...state,
          selectedDivisions: state.selectedDivisions.filter((item) => {
            return item.division.id !== action.payload.division.id;
          }),
        };
      } else {
        //division doesn't exist in array so will be added
        if (state.selectedDivisions.length < 4) {
          return {
            ...state,
            selectedDivisions: [
              ...state.selectedDivisions,
              {
                parent: action.payload.parent,
                division: action.payload.division,
              },
            ],
          };
        } else {
          return { ...state };
        }
      }
    case CompareActionType.SELECT_DIVISIONS:
      return {
        ...state,
        selectedDivisions: action.payload,
      };
    case CompareActionType.DESELECT_DIVISION:
      const updatedDivisions = state.selectedDivisions.filter((item) => {
        return item.division.id !== action.payload;
      });
      state.selectedIndicators.forEach((ind) => {
        delete ind.row1;
        delete ind.row2;
        delete ind.row3;
        delete ind.row4;
        return ind;
      });

      return {
        ...state,
        selectedDivisions: updatedDivisions,
      };

    case CompareActionType.EDIT_DIVISION:
      if (
        state.selectedDivisions &&
        state.selectedDivisions.length !== 0 &&
        state.selectedDivisions.some((item) => {
          return item.division.id === action.payload.item.division.id;
        })
      ) {
        return { ...state };
      } else {
        return {
          ...state,
          selectedDivisions: state.selectedDivisions.map((item, index) => {
            return index !== action.payload.index ? item : action.payload.item;
          }),
        };
      }
    case CompareActionType.SET_ALL_INDICATORS:
      const sortedIndicators = [
        ...action.payload.map((item: indicatorCategory) => {
          return {
            catId: item.catId,
            catName: item.catName,
            indicators: item.indicators.sort((a, b) => {
              return a.indId! - b.indId!;
            }),
          };
        }),
      ];
      return {
        ...state,
        allIndicators: sortedIndicators,
      };
    case CompareActionType.BULK_UPDATE_INDICATORS:
      return { ...state, selectedIndicators: action.payload };
    case CompareActionType.SELECT_INDICATOR:
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
    case CompareActionType.SELECT_INDICATORS:
      return {
        ...state,
        selectedIndicators: action.payload,
      };
    case CompareActionType.DESELECT_INDICATOR:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.filter((value) => {
          return value.indId !== action.payload.indId;
        }),
      };
    case CompareActionType.DESELECT_ALL_INDICATORS:
      return {
        ...state,
        selectedIndicators: [],
      };
    case CompareActionType.SORT_INDICATORS:
      return {
        ...state,
        selectedIndicators: sortCompareIndicators(
          state.selectedIndicators,
          action.payload.row,
          action.payload.ascending,
          state.dataView
        ),
      };
    case CompareActionType.LOAD_SELECTED_DIVISIONS:
      if (action.payload.allDivisions.length === 0) {
        return state;
      }
      const divisions = loadDivisions(
        action.payload.allDivisions,
        action.payload.ids
      );

      return { ...state, selectedDivisions: divisions };
    case CompareActionType.LOAD_SELECTED_INDICATORS:
      if (state.allIndicators.length === 0) {
        return state;
      }
      const indicators = loadIndicators(state.allIndicators, action.payload);

      return { ...state, selectedIndicators: indicators };
    default:
      return state;
  }
};

const CompareProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    CompareReducer as React.ReducerWithoutAction<any>,
    {
      dataView: undefined,
      selectedDivisions: [],
      allIndicators: [],
      selectedIndicators: [],
    }
  );
  return (
    <CompareContext.Provider value={{ state, dispatch }}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareProvider;
