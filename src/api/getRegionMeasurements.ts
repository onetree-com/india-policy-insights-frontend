import { axiosDefaultConfig } from "./axiosConfig"
import config from "api/config.json"
import { RegionTypes } from "models/divisions"

export const getRegionMeasurements = <Type>({
  RegCount = 1000,
  RegIgnored,
  RegionType,
  RegionId,
  Year,
  YearEnd,
  Indicators,
  controller,
}: {
  RegCount: number
  RegIgnored: number
  RegionType: string
  RegionId: any
  Year: number
  YearEnd?: number
  Indicators: number[]
  controller: AbortController
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_REGION_MEASUREMENTS
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        {
          RegCount,
          RegIgnored,
          RegionType: `${RegionTypes[RegionType as keyof typeof RegionTypes]}`,
          RegionId,
          Year,
          YearEnd,
          Indicators,
        },
        { signal: controller.signal }
      )
      resolve(response.data)
    } catch (error) {
      reject(error)
    }
  })
}
