import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorDeciles = <Type>({
  year,
  indicators,
  RegionType,
  stateId,
  controller,
  currentLanguage,
}: {
  year: number;
  indicators: number[];
  RegionType: string;
  stateId?: number;
  controller?: AbortController;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATOR_DECILES;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          year,
          indicators,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          stateId,
        },
        controller ? { signal: controller.signal } : {}
      );
      const data = (response?.data as any)?.map((item: any) => {
        if (currentLanguage === "en") {
          return { ...item };
        } else {
          return {
            ...item,
            indName: item.indNameHi,
            description: item.descriptionHi,
          };
        }
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
