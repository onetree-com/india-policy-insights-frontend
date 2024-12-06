import { useState, useEffect } from "react";
import { dispatchGTMEvent } from "utils/tagManager";

export const useDispatchRenderEvent = () => {
  const [event, setEvent] = useState<
    Record<string, string | string[] | number | undefined> | undefined
  >(undefined);
  const [prevEvent, setPrevEvent] = useState<
    Record<string, string | string[] | number | undefined> | undefined
  >(undefined);

  useEffect(() => {
    if (!event) return;
    if (
      prevEvent === undefined ||
      Object.entries(event).find(([key, eValue]) => {
        return eValue !== prevEvent[key as keyof typeof prevEvent];
      })
    ) {
      dispatchGTMEvent(event);
      setPrevEvent(event);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return setEvent;
};
