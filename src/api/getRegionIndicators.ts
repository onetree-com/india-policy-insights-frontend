import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";
export const getRegionIndicator = <Type>({
  controller,
  Filter,
  Indicators,
  RegionId,
  RegionType,
  StateId,
  Year,
  YearEnd = 0,
}: {
  controller: AbortController;
  Filter: number;
  Indicators: number[];
  RegionId: number;
  RegionType: string;
  StateId: number;
  Year: number;
  YearEnd: number;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_REGION_INDICATOR;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          StateId,
          RegionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          RegionId,
          Year,
          YearEnd,
          Filter,
          Indicators,
        },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
