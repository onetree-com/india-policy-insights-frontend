import { usePDF } from "@react-pdf/renderer";
import { getHierarchy } from "api/getHierarchy";
import styles from "components/CreateReportContent/styles.module.scss";
import CreateReportMap from "components/CreateReportMap";
import CreateReportSidebar from "components/CreateReportSidebar";
import Paginator from "components/Paginator";
import PDFReport from "components/PDFReport";
import VillagePDFReport from "components/PDFReport/VillagePDFReport";
import { CreateReportContext } from "context/createReportContext";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";

const CreateReportContent: FC = () => {
  const [page, setPage] = useState<number>(1);
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { state } = useContext(CreateReportContext)!;
  const [mapImagePrevalence, setMapImagePrevalence] = useState<string>("");
  const [mapImageHeadcount, setImageHeadcount] = useState<string>("");
  const pdfDoc =
    globalState.divisionType !== DivisionTypes.Village ? (
      <>
        <PDFReport
          indicator={state.selectedIndicators[page - 1]}
          RegionType={globalState.divisionType}
          Region={globalState.selectedDivision?.division}
          State={globalState.selectedDivision?.state}
          demographicProfile={state.populationProfile}
          mapImagePrevalence={
            mapImagePrevalence !== "" ? mapImagePrevalence : undefined
          }
          mapImageHeadcount={
            mapImageHeadcount !== "" ? mapImageHeadcount : undefined
          }
        />
      </>
    ) : (
      <VillagePDFReport
        indicators={state.selectedIndicators}
        RegionType={globalState.divisionType}
        Region={state.selectedDivision?.village}
        StateId={state.selectedDivision?.district?.id}
        parentDivisions={`${state.selectedDivision?.district?.name}, ${globalState.selectedDivision?.state?.name}`}
      />
    );

  const [instance, updateInstance] = usePDF({
    document: pdfDoc,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    updateInstance(pdfDoc);
  }, [
    page,
    state.selectedIndicators,
    globalState.divisionType,
    globalState.selectedDivision?.division?.id,
    globalState.selectedDivision?.village?.id,
    globalState.selectedDivision?.state?.id,
    state.populationProfile,
    mapImagePrevalence,
    mapImageHeadcount,
  ]);

  useEffect(() => {
    if (
      globalState.selectedDivision?.division?.id !== undefined ||
      globalState.selectedDivision?.village?.id !== undefined
    ) {
      if (globalState.divisionType === DivisionTypes.Village) {
        getHierarchy({
          RegionType: DivisionTypes.District,
          RegionId: globalState.selectedDivision.division.id,
        }).then((data: any) => {
          globalDispatch({
            type: GlobalActionType.SELECT_DIVISION,
            payload: {
              state: data.parent,
              parent: globalState.selectedDivision?.division,
              division: globalState.selectedDivision?.village,
            },
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalState.selectedDivision?.division?.id,
    globalState.selectedDivision?.village?.id,
  ]);

  return (
    <div className={styles.container}>
      {/*
     ` !!commented to avoid errors on this deprecated file, as new sidebar receives report data as props
     <CreateReportSidebar
        setPage={setPage}
        page={page}
        mapImagePrevalence={mapImagePrevalence}
        mapImageHeadcount={mapImageHeadcount}
      /> */}
      {globalState.divisionType !== DivisionTypes.Village && (
        <>
          <div
            style={{
              zIndex: "-1",
              position: "absolute",
              width: "370px",
              height: "180px",
            }}>
            <CreateReportMap
              mapId="REACT-MAP-GL"
              colorDecile="#A51C30"
              setImage={setMapImagePrevalence}
            />
          </div>
          <div
            style={{
              zIndex: "-1",
              position: "absolute",
              width: "370px",
              height: "180px",
            }}>
            <CreateReportMap
              mapId="REACT-MAP-GL-1"
              colorDecile="#67518C"
              setImage={setImageHeadcount}
            />
          </div>
        </>
      )}
      <div className={styles.content}>
        {state.selectedIndicators.length !== 0 &&
        isDesktop &&
        globalState.divisionType !== DivisionTypes.Village ? (
          <div className={styles.paginatorContainer}>
            <Paginator setPage={setPage} page={page} />
          </div>
        ) : null}
        <iframe
          title={`${globalState.selectedDivision?.division?.name} report`}
          src={`${instance.url}#toolbar=0`}
          style={
            state.selectedIndicators.length === 0 ||
            !isDesktop ||
            globalState.divisionType === DivisionTypes.Village
              ? { height: "100%" }
              : {}
          }
          className={`${styles.PDFViewer}`}
        />
      </div>
    </div>
  );
};

export default CreateReportContent;
