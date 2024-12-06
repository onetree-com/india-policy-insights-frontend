import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorsPerDecile = <Type>({
  controller,
  regionId,
  RegionType,
}: {
  controller: AbortController;
  regionId: number;
  RegionType: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATORS_PER_DECILE;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          regionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          regionId,
        },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
