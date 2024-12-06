import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getTableOfIndicators = <Type>({
  controller,
  regionId,
  RegionType,
  year,
  yearEnd,
  currentLanguage,
}: {
  controller: AbortController;
  regionId: number;
  RegionType: string;
  year: number;
  yearEnd: number;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_TABLE_OF_INDICATORS;
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

      const data = (response.data as any).map((item: any) => {
        return currentLanguage === "en"
          ? item
          : {
              ...item,
              catName: item.catNameHi,
              indicators: item.indicators.map((indicator: any) => ({
                ...indicator,
                catName: indicator.catNameHi,
                name: indicator.nameHi,
              })),
            };
      });

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
