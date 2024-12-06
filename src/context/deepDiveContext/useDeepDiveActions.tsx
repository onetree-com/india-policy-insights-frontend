import { DataViews } from "models/data-view";
import { indicatorCategory } from "models/indicator";
import { useContext } from "react";
import { DeepDiveActionType, DeepDiveContext } from ".";
import { getDivisions } from "api/divisions";
import { DivisionTypes } from "context/globalContext";
import { useTranslation } from "react-i18next";

export const useDeepDiveActions = () => {
  const { dispatch } = useContext(DeepDiveContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const updateDataview = (dataView: DataViews) => {
    dispatch({
      type: DeepDiveActionType.UPDATE_DATAVIEW,
      payload: dataView,
    });
  };

  const loadSelectedVillages = (subregionId: string) => {
    const ids = subregionId.split("-");
    getDivisions({
      RegCount: 5000,
      RegIgnored: 0,
      RegionType: DivisionTypes.Village,
      StateId: 0,
      RegionID: Number(ids[0]),
      SubregionID: 0,
      currentLanguage,
    }).then((data: any) => {
      const district = data[0];
      const village = district.subregions.find((item: any) => {
        return item.id === Number(ids[1]);
      });
      dispatch({
        type: DeepDiveActionType.SELECT_VILLAGE,
        payload: { district, village },
      });
    });
  };

  const setAllIndicators = (data: indicatorCategory[]) => {
    dispatch({
      type: DeepDiveActionType.SET_ALL_INDICATORS,
      payload: data,
    });
  };

  const loadSelectedIndicators = (indIds: string) => {
    dispatch({
      type: DeepDiveActionType.LOAD_SELECTED_INDICATORS,
      payload: indIds,
    });
  };

  return {
    updateDataview,
    setAllIndicators,
    loadSelectedIndicators,
    loadSelectedVillages,
  };
};
