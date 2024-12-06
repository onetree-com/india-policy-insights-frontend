import { getIndicatorCategories } from "api/indicatorCategories";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const useIndicators = () => {
  const { globalDispatch } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(
    () => {
      const controller = new AbortController();
      getIndicatorCategories({
        RegCount: 5000,
        RegIgnored: 0,
        controller,
        currentLanguage,
      }).then((indicators: any) => {
        globalDispatch({
          type: GlobalActionType.SET_ALL_INDICATORS,
          payload: indicators,
        });
      });
      return () => {
        controller.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLanguage]
  );
};

export default useIndicators;
