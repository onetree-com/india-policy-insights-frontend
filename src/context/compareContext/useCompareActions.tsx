import { DivisionTypes, GlobalContext } from "context/globalContext";
import { DataViews } from "models/data-view";
import { indicator, indicatorCategory } from "models/indicator";
import { useContext } from "react";
import { CompareActionType, CompareContext, SelectedDivisionType } from ".";
import { getDivisions } from "api/divisions";
import { useTranslation } from "react-i18next";

export const useCompareActions = () => {
  const { dispatch } = useContext(CompareContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const updateDataview = (dataView: DataViews) => {
    dispatch({
      type: CompareActionType.UPDATE_DATAVIEW,
      payload: dataView,
    });
  };

  const loadSelectedVillages = (subregionIds: string) => {
    const divisionVillage: Record<string, any> = {};
    const parsedSubregionIds = subregionIds.split(",");
    parsedSubregionIds.forEach((element: string) => {
      const ids = element.split("-");

      if (
        !Object.entries(divisionVillage).find(([key]) => {
          return key === ids[0];
        })
      ) {
        divisionVillage[ids[0]] = [];
      }
      divisionVillage[ids[0]].push(ids[1]);
    });
    Promise.all(
      Object.entries(divisionVillage).map(([key]) => {
        return getDivisions({
          RegCount: 5000,
          RegIgnored: 0,
          RegionType: DivisionTypes.Village,
          StateId: 0,
          RegionID: Number(key),
          SubregionID: 0,
          currentLanguage,
        });
      })
    ).then((districts: any) => {
      const flatDistricts = districts.flat();
      const selectedDivisions: SelectedDivisionType[] = [];
      Object.values(divisionVillage).forEach((villages, index) => {
        villages.forEach((village: string) => {
          const subregion = flatDistricts[index].subregions.find(
            (subregion: any) => {
              return subregion.id === Number(village);
            }
          );
          if (subregion) {
            selectedDivisions.push({
              parent: {
                id: flatDistricts[index].id,
                name: flatDistricts[index].name,
              },
              division: { ...subregion },
            });
          }
        });
      });
      dispatch({
        type: CompareActionType.SELECT_DIVISIONS,
        payload: selectedDivisions,
      });
    });
  };

  const bulkUpdateIndicators = (indicators: indicator[]) => {
    dispatch({
      type: CompareActionType.BULK_UPDATE_INDICATORS,
      payload: indicators,
    });
  };

  const setAllIndicators = (indicators: indicatorCategory[]) => {
    dispatch({
      type: CompareActionType.SET_ALL_INDICATORS,
      payload: indicators,
    });
  };

  const selectDivision = (division: SelectedDivisionType) => {
    dispatch({
      type: CompareActionType.SELECT_DIVISION,
      payload: division,
    });
  };
  const deselectDivision = (divisionId: number) => {
    dispatch({
      type: CompareActionType.DESELECT_DIVISION,
      payload: divisionId,
    });
  };

  const loadSelectedDivisions = (subregionIds: string) => {
    dispatch({
      type: CompareActionType.LOAD_SELECTED_DIVISIONS,
      payload: {
        ids: subregionIds,
        allDivisions: globalState.allDivisions,
      },
    });
  };

  const loadSelectedIndicators = (indIds: string) => {
    dispatch({
      type: CompareActionType.LOAD_SELECTED_INDICATORS,
      payload: indIds,
    });
  };

  const selectIndicator = (indicator: indicator) => {
    dispatch({
      type: CompareActionType.SELECT_INDICATOR,
      payload: indicator,
    });
  };

  return {
    updateDataview,
    bulkUpdateIndicators,
    setAllIndicators,
    selectDivision,
    deselectDivision,
    loadSelectedDivisions,
    loadSelectedVillages,
    loadSelectedIndicators,
    selectIndicator,
  };
};
