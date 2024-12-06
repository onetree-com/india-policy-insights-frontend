import { getMeasurements } from "api/getMeasurements";
import { getIndicatorCategories } from "api/indicatorCategories";
import styles from "components/CompareContent/styles.module.scss";
import CopyLinkButton from "components/CopyLinkButton";
import DataView from "components/DataView";
import References from "components/References";
import StateDistrictFilter from "components/StateDistrictFilter";
import {
  CompareActionType,
  CompareContext,
  SelectedDivisionType,
} from "context/compareContext";
import { useCompareActions } from "context/compareContext/useCompareActions";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { indicator, indicatorCategory } from "models/indicator";
import { FC, useContext, useEffect, useState } from "react";
import { loadDivision } from "utils/loadEntities";
import { MediaQueries } from "utils/media-queries";
import { updateTable } from "utils/updateTable";
import useCompareNavigation from "views/compare/useCompareNavigation";
import TableContent from "./TableContent";
import CopyLinkVillagesButton from "components/CopyLinkButton/CopyLinkVillages";
import { useTranslation } from "react-i18next";
import { getDivisions } from "api/divisions";
import CompareVillageModal from "components/CompareVillageModal";
import { useDispatchRenderEvent } from "hooks/use-dispatch-render-event";

const CompareContent: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState } = useContext(GlobalContext)!;
  const { state, dispatch } = useContext(CompareContext)!;
  useCompareNavigation();
  const {
    updateDataview,
    bulkUpdateIndicators,
    setAllIndicators,
    selectDivision,
    selectIndicator,
    deselectDivision,
  } = useCompareActions();
  const [showEditDivision, setShowEditDivision] = useState<boolean>(false);
  const [divisionIndex, setDivisionIndex] = useState<null | {
    name: string;
    index: number;
  }>(null);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  //! updates to this setState dispatch render event inside following hook
  const setRenderEvent = useDispatchRenderEvent();

  const [selectedVillages, setSelectedVillages] = useState<
    SelectedDivisionType[]
  >([]);

  useEffect(() => {
    if (selectedVillages.length !== 0) {
      dispatch({
        type: CompareActionType.SELECT_DIVISIONS,
        payload: selectedVillages,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVillages]);

  useEffect(() => {
    const abortController = new AbortController();
    const getIndicators = async () => {
      try {
        const data = await getIndicatorCategories<indicatorCategory[]>({
          RegCount: 1000,
          RegIgnored: 0,
          controller: abortController,
          currentLanguage,
        });
        setAllIndicators(data);
      } catch (error) {}
    };
    getIndicators();
    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  useEffect(() => {
    setRenderEvent({
      event: "render_compare",
      indicator: `${state.selectedIndicators.length} Indicators selected`,
      division: state.selectedDivisions
        ? state.selectedDivisions.map(
            (item) => `${item.division?.nameEn} ${globalState.divisionType}`
          )
        : "",
      date_range: state.dataView ? state.dataView : "2021",
      display_by: globalState.selectedMetric,
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedDivisions, state.selectedIndicators, state.dataView]);

  useEffect(() => {
    const abortController = new AbortController();
    if (
      state.selectedDivisions &&
      state.selectedDivisions.length !== 0 &&
      state.selectedIndicators &&
      state.selectedIndicators.length !== 0
    ) {
      Promise.all(
        state.selectedDivisions.map((item) => {
          return getMeasurements<{
            region: indicator[];
            state: indicator[];
            allIndia: indicator[];
          }>({
            RegionType: globalState.divisionType,
            RegionId: item.division.id,
            Year: state.dataView === "2016 - 2021" ? 2016 : 2021,
            YearEnd: state.dataView === "2016 - 2021" ? 2021 : 0,
            Indicators: state.selectedIndicators.map((item) => {
              return item.indId!;
            }),
            controller: abortController,

            RegCount: 1000,
            RegIgnored: 0,
            StateId: item.parent.id,
            currentLanguage,
          });
        })
      ).then((data) => {
        bulkUpdateIndicators(
          updateTable(data, state.selectedIndicators, state.dataView)
        );
      });
    }
    return () => {
      abortController.abort();
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedDivisions, state.dataView, currentLanguage]);

  useEffect(() => {
    if (state.selectedDivisions && state.selectedDivisions.length !== 0) {
      const abortController = new AbortController();
      Promise.all(
        state.selectedDivisions.map((item) => {
          return getDivisions({
            RegionType: globalState.divisionType,
            RegionID:
              globalState.divisionType !== DivisionTypes.Village
                ? item.division.id
                : item.parent.id,
            SubregionID:
              globalState.divisionType !== DivisionTypes.Village
                ? 0
                : item.division.id,
            controller: abortController,
            RegCount: 1000,
            RegIgnored: 0,
            StateId:
              globalState.divisionType !== DivisionTypes.Village
                ? item.parent.id
                : 0,
            currentLanguage,
          });
        })
      ).then((data: any) => {
        const dataFlat = data.flat();
        const parsedDivisions: any = [];
        state.selectedDivisions?.forEach((division, index) => {
          const region = dataFlat[index].subregions.find((it: any) => {
            return it.id === division.division.id;
          });
          if (region) {
            delete dataFlat[index].subregions;
            parsedDivisions.push({
              parent: { ...dataFlat[index] },
              division: { ...region },
            });
          }
        });
        dispatch({
          type: CompareActionType.SELECT_DIVISIONS,
          payload: parsedDivisions,
        });
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  useEffect(() => {
    if (globalState.rankingToCompareInfo && globalState.allDivisions.length) {
      const division = loadDivision(
        globalState.allDivisions,
        globalState.rankingToCompareInfo?.division.id
      );
      if (division && division.division) {
        deselectDivision(division.division.id);
        selectDivision(division);
      }
      selectIndicator(globalState.rankingToCompareInfo.indicator!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.allDivisions, globalState.rankingToCompareInfo]);
  return (
    <>
      {globalState.divisionType !== DivisionTypes.Village ? (
        <StateDistrictFilter
          showEditDivision={showEditDivision}
          toggleEditDivision={() => {
            setShowEditDivision(false);
          }}
          divisionIndex={divisionIndex}
          selectedDivisions={state.selectedDivisions}
          dispatch={dispatch}
        />
      ) : (
        <CompareVillageModal
          showEditModal={showEditDivision}
          setShowEditModal={setShowEditDivision}
          divisionIndex={divisionIndex?.index!}
          selectedVillages={selectedVillages}
          setSelectedVillages={setSelectedVillages}
        />
      )}
      {isDesktop ? (
        <div className={styles.container}>
          <References dataView={state.dataView} />

          <TableContent
            isDesktop={isDesktop}
            divisionType={globalState.divisionType}
            setDivisionIndex={setDivisionIndex}
            setShowEditDivision={setShowEditDivision}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <DataView
            dataView={state.dataView}
            setDataView={(payload) => {
              updateDataview(payload);
            }}
          />
          <References dataView={state.dataView} />
          <div className={styles.tableContainer}>
            <div className={styles.tableContent}>
              <TableContent
                isDesktop={isDesktop}
                divisionType={globalState.divisionType}
                setDivisionIndex={setDivisionIndex}
                setShowEditDivision={setShowEditDivision}
              />
            </div>
          </div>
        </div>
      )}
      {globalState.divisionType !== DivisionTypes.Village ? (
        <CopyLinkButton
          lang={currentLanguage}
          buttonStyles={{ zIndex: 0 }}
          dataView={state.dataView}
          indicators={state.selectedIndicators}
          divisions={state.selectedDivisions?.map((d) => d.division)}
        />
      ) : (
        <CopyLinkVillagesButton
          lang={currentLanguage}
          buttonStyles={{ zIndex: 0 }}
          dataView={state.dataView}
          indicators={state.selectedIndicators}
          divisions={state.selectedDivisions}
        />
      )}
    </>
  );
};
export default CompareContent;
