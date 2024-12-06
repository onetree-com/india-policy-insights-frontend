import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";

export const getDistrictVillages = <Type>({
  RegCount,
  RegIgnored,
  filter,
  controller,
  currentLanguage,
}: {
  RegCount: number;
  RegIgnored: number;
  filter: string;
  controller?: AbortController;
  currentLanguage: string;
}) => {
  return new Promise(async (resolve, reject) => {
    const url = config.GET_DISTRICTS_VILLAGES;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          filter,
        },
        { signal: controller?.signal }
      );
      const data = (response?.data as any)?.map((result: any) => {
        return currentLanguage === "en"
          ? { ...result, nameEn: result.name }
          : { ...result, nameEn: result.name, name: result.name };
      });
      //TODO! add nameHi once we have translations for villages
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
