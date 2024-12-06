import TagManager from "react-gtm-module";

export const dispatchGTMEvent = (data: any) => {
  TagManager.dataLayer({ dataLayer: { ...data } });
};
