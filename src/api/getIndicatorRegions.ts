import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";
export const getIndicatorRegions = <Type>({
  regionType,
  indId,
  year,
  yearEnd,
  regionsId,
  controller,
  currentLanguage,
}: {
  regionType: string;
  regionsId: Array<number>;
  indId: number;
  year: number;
  yearEnd: number;
  controller: AbortController;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    let url = config.GET_INDICATOR_REGIONS;
    url += `?regionType=${RegionTypes[regionType as keyof typeof RegionTypes]}`;
    url += `&indId=${indId}&year=${year}`;
    if (yearEnd !== 0) {
      url += `&yearEnd=${yearEnd}`;
    }
    if (regionsId.length !== 0) {
      url += `&regionsId=${regionsId.map((region) => region).join()}`;
    } else {
      url += "&regionsId=";
    }
    try {
      const response = await axiosDefaultConfig.get<Type>(url, {
        headers: {
          "Cache-Control": "max-age=604800",
          Pragma: "max-age=604800",
        },
        signal: controller.signal,
      });
      let divisions;
      if (
        (response.data as any)?.divisions &&
        (response.data as any)?.divisions?.length !== 0
      ) {
        divisions = (response.data as any).divisions.map((div: any) => {
          if (currentLanguage === "en") {
            return { ...div };
          } else {
            return {
              ...div,
              description: div.descriptionHi,
              indName: div.indNameHi,
              name: div.nameHi,
              stateAbbreviation: div.stateAbbreviationHi,
              stateName: div.stateNameHi,
            };
          }
        });
      } else {
        divisions = [];
      }

      const data = {
        ...response.data,
        divisions,
        indName:
          currentLanguage === "en"
            ? (response.data as any).indName
            : (response.data as any).indNameHi,
      };
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
