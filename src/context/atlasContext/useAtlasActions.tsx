import { ParentChildren } from "models/divisions";
import { useContext } from "react";
import { AtlasActionType, AtlasContext } from ".";
import { getDivisions } from "api/divisions";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { useGlobalActions } from "context/globalContext/useGlobalActions";
import { useTranslation } from "react-i18next";

export const useAtlasActions = () => {
  const { atlasDispatch } = useContext(AtlasContext)!;
  const { globalDispatch } = useContext(GlobalContext)!;
  const { selectDivision } = useGlobalActions();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const updateDataview = (dataView: any) => {
    atlasDispatch({
      type: AtlasActionType.SET_DATA_VIEW,
      payload: dataView,
    });
  };

  const loadSelectedVillages = (subregionIds: string) => {
    const ids = subregionIds.split(",");
    const [stateId, districtId] = ids[0].split("-");
    ids.shift();
    Promise.all([
      getDivisions({
        RegCount: 5000,
        RegIgnored: 0,
        RegionType: DivisionTypes.Village,
        StateId: 0,
        RegionID: Number(districtId),
        SubregionID: 0,
        currentLanguage,
      }),
      getDivisions({
        RegCount: 5000,
        RegIgnored: 0,
        RegionType: DivisionTypes.District,
        StateId: Number(stateId),
        RegionID: Number(districtId),
        SubregionID: 0,
        currentLanguage,
      }),
    ]).then((data: any) => {
      const [stateData] = data[1];
      selectDivision({
        parent: {
          id: stateData.id,
          name: stateData.name,
          abbreviation: stateData.abbreviation,
        },
        division: {
          id: stateData.subregions[0].id,
          name: stateData.subregions[0].name,
          nameEn: stateData.subregions[0].nameEn,
          geoId: stateData.subregions[0].geoId,
        },
      });
      globalDispatch({
        type: GlobalActionType.SET_FROM_LINK,
        payload: true,
      });
      atlasDispatch({
        type: AtlasActionType.SET_ALL_DISTRICT_VILLAGES,
        payload: data[0],
      });
    });
  };

  const loadSelectedDivisions = (
    allDivisions: ParentChildren[],
    ids: string
  ) => {
    atlasDispatch({
      type: AtlasActionType.LOAD_DIVISIONS,
      payload: { allDivisions, ids },
    });
  };

  return {
    updateDataview,
    loadSelectedDivisions,
    loadSelectedVillages,
  };
};
