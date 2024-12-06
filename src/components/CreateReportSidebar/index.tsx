import { usePDF } from "@react-pdf/renderer";
import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import styles from "components/CreateReportSidebar/styles.module.scss";
import Loader from "components/Loader";
import StateDistrictFilter from "components/StateDistrictFilter";
import Text from "components/Text";
import { CreateReportContext } from "context/createReportContext/index";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import { useTranslation } from "react-i18next";
import UpdatedPDFReportVillage from "components/NewPDFReport/UpdatedPDFReportVillage";
import UpdatedPDFReport from "components/NewPDFReport/UpdatedPDFReport";
import Doughnut from "components/NewPDFReport/Doughnut";
import { useLocation } from "react-router-dom";
import {
  ImprovementRanking,
  IndicatorsAmountPerChange,
  IndicatorsBetterThan,
  IndicatorsPerDecile,
  TableOfIndicators,
  TopIndicatorsChange,
} from "models/indicator";
import { reportHasData } from "utils/reportHasData";

const CreateReportSidebar: FC<{
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  mapImagePrevalence?: string;
  mapImageHeadcount?: string;
  mapImageDistrict?: string;
  mapImageState?: string;
  mapImageVillage?: string;
  tableOfIndicators: TableOfIndicators[];
  topIndicatorsChange: TopIndicatorsChange[][];
  indicatorsPerDecile: IndicatorsPerDecile[];
  indicatorsAmountPerChange: IndicatorsAmountPerChange[];
  improvementRanking: ImprovementRanking | undefined;
  indicatorsBetterThan: IndicatorsBetterThan[];
}> = ({
  setPage,
  page,
  mapImagePrevalence,
  mapImageHeadcount,
  mapImageDistrict,
  mapImageState,
  mapImageVillage,
  tableOfIndicators,
  topIndicatorsChange,
  indicatorsPerDecile,
  indicatorsAmountPerChange,
  improvementRanking,
  indicatorsBetterThan,
}) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [expand, setExpand] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const { globalState } = useContext(GlobalContext)!;
  const { state } = useContext(CreateReportContext)!;
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const { pathname } = useLocation();
  const regionTypeUrl = pathname.split("/")[2];

  const colors: { [key: number]: string } = {
    1: "#1D9744",
    2: "#95C35F",
    3: "#E39C57",
    4: "#D7191C",
  };
  const allDivisionsLength = globalState.allDivisions.reduce(
    (preValue, currValue) => {
      return (preValue += currValue.subregions.length);
    },
    0
  );

  const pdfDocument =
    globalState.divisionType !== DivisionTypes.Village ? (
      <UpdatedPDFReport
        regTypeUrl={regionTypeUrl}
        totalDivisions={allDivisionsLength}
        colors={colors}
        RegionType={globalState.divisionType}
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

  const selectedDivision: any =
    globalState.divisionType !== DivisionTypes.Village
      ? globalState.selectedDivision
      : state.selectedDivision;

  const downloadButton =
    selectedDivision && Object.entries(selectedDivision).length >= 2 ? (
      <a
        href={instance.loading ? "-" : instance.url!}
        className={styles.PDFDownloadLink}
        download={`${new Date().getUTCDate()}_${
          new Date().getUTCMonth() + 1
        }_${new Date().getFullYear()} ${
          globalState.divisionType !== DivisionTypes.Village
            ? globalState.selectedDivision?.division?.name
            : state.selectedDivision?.village?.name
        } Report.pdf`}>
        {instance.loading ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : null}
        <Text
          weight={700}
          color="white"
          textAlign="center"
          size="14px"
          lineHeight="16.1px">
          {Object.entries(selectedDivision!).length >= 2
            ? instance.loading
              ? t("creating_report")
              : t("download_pdf")
            : t("create_report_button")}
        </Text>
      </a>
    ) : (
      <button
        id="create-report"
        className={`${styles.PDFDownloadLink} ${styles.disabled}`}
        disabled={true}>
        <Text
          weight={700}
          color="white"
          textAlign="center"
          size="14px"
          lineHeight="16.1px">
          {t("create_report_button")}
        </Text>
      </button>
    );

  const content = (
    <div className={styles.PDFControls}>
      {expand || isDesktop ? (
        <>
          <StateDistrictFilter
            selectedDivision={
              state.selectedDivision &&
              Object.keys(state.selectedDivision).length !== 0
                ? {
                    parent: {
                      id: state.selectedDivision?.district?.id,
                      name: state.selectedDivision?.district?.name,
                    },
                    division: state.selectedDivision?.village,
                  }
                : undefined
            }
          />
          {/* <Indicator
            allIndicators={globalState.indicators}
            selectedIndicatorsFlat={state.selectedIndicators}
            dispatch={dispatch}
          /> */}
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
        </>
      ) : null}
      <div className={styles.controls}>{downloadButton}</div>
    </div>
  );
  return (
    <>
      <div
        style={{ padding: !isDesktop && !expand ? "16px" : "" }}
        className={styles.container}>
        {isDesktop ? (
          content
        ) : (
          <div
            className={styles.mobile}
            style={{ alignItems: `${expand ? "center" : "flex-start"}` }}>
            {expand ? (
              content
            ) : (
              <div className={styles.expanded}>
                <Text
                  style={{ marginTop: "10px" }}
                  size="10px"
                  lineHeight="11.5px"
                  weight={300}>
                  SETTINGS
                </Text>
                <Text
                  style={{ marginTop: "8px" }}
                  lineHeight="24px"
                  weight={400}
                  size="14px"
                  color="#5E6771">
                  {globalState.divisionType !== DivisionTypes.Village
                    ? selectedDivision?.division?.name
                    : selectedDivision?.village?.name}
                  ,{" "}
                  {globalState.divisionType !== DivisionTypes.Village
                    ? selectedDivision?.state?.name
                    : selectedDivision?.district?.name}
                </Text>
                {content}
              </div>
            )}
          </div>
        )}
      </div>
      {!isDesktop && (
        <div
          className={styles.bottomLine}
          onClick={(): void => setExpand(!expand)}>
          {expand ? (
            <ExpandUp color="#504F54" />
          ) : (
            <ExpandDown color="#242328" />
          )}
        </div>
      )}
    </>
  );
};
export default CreateReportSidebar;
