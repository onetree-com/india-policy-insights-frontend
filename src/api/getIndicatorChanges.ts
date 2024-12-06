import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorChanges = <Type>({
  RegCount = 1000,
  RegIgnored,
  Indicators,
  RegionType,
  controller,
  currentLanguage,
}: {
  RegCount: number;
  RegIgnored: number;
  Indicators: number[];
  RegionType: string;
  controller: AbortController;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATOR_CHANGES;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          Indicators,
        },
        { signal: controller.signal }
      );
      const data = (response?.data as any)?.map((item: any) => ({
        ...item,
        indicatorName:
          currentLanguage === "en" ? item.indicatorName : item.indicatorNameHi,
      }));
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
