import { axiosDefaultConfig } from "./axiosConfig";
import config from "api/config.json";

export const getShortUrl = <Type>({
  key,
  fallbackUrl,
  controller,
}: {
  key: string;
  fallbackUrl?: string;
  controller: AbortController;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.GET_SHORT_URL;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        { key, fallbackUrl: fallbackUrl || "" },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createShortUrl = <Type>({
  originalUrl,
  controller,
}: {
  originalUrl: string;
  controller: AbortController;
}) => {
  return new Promise<Type>(async (resolve, reject) => {
    const url = config.CREATE_SHORT_URL;
    try {
      const response = await axiosDefaultConfig.post<Type>(
        url,
        { url: originalUrl },
        { signal: controller.signal }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
