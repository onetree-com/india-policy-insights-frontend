import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";
export const getRegionDemographics = <Type>({
  RegionType,
  RegionId,
  controller,
}: {
  RegionType: string;
  RegionId: number;
  controller?: AbortController;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_REGION_DEMOGRAPHICS;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          RegionId,
        },
        { signal: controller?.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
