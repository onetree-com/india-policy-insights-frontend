import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorData = <Type>({
  RegionType,
  RegionId,
  Year,
  YearEnd,
  indicators,
  controller,
}: {
  RegionType: string;
  RegionId: number;
  Year: number;
  YearEnd: number;
  indicators: number[];
  controller?: AbortController;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_REGION_MEASUREMENTS;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          regCount: 1000,
          regIgnored: 0,
          RegionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          RegionId,
          Year,
          YearEnd,
          indicators,
        },
        controller ? { signal: controller.signal } : {}
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
