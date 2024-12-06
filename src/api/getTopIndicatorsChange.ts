import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getTopIndicatorsChange = <Type>({
  controller,
  regionId,
  RegionType,
  year,
  yearEnd,
  count,
  improvement,
  currentLanguage,
}: {
  controller: AbortController;
  regionId: number;
  RegionType: string;
  yearEnd: number;
  year: number;
  count: number;
  improvement: boolean;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_TOP_INDICATORS_CHANGE;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          regionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          regionId,
          year,
          yearEnd,
          count,
          improvement,
        },
        { signal: controller.signal }
      );
      const data = (response.data as any).map((item: any) => {
        return currentLanguage === "en"
          ? item
          : {
              ...item,
              indicator: item.indicatorHi,
            };
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
