import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { DivisionTypes } from "context/globalContext";
import { RegionTypes } from "models/divisions";

export const getDivisions = <Type>({
  RegCount,
  RegIgnored,
  RegionType,
  StateId,
  RegionID,
  SubregionID,
  controller,
  currentLanguage,
}: {
  RegCount: number;
  RegIgnored: number;
  RegionType: string;
  StateId: number;
  RegionID: number;
  SubregionID: number;
  controller?: AbortController;
  currentLanguage: string;
}) => {
  return new Promise(async (resolve, reject) => {
    const url = config.GET_REGION_UNITS;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          StateId,
          RegionID,
          SubregionID,
        },
        { signal: controller?.signal }
      );
      let data;
      if ((response?.data as any)?.length !== 0) {
        data = (response?.data as any)?.map((item: any) => {
          if (currentLanguage === "en") {
            return {
              ...item,
              nameEn: item.name,
              subregions: item.subregions.map((region: any) => ({
                ...region,
                nameEn: region.name,
              })),
            };
          } else {
            return {
              ...item,
              abbreviation: item.abbreviationHi,
              name: item.nameHi,
              nameEn: item.name,
              subregions: item.subregions.map((region: any) => ({
                ...region,
                name:
                  RegionType !== DivisionTypes.Village
                    ? region.nameHi
                    : region.name,
                //TODO! remove this check once we have translations for villages
                nameEn: region.name,
              })),
            };
          }
        });
      } else {
        data = [];
      }

      resolve(data);
    } catch (error) {
      if (controller?.signal.aborted) {
        return;
      }
      reject(error);
    }
  });
};
