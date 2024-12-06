import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";

export const getIndicatorCategories = <Type>({
  RegCount = 1000,
  RegIgnored,
  controller,
  Filter,
  currentLanguage,
}: {
  RegCount: number;
  RegIgnored: number;
  controller: AbortController;
  Filter?: number;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_INDICATOR_CATEGORIES;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        { RegCount, RegIgnored, Filter },
        { signal: controller.signal }
      );
      const data = (response?.data as any)?.map((item: any) => {
        if (currentLanguage === "en") {
          return {
            ...item,
            catNameEn: item.catName,
            indicators: item.indicators.map((indicator: any) => ({
              ...indicator,
              indNameEn: indicator.indName,
            })),
          };
        } else {
          return {
            ...item,
            catName: item.catNameHi,
            indicators: item.indicators.map((indicator: any) => ({
              ...indicator,
              catName: indicator.catNameHi,
              indDescription: indicator.indDescriptionHi,
              indNameEn: indicator.indName,
              indName: indicator.indNameHi,
            })),
          };
        }
      });
      resolve(data);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }
      reject(error);
    }
  });
};
