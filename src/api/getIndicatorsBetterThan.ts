import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorsBetterThan = <Type>({
  controller,
  RegionId,
  RegionType,
  Year,
  RegionToCompareType,
}: {
  controller: AbortController;
  RegionId: number;
  RegionType: string;
  RegionToCompareType: number;
  Year: number;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATORS_BETTER_THAN;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          RegionId,
          Year,
          RegionToCompareType,
        },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
