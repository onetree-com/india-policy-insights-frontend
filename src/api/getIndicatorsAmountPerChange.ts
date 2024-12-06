import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getIndicatorsAmountPerChange = <Type>({
  controller,
  regionId,
  RegionType,
  year,
  yearEnd,
}: {
  controller: AbortController;
  regionId: number;
  RegionType: string;
  yearEnd: number;
  year: number;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATORS_AMOUNT_PER_CHANGE;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          regionType: RegionTypes[RegionType as keyof typeof RegionTypes],
          regionId,
          year,
          yearEnd,
        },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
