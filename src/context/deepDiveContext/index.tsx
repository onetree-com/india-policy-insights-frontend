import { createContext, Dispatch, FC, ReactNode, useReducer } from "react";
import { indicator, indicatorCategory } from "models/indicator";
import { loadIndicatorsCategory } from "utils/loadEntities";
import { division } from "models/divisions";

export const DeepDiveContext = createContext<ContextInterface | undefined>(
  undefined
);

export interface ContextInterface {
  state: {
    dataView: "2021" | "2016 - 2021";
    selectedDivision: { district: division; village: division };
    allIndicators: indicatorCategory[];
    selectedIndicators: indicatorCategory[];
  };
  dispatch: Dispatch<{ type: DeepDiveActionType; payload: any }>;
}

export enum DeepDiveActionType {
  UPDATE_DATAVIEW = "UPDATE_DATAVIEW",
  SELECT_VILLAGE = "SELECT_VILLAGE",
  SET_ALL_INDICATORS = "SET_ALL_INDICATORS",
  BULK_UPDATE_INDICATOR_CATEGORY = "BULK_UPDATE_INDICATOR_CATEGORY",
  SELECT_INDICATOR = "SELECT_INDICATOR",
  DESELECT_INDICATOR = "DESELECT_INDICATOR",
  DESELECT_ALL_INDICATORS = "DESELECT_ALL_INDICATORS",
  LOAD_SELECTED_INDICATORS = "LOAD_SELECTED_INDICATORS",
  SELECT_ALL_INDICATORS = "SELECT_ALL_INDICATORS",
}

const DeepDiveReducer = (
  state: {
    dataView: "2021" | "2016 - 2021";
    selectedDivision: { district: division; village: division };
    allIndicators: indicatorCategory[];
    selectedIndicators: indicatorCategory[];
  },
  action: { type: DeepDiveActionType; payload: any }
) => {
  switch (action.type) {
    case DeepDiveActionType.UPDATE_DATAVIEW:
      return { ...state, dataView: action.payload };
    case DeepDiveActionType.SELECT_VILLAGE:
      return {
        ...state,
        selectedDivision: {
          district: action.payload.district,
          village: action.payload.village,
        },
      };
    case DeepDiveActionType.SET_ALL_INDICATORS:
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
      let sortedSelectedIndicators: indicatorCategory[] = [];
      if (state.selectedIndicators && state.selectedIndicators.length !== 0) {
        const newInds = [...state.selectedIndicators];
        let flatSelectedIndicators: any = {};
        for (const selected of newInds) {
          for (const ind of selected.indicators) {
            if (ind.indId && !ind.deleted) {
              flatSelectedIndicators[ind.indId] = ind;
            }
          }
        }

        state.selectedIndicators.forEach((category: indicatorCategory) => {
          const selCategory = sortedIndicators.find((sortedInd) => {
            return sortedInd.catId === category.catId;
          });
          sortedSelectedIndicators.push({
            ...selCategory,
            indicators: selCategory.indicators.map((ind: indicator) => {
              return {
                ...ind,
                deleted: flatSelectedIndicators[ind.indId!] ? false : true,
              };
            }),
          });
        });
      } else {
        sortedSelectedIndicators = [...sortedIndicators];
      }

      return {
        ...state,
        allIndicators: sortedIndicators,
        selectedIndicators: sortedSelectedIndicators,
      };
    case DeepDiveActionType.BULK_UPDATE_INDICATOR_CATEGORY:
      const newInds = [...action.payload];

      let flatSelectedIndicators: any = {};
      for (const selected of newInds) {
        for (const ind of selected.indicators) {
          if (ind.indId) {
            flatSelectedIndicators[ind.indId] = ind;
          }
        }
      }

      const merged = state.selectedIndicators.map((ind: indicatorCategory) => {
        const newIndicators: indicator[] = ind.indicators.map((i) => {
          if (i.indId && flatSelectedIndicators[i.indId]) {
            i = { deleted: i.deleted, ...flatSelectedIndicators[i.indId] };
          }
          return i;
        });
        ind.indicators = newIndicators;
        return ind;
      });
      return {
        ...state,
        selectedIndicators: merged,
      };
    case DeepDiveActionType.SELECT_INDICATOR:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.map((value) => {
          if (value.catId !== action.payload.catId) {
            return value;
          } else {
            return {
              ...value,
              indicators: value.indicators.map((item) => {
                return item.indId === action.payload.indicator.indId
                  ? { ...item, deleted: false }
                  : { ...item };
              }),
            };
          }
        }),
      };
    case DeepDiveActionType.DESELECT_INDICATOR:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.map((value) => {
          if (value.catId !== action.payload.catId) {
            return value;
          } else {
            return {
              ...value,
              indicators: value.indicators.map((value) => {
                return value.indId === action.payload.indicator.indId
                  ? { ...value, deleted: true }
                  : { ...value };
              }),
            };
          }
        }),
      };

    case DeepDiveActionType.DESELECT_ALL_INDICATORS:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.map((indCategory) => {
          return {
            ...indCategory,
            indicators: indCategory.indicators.map((indicator) => {
              return { ...indicator, deleted: true };
            }),
          };
        }),
      };
    case DeepDiveActionType.SELECT_ALL_INDICATORS:
      return {
        ...state,
        selectedIndicators: state.selectedIndicators.map((indCategory) => {
          return {
            ...indCategory,
            indicators: indCategory.indicators.map((indicator) => {
              return { ...indicator, deleted: false };
            }),
          };
        }),
      };
    case DeepDiveActionType.LOAD_SELECTED_INDICATORS:
      if (state.allIndicators.length === 0) {
        return state;
      }
      const indicators = loadIndicatorsCategory(
        state.allIndicators,
        action.payload
      );

      return { ...state, selectedIndicators: indicators };
    default:
      return state;
  }
};

const DeepDiveProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(
    DeepDiveReducer as React.ReducerWithoutAction<any>,
    {
      dataView: "2021",
      allIndicators: [],
      selectedIndicators: [],
    }
  );
  return (
    <DeepDiveContext.Provider value={{ state, dispatch }}>
      {children}
    </DeepDiveContext.Provider>
  );
};

export default DeepDiveProvider;
