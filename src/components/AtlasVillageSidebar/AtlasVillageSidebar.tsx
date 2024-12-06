import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useEffect, useState } from "react";
import styles from "components/AtlasSidebar/styles.module.scss";
import { MediaQueries } from "utils/media-queries";
import AtlasIndicator from "components/AtlasIndicator";
import AtlasDistrictFilter from "components/AtlasDivisionFilter";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { getIndicatorDeciles } from "api/getIndicatorDeciles";
import AtlasDataView from "components/AtlasDataView";
import { AllIndia } from "components/AtlasContent";
import { DivisionTypes, GlobalContext } from "context/globalContext";
// import AtlasVillageFilter from "components/AtlasVillageFilter";
import AtlasVillageDistrictFilter from "components/AtlasVillageDistrictFilter";
import { getDivisions } from "api/divisions";
import { useTranslation } from "react-i18next";

interface Props {
  allIndia?: AllIndia;
}

const AtlasVillageSidebar: FC<Props> = ({ allIndia }) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;

  const { globalState } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(() => {
    if (!atlasState.selectedIndicator || !globalState.selectedDivision) return;
    const controller = new AbortController();
    getIndicatorDeciles({
      year: 2021,
      indicators: [atlasState.selectedIndicator.indId!],
      RegionType: DivisionTypes.Village,
      stateId: globalState.selectedDivision?.state?.id,
      currentLanguage,
    }).then((data: any) => {
      atlasDispatch({
        type: AtlasActionType.SET_INDICATOR_DECILES,
        payload: Array.isArray(data) ? Array.from(data).at(0) : [],
      });
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    atlasState.selectedIndicator,
    globalState.selectedDivision,
    atlasDispatch,
    currentLanguage,
  ]);

  useEffect(
    () => {
      if (!globalState.selectedDivision) return;

      let controller = new AbortController();

      (async () => {
        const data = await getDivisions({
          RegCount: 5000,
          RegIgnored: 0,
          RegionType: DivisionTypes.Village,
          StateId: 0,
          RegionID: globalState.selectedDivision?.division?.id!,
          SubregionID: 0,
          controller,
          currentLanguage,
        });
        if ((data as any).length !== 0) {
          atlasDispatch({
            type: AtlasActionType.SET_ALL_DISTRICT_VILLAGES,
            payload: data,
          });
        }
      })();

      return () => {
        controller?.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState.selectedDivision, currentLanguage]
  );

  return (
    <>
      {isDesktop ? (
        <AtlasDesktopSidebar allIndia={allIndia} />
      ) : (
        <AtlasMobileSidebar allIndia={allIndia} />
      )}
    </>
  );
};
const AtlasDesktopSidebar: FC<Props> = ({ allIndia }) => {
  return (
    <>
      <div className={styles.container}>
        <AtlasDataView />
        <AtlasVillageDistrictFilter />
        {/*TODO: AtlasVillageFilter might be enabled later */}
        {/* <AtlasVillageFilter /> */}
        <AtlasIndicator allIndia={allIndia} />
      </div>
    </>
  );
};

const AtlasMobileSidebar: FC<Props> = ({ allIndia }) => {
  const { globalState } = useContext(GlobalContext)!;
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <>
      <div
        className={styles.container}
        style={{
          position: expand ? "sticky" : undefined,
          top: expand ? "77px" : undefined,
          padding: !expand ? "16px" : "",
          zIndex: expand ? 2 : undefined,
        }}>
        <div className={styles.mobile}>
          <div>
            <div className={`${expand ? {} : styles.hideFilters}`}>
              <AtlasDataView />
            </div>
            <div style={{ padding: expand ? "24.05px 12px 17.2px 12px" : "" }}>
              <AtlasIndicator allIndia={allIndia} isExpandInMobile={expand} />
            </div>
            <div className={`${expand ? {} : styles.hideFilters}`}>
              <AtlasDistrictFilter />
            </div>
          </div>
          <div
            style={{
              position: expand ? "sticky" : undefined,
              zIndex: globalState.modalOpen ? 0 : expand ? 1 : undefined,
              margin: -16,
              marginTop: expand ? undefined : 15,
              marginBottom: expand ? undefined : -15,
            }}>
            <div
              className={styles.bottomLine}
              onClick={(): void => setExpand(!expand)}>
              {expand ? (
                <ExpandUp color="#504F54" />
              ) : (
                <>
                  <p className={styles.text}>Select</p>
                  <ExpandDown color="#242328" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AtlasVillageSidebar;
