import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";
import { RegionTypes } from "models/divisions";

export const getRegionMeasurementsChange = <Type>({
  RegCount = 1000,
  RegIgnored,
  RegionType,
  RegionsId,
  Year,
  YearEnd,
  Indicators,
  controller,
  currentLanguage,
}: {
  RegCount: number;
  RegIgnored: number;
  RegionType: string;
  RegionsId: any;
  Year: number;
  YearEnd?: number;
  Indicators: number[];
  controller: AbortController;
  currentLanguage: string;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_REGION_MEASUREMENTS_CHANGE;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          RegionsId,
          Year,
          YearEnd,
          Indicators,
        },
        { signal: controller.signal }
      );

      const data = {
        ...response.data,
        allIndia: (response as any).data.allIndia?.map?.((allIn: any) => ({
          ...allIn,
          indName: currentLanguage === "en" ? allIn.indName : allIn.indNameHi,
        })),
        regionsChange: (response as any).data.regionsChange?.map?.(
          (region: any) => ({
            ...region,
            indName:
              currentLanguage === "en" ? region.indName : region.indNameHi,
            stateName:
              currentLanguage === "en" ? region.stateName : region.stateNameHi,
            stateAbbreviation:
              currentLanguage === "en"
                ? region.stateAbbreviation
                : region.stateAbbreviationHi,
            name: currentLanguage === "en" ? region.name : region.nameHi,
          })
        ),
      };
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
