import { FC, useContext, useEffect, useRef, useState } from "react";
import { BlobProvider, Font, usePDF } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import styles from "components/CreateReportContent/styles.module.scss";
import CreateReportSidebar from "components/CreateReportSidebar";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import UpdatedPDFReport from "./UpdatedPDFReport";
import Doughnut from "./Doughnut";
import MapDistrict from "./MapDistrict";
import MapState from "./MapState";
import UpdatedPDFReportVillage from "./UpdatedPDFReportVillage";
import LoadingScreen from "components/LoadingScreen";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import { CreateReportContext } from "context/createReportContext";
import useReportData from "hooks/use-report-data";
import { useLocation } from "react-router-dom";
import { MediaQueries } from "utils/media-queries";
import useMediaQuery from "hooks/use-media-query";
import { Page, Document, pdfjs } from "react-pdf";
import MapVillage from "./MapVillage";
import MapDistrictVillage from "./MapDistrictVillage";
import { reportHasData } from "utils/reportHasData";
Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const NewPDFReport: FC = () => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { globalState } = useContext(GlobalContext)!;
  const { state } = useContext(CreateReportContext)!;
  const [image, setImage] = useState<string>("");
  const [mapImageDistrict, setMapImageDistrict] = useState<string>("");
  const [mapImageState, setMapImageState] = useState<string>("");
  const [mapImageVillage, setMapImageVillage] = useState<string>("");
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [pages, setPages] = useState<any[]>();
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess(info: any): void {
    setPages(new Array(info._pdfInfo.numPages).fill(info._pdfInfo.numPages));
  }
  const { pathname } = useLocation();
  const regionTypeUrl = pathname.split("/")[2];

  const colors: { [key: number]: string } = {
    1: "#1D9744",
    2: "#95C35F",
    3: "#E39C57",
    4: "#D7191C",
  };
  const {
    tableOfIndicators,
    topIndicatorsChange,
    indicatorsPerDecile,
    indicatorsAmountPerChange,
    improvementRanking,
    indicatorsBetterThan,
  } = useReportData();

  const allDivisionsLength = globalState.allDivisions.reduce(
    (preValue, currValue) => {
      return (preValue += currValue.subregions.length);
    },
    0
  );
  const pdfDocument =
    globalState.divisionType !== DivisionTypes.Village ? (
      <UpdatedPDFReport
        colors={colors}
        totalDivisions={allDivisionsLength}
        RegionType={globalState.divisionType}
        regTypeUrl={regionTypeUrl}
        Region={globalState.selectedDivision?.division}
        State={globalState.selectedDivision?.state}
        image={image}
        mapImageDistrict={
          mapImageDistrict !== "" ? mapImageDistrict : undefined
        }
        reportHasData={reportHasData({
          tableOfIndicators,
          topIndicatorsChange,
          indicatorsPerDecile,
          indicatorsAmountPerChange,
          improvementRanking,
          indicatorsBetterThan,
        })}
        mapImageState={mapImageState !== "" ? mapImageState : undefined}
        indicatorsBetterThan={indicatorsBetterThan}
        improvementRanking={improvementRanking}
        topIndicatorsChange={topIndicatorsChange}
        tableOfIndicators={tableOfIndicators}
        currentLanguage={currentLanguage}
      />
    ) : (
      <UpdatedPDFReportVillage
        colors={colors}
        indicatorsBetterThan={indicatorsBetterThan}
        RegionType={globalState.divisionType}
        Region={state.selectedDivision?.village}
        image={image}
        mapImageDistrict={
          mapImageDistrict !== "" ? mapImageDistrict : undefined
        }
        mapImageVillage={mapImageVillage !== "" ? mapImageVillage : undefined}
        parentDivision={
          state.selectedDivision?.district?.name &&
          state.selectedDivision?.district?.parentName &&
          `${state.selectedDivision?.district?.name}, ${state.selectedDivision?.district?.parentName}`
        }
        tableOfIndicators={tableOfIndicators}
      />
    );

  const [instance, updateInstance] = usePDF({
    document: pdfDocument,
  });

  useEffect(() => {
    var ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var documentScrollLeft = window.scrollX;
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          if (documentScrollLeft !== 0) {
            window.scrollTo(0, scrollTop);
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    updateInstance(pdfDocument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalState.divisionType,
    globalState.selectedDivision?.division?.id,
    globalState.selectedDivision?.state?.id,
    state.selectedDivision?.village?.id,
    state.selectedDivision?.district?.id,
    allDivisionsLength,
    image,
    mapImageDistrict,
    mapImageState,
    mapImageVillage,
    currentLanguage,
    tableOfIndicators,
    topIndicatorsChange,
    improvementRanking,
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (instance.loading) {
      setLoading(instance.loading);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);
    return () => {
      clearTimeout(timer);
    };
  }, [
    instance.loading,
    currentLanguage,
    globalState.selectedDivision?.division?.id,
    globalState.selectedDivision?.village?.id,
  ]);

  return (
    <div className={styles.container}>
      <CreateReportSidebar
        setPage={setPage}
        page={page}
        mapImageState={mapImageState}
        mapImageDistrict={mapImageDistrict}
        mapImageVillage={mapImageVillage}
        tableOfIndicators={tableOfIndicators}
        topIndicatorsChange={topIndicatorsChange}
        indicatorsPerDecile={indicatorsPerDecile}
        indicatorsAmountPerChange={indicatorsAmountPerChange}
        improvementRanking={improvementRanking}
        indicatorsBetterThan={indicatorsBetterThan}
      />
      {loading ? (
        <LoadingScreen loading />
      ) : (
        <div ref={containerRef} className={styles.content}>
          {isDesktop ? (
            <iframe
              title={`${globalState.selectedDivision?.division?.name} report`}
              src={`${instance.url}#toolbar=0`}
              className={`${styles.PDFViewer}`}
            />
          ) : (
            <BlobProvider document={pdfDocument}>
              {({ url, loading }) => {
                return loading ? null : (
                  <Document
                    file={url}
                    className={`${styles.PDFViewer}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    renderMode="canvas">
                    {pages
                      ? pages.map((_: any, i: number) => {
                          return (
                            <Page
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              pageNumber={i + 1}
                              width={containerRef.current?.clientWidth}
                            />
                          );
                        })
                      : null}
                  </Document>
                );
              }}
            </BlobProvider>
          )}
        </div>
      )}
      <div className={styles.mapGeneratorsContainer}>
        {globalState.divisionType !== DivisionTypes.Village ? (
          <>
            <div
              style={{
                zIndex: "-1",
                position: "absolute",
                width: "370px",
                height: "180px",
              }}>
              <MapDistrict
                mapId="REACT-MAP-GL"
                colorDecile="#A51C30"
                setImage={setMapImageDistrict}
              />
            </div>
            <div
              style={{
                zIndex: "-1",
                position: "absolute",
                width: "370px",
                height: "180px",
              }}>
              <MapState
                colorDecile="#A51C30"
                mapId="REACT-MAP-GL-1"
                setImage={setMapImageState}
              />
            </div>
          </>
        ) : (
          <div style={{ marginTop: "-400px" }}>
            <div
              style={{
                zIndex: "-1",
                position: "absolute",
                width: "555px",
                height: "270px",
              }}>
              <MapDistrictVillage
                divisionType={globalState.divisionType}
                mapId="REACT-DISTRICT-VILLAGE-MAP-GL"
                colorDecile="#A51C30"
                setImage={setMapImageDistrict}
              />
            </div>
            <div
              style={{
                zIndex: "-1",
                position: "absolute",
                width: "370px",
                height: "180px",
              }}>
              <MapVillage
                divisionType={globalState.divisionType}
                colorDecile="#A51C30"
                mapId="REACT-VILLAGE-MAP-GL"
                setImage={(str) => {
                  setMapImageVillage(str);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          zIndex: "-1",
          position: "absolute",
          width: "370px",
          height: "180px",
        }}>
        <Doughnut
          id="doughnut-chart"
          dataNum={
            globalState.divisionType !== DivisionTypes.Village
              ? indicatorsAmountPerChange.length
                ? indicatorsAmountPerChange.map(
                    (indicator) => indicator.indicatorCount
                  )
                : [12, 19, 3, 5]
              : !!indicatorsPerDecile.length
              ? indicatorsPerDecile.map((indicator) => indicator.count)
              : [40, 11, 7, 3, 12, 5, 8, 24, 12, 15]
          }
          backgroundColor={
            globalState.divisionType !== DivisionTypes.Village
              ? ["#1D9744", "#95C35F", "#E39C57", "#D7191C"]
              : [
                  "#086192",
                  "#008DD2",
                  "#44A3DB",
                  "#8BC4F2",
                  "#ABC4CC",
                  "#CCB1B1",
                  "#F4A294",
                  "#EE7A62",
                  "#E94E3A",
                  "#E31E24",
                ]
          }
          setImage={setImage}
        />
      </div>
    </div>
  );
};

export default NewPDFReport;
