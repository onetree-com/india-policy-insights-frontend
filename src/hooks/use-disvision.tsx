import { getDivisions } from "api/divisions";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { ParentChildren } from "models/divisions";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const useDivision = (division: DivisionTypes) => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(
    () => {
      if (!division) return;

      globalDispatch({
        type: GlobalActionType.SET_DIVISION_TYPE,
        payload: division,
      });

      const controller = new AbortController();
      (async () => {
        const data = await getDivisions({
          RegCount: 5000,
          RegIgnored: 0,
          RegionType: division,
          StateId: 0,
          RegionID: 0,
          SubregionID: 0,
          controller,
          currentLanguage,
        });
        if (globalState.selectedDivision?.division?.id !== undefined) {
          let selectedDivision: any;
          (data as ParentChildren[]).forEach((st) => {
            if (st.id === globalState.selectedDivision?.state?.id) {
              const subregions = st.subregions.find((div) => {
                return div.id === globalState.selectedDivision?.division?.id;
              });
              selectedDivision = {
                ...st,
                subregions,
              };
            }
          });
          if (selectedDivision) {
            globalDispatch({
              type: GlobalActionType.SELECT_DIVISION,
              payload: {
                parent: {
                  id: selectedDivision.id,
                  name: selectedDivision.name,
                  abbreviation: selectedDivision.abbreviation,
                },
                division: {
                  id: selectedDivision.subregions.id,
                  name: selectedDivision.subregions.name,
                  nameEn: selectedDivision.subregions.nameEn,
                },
              },
            });
          }
        }

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
    [division, currentLanguage]
  );
};

export default useDivision;
