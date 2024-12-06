import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import useMediaQuery from "hooks/use-media-query";
import { useTranslation } from "react-i18next";
import { FC, useContext, useEffect, useState } from "react";
import styles from "components/AtlasSidebar/styles.module.scss";
import { MediaQueries } from "utils/media-queries";
import AtlasIndicator from "components/AtlasIndicator";
import AtlasDistrictFilter from "components/AtlasDivisionFilter";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import { getIndicatorDeciles } from "api/getIndicatorDeciles";
import AtlasDataView from "components/AtlasDataView";
import { AllIndia, AllIndiaChanges } from "components/AtlasContent";
import { getIndicatorChanges } from "api/getIndicatorChanges";
import { GlobalContext } from "context/globalContext";
import { indicatorChanges } from "models/indicator";

interface Props {
  allIndia?: AllIndia;
  allIndiaChanges?: AllIndiaChanges;
  selectedChanges?: AllIndiaChanges;
}

const AtlasSidebar: FC<Props> = ({
  allIndia,
  allIndiaChanges,
  selectedChanges,
}) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const { globalState } = useContext(GlobalContext)!;
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(() => {
    if (!atlasState.selectedIndicator) return;
    const controller = new AbortController();
    getIndicatorDeciles({
      year: 2021,
      indicators: [atlasState.selectedIndicator.indId!],
      RegionType: globalState.divisionType,
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
  }, [atlasState.selectedIndicator, atlasDispatch, currentLanguage]);

  useEffect(() => {
    if (!atlasState.selectedIndicator) return;
    const controller = new AbortController();
    if (atlasState.dataView.year === 2016) {
      getIndicatorChanges({
        RegCount: 1000,
        RegIgnored: 0,
        Indicators: [atlasState.selectedIndicator.indId!],
        RegionType: globalState.divisionType,
        controller,
        currentLanguage,
      }).then((data: any) => {
        if (Array.isArray(data) && data.length === 0) return;

        atlasDispatch({
          type: AtlasActionType.SET_INDICATOR_CHANGES,
          payload:
            data.filter((i: any) => i.changeDescription !== undefined) ?? [],
        });
        atlasDispatch({
          type: AtlasActionType.SET_INDICATOR_CHANGES_EXTRA_VALUE,
          payload:
            [...data].sort((a: indicatorChanges, b: indicatorChanges) => {
              if (a.prevalenceChangeCutoffs < b.prevalenceChangeCutoffs) {
                return -1;
              } else if (
                a.prevalenceChangeCutoffs > b.prevalenceChangeCutoffs
              ) {
                return 1;
              }
              return 0;
            }) ?? undefined,
        });
      });
    }
    return () => {
      controller.abort();
    };
  }, [
    atlasState.selectedIndicator,
    atlasDispatch,
    atlasState.dataView.year,
    globalState.divisionType,
    currentLanguage,
  ]);

  return (
    <>
      {isDesktop ? (
        <AtlasDesktopSidebar
          allIndia={allIndia}
          allIndiaChanges={allIndiaChanges}
          selectedChanges={selectedChanges}
        />
      ) : (
        <AtlasMobileSidebar
          allIndia={allIndia}
          allIndiaChanges={allIndiaChanges}
          selectedChanges={selectedChanges}
        />
      )}
    </>
  );
};
const AtlasDesktopSidebar: FC<Props> = ({
  allIndia,
  allIndiaChanges,
  selectedChanges,
}) => {
  return (
    <>
      <div className={styles.container}>
        <AtlasDataView />
        <AtlasIndicator
          allIndia={allIndia}
          allIndiaChanges={allIndiaChanges}
          selectedChanges={selectedChanges}
        />
        <AtlasDistrictFilter />
      </div>
    </>
  );
};

const AtlasMobileSidebar: FC<Props> = ({
  allIndia,
  allIndiaChanges,
  selectedChanges,
}) => {
  const { globalState } = useContext(GlobalContext)!;
  const [expand, setExpand] = useState<boolean>(false);
  const { t } = useTranslation();

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
              <AtlasIndicator
                allIndia={allIndia}
                allIndiaChanges={allIndiaChanges}
                isExpandInMobile={expand}
                selectedChanges={selectedChanges}
              />
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
                  <p className={styles.text}>{t("select_the")}</p>
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

export default AtlasSidebar;
