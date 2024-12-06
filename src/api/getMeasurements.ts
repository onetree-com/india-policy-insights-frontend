import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getMeasurements = <Type>({
  RegCount = 1000,
  RegIgnored = 0,
  RegionType,
  RegionId,
  Year,
  YearEnd,
  Indicators,
  StateId,
  controller,
  currentLanguage,
}: {
  RegCount?: number;
  RegIgnored?: number;
  RegionType: string;
  RegionId: any;
  Year: number;
  YearEnd?: number;
  Indicators: number[];
  StateId: number;
  controller?: AbortController;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_MEASUREMENTS;
    try {
      const response: any = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          RegionId,
          Year,
          YearEnd,
          Indicators,
          StateId,
        },
        { signal: controller?.signal }
      );
      response.data = {
        region: response.data.region.map((reg: any) => {
          if (currentLanguage === "en") {
            return { ...reg, indNameEn: reg.indName };
          } else {
            return { ...reg, indNameEn: reg.indName, indName: reg.indNameHi };
          }
        }),
        state: response.data.state.map((sta: any) => {
          if (currentLanguage === "en") {
            return { ...sta };
          } else {
            return { ...sta, indName: sta.indNameHi };
          }
        }),
        allIndia: response.data.allIndia.map((allInd: any) => {
          if (currentLanguage === "en") {
            return { ...allInd };
          } else {
            return { ...allInd, indName: allInd.indNameHi };
          }
        }),
      };
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
