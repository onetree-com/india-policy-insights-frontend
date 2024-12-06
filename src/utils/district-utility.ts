import { getDivisions } from "api/divisions";
import { getIndicatorRegions } from "api/getIndicatorRegions";
import { AtlasActionType } from "context/atlasContext";
import { DivisionTypes } from "context/globalContext";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const fetchSelectedDistrict = (
  atlasDispatch: React.Dispatch<{
    type: AtlasActionType;
    payload: any;
  }>,
  id: number,
  divisionType: DivisionTypes,
  indId: number,
  year: number,
  currentLanguage: string,
  yearEnd?: number,
  feature?: MapboxGeoJSONFeature,
  setSelectedFeature?: any,
  setPopup?: any,
  northWest?: any
) => {
  var controller = new AbortController();
  Promise.all([
    getIndicatorRegions({
      regionType: divisionType,
      regionsId: [id],
      indId: indId,
      year: year,
      yearEnd: yearEnd ?? 0,
      controller,
      currentLanguage,
    }),
    getDivisions({
      RegCount: 5000,
      RegIgnored: 0,
      RegionType: divisionType,
      StateId: 0,
      RegionID: id,
      SubregionID: 0,
      controller,
      currentLanguage,
    }),
  ]).then((data: any) => {
    const { max, maxEnd, median, medianEnd, min, minEnd, divisions } = data[0];
    if (divisions && divisions.length !== 0) {
      const { name, prevalence, headcount, stateAbbreviation } =
        divisions.at(0);
      if (feature) {
        setSelectedFeature(feature);
        setPopup({
          feature: { ...feature, properties: { name, id } },
          lngLat: northWest!,
          stateAbbreviation,
        });
      }
      atlasDispatch({
        type: AtlasActionType.SELECTED_DISTRICT_MAP,
        payload: {
          max,
          maxEnd,
          median,
          medianEnd,
          min,
          minEnd,
          headcount,
          prevalence,
          name,
          stateAbbreviation,
          regionId: id,
        },
      });
    } else {
      if (feature) {
        setSelectedFeature(feature);
        setPopup({
          feature: {
            ...feature,
            properties: { name: data[1][0].subregions[0].name, id },
          },
          lngLat: northWest!,
          stateAbbreviation: data[1][0].abbreviation,
        });
      }
      atlasDispatch({
        type: AtlasActionType.SELECTED_DISTRICT_MAP,
        payload: {
          noData: true,
          name: data[1][0].subregions[0].name,
          stateAbbreviation: data[1][0].abbreviation,
        },
      });
    }
  });
};
