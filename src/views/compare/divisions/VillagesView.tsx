import { getDivisions } from "api/divisions";
import CompareContent from "components/CompareContent";
import Header from "components/Header";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CompareVillagesView: FC = () => {
  const { globalDispatch } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(
    () => {
      globalDispatch({
        type: GlobalActionType.SET_DIVISION_TYPE,
        payload: DivisionTypes.Village,
      });

      const controller = new AbortController();
      (async () => {
        const data = await getDivisions({
          RegCount: 5000,
          RegIgnored: 0,
          RegionType: DivisionTypes.District,
          StateId: 0,
          RegionID: 0,
          SubregionID: 0,
          controller,
          currentLanguage,
        });
        globalDispatch({
          type: GlobalActionType.SET_ALL_DIVISIONS,
          payload: data,
        });
      })();

      return () => {
        controller.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLanguage]
  );

  return (
    <>
      <Header feature="COMPARE" division="VILLAGES" exclude={new Set()} />
      <CompareContent />
    </>
  );
};

export default CompareVillagesView;
