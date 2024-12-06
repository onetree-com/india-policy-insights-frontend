import { FC } from "react";
import { Page, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { DivisionTypes } from "context/globalContext";
import { division } from "models/divisions";
import HeaderNewPDFReport from "./HeaderNewPDFReport";
import MapContainerNewPDFReport from "./MapContainerNewPDFReport";
import IndicatorSummaryNewPDFReport from "./IndicatorSummaryNewPDFReport";
import FooterNewPDFReport from "./FooterNewPDFReport";
import HeaderNewPagesPDF from "./HeaderNewPagesPDF";
import CustomTablePDF from "./CustomTablePDF";
import NotesPDF from "./NotesPDF";
import GovermentsIndiaPDF from "./GovermentsIndiaPDF";
import Footer from "components/PDFComponents/Footer";
import {
  ImprovementRanking,
  IndicatorsBetterThan,
  TableOfIndicators,
  TopIndicatorsChange,
} from "models/indicator";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import TextTranslation from "./TextTranslation";
Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });

interface Props {
  RegionType: DivisionTypes;
  regTypeUrl: string;
  Region?: division;
  State?: { name: string; id: number };
  image: string;
  mapImageDistrict?: string;
  mapImageState?: string;
  indicatorsBetterThan: IndicatorsBetterThan[];
  improvementRanking?: ImprovementRanking;
  topIndicatorsChange: TopIndicatorsChange[][];
  tableOfIndicators: TableOfIndicators[];
  totalDivisions: number;
  reportHasData?: boolean;
  colors: {
    [key: number]: string;
  };
  currentLanguage?: string;
}

const UpdatedPDFReport: FC<Props> = ({
  RegionType,
  regTypeUrl,
  Region,
  State,
  image,
  mapImageState,
  mapImageDistrict,
  indicatorsBetterThan,
  improvementRanking,
  topIndicatorsChange,
  tableOfIndicators,
  totalDivisions,
  reportHasData,
  colors,
  currentLanguage,
}) => {
  const data =
    tableOfIndicators.length > 0
      ? tableOfIndicators?.map((item) => ({
          id: item.catId,
          subText: item.catName,
          items: item.indicators.map((indicator) => ({
            indId: indicator.indId,
            indicator: indicator.name,
            programs: indicator.goiAbv,
            india: indicator.indiaPrevalence,
            state: indicator.statePrevalence,
            change: indicator.change,
            district: indicator.regionPrevalence,
            colorChange: colors[indicator.prevalenceChangeCategory],
          })),
        }))
      : [];

  const tkeysDivisions = (regionType: any) => {
    switch (regionType) {
      case "districts":
        return {
          divisionNotes: {
            title: "dist_2021",
            subtitle: "district_notes_desc",
          },
          rank: {
            title: "district_rank",
            subtitle: "district_rank_desc",
          },
          division: "District",
          divisionPlural: "districts",
          headerKey: "dist_2021",
        };
      case "assembly-constituencies":
        return {
          divisionNotes: {
            title: "ac_2021",
            subtitle: "ac_pc_notes_description",
          },
          rank: {
            title: "ac_rank",
            subtitle: "ac_rank_desc",
          },
          division: "Assembly Constituency",
          divisionPlural: "ACs",
          headerKey: "ac_2021",
        };
      case "parliamentary-constituencies":
        return {
          divisionNotes: {
            title: "pc_2021",
            subtitle: "ac_pc_notes_description",
          },
          rank: {
            title: "pc_rank",
            subtitle: "pc_rank_desc",
          },
          division: "Parliamentary Constituency",
          divisionPlural: "PCs",
          headerKey: "pc_2021",
        };
      default:
        return {
          divisionNotes: {
            title: "",
            subtitle: "",
          },
          rank: {
            title: "",
            subtitle: "",
          },
          division: "",
          divisionPlural: "",
          headerKey: "",
        };
    }
  };

  const header = [
    "indicator_perc",
    "goi_programs",
    "india_2021",
    "state_2021",
    tkeysDivisions(regTypeUrl)?.headerKey!,
    "change_2021_2016Header",
  ];
  const notes = [
    {
      title: "india_2021",
      subtitle: "india_notes_desc",
    },
    {
      title: "state_2021",
      subtitle: "state_2021_desc",
    },
    tkeysDivisions(regTypeUrl)?.divisionNotes!,
    {
      title: "change_2021_2016",
      subtitle: [
        "change_2021_2016_desc_1",
        tkeysDivisions(regTypeUrl)?.division!,
        "change_2021_2016_desc_2",
        tkeysDivisions(regTypeUrl)?.divisionPlural!,
      ],
    },
    {
      title: "data_rounding",
      subtitle: "data_rounding_notes_desc",
    },
    tkeysDivisions(regTypeUrl)?.rank!,
  ];
  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <HeaderNewPDFReport title={RegionType} />
          <MapContainerNewPDFReport
            {...{
              RegionType,
              Region,
              State,
              mapImageState,
              mapImageDistrict,
              currentLanguage,
            }}
          />
          {RegionType !== "Assembly Constituencies" ||
          Region === undefined ||
          reportHasData ? (
            <IndicatorSummaryNewPDFReport
              indicatorsBetterThan={indicatorsBetterThan}
              divisionType={RegionType}
              totalDivisions={totalDivisions}
              image={image}
              improvementRanking={improvementRanking}
              topIndicatorsChange={topIndicatorsChange}
              currentLanguage={currentLanguage}
            />
          ) : (
            <TextTranslation
              style={{
                marginTop: 16,
                color: "#A92D38",
                fontSize: "12pt",
                fontWeight: 600,
                fontFamily: "Helvetica",
                fontStyle: "normal",
              }}
              tkey="no_data_available"></TextTranslation>
          )}
          <FooterNewPDFReport />
        </View>
      </Page>
      <Page size="A4" style={{ paddingBottom: "30pt" }}>
        <View style={{ ...styles.container, paddingVertical: 0 }}>
          {RegionType !== "Assembly Constituencies" ||
          Region === undefined ||
          reportHasData ? (
            <>
              <View
                render={({ pageNumber, totalPages }: any) => {
                  return (
                    <View
                      style={{ marginBottom: "20pt", marginTop: "15pt" }}
                      fixed>
                      <HeaderNewPagesPDF
                        title={`${pageNumber} of ${totalPages}`}
                      />
                    </View>
                  );
                }}
                fixed
              />
              <CustomTablePDF
                header={header}
                data={data}
                currentLanguage={currentLanguage}
              />
            </>
          ) : null}
          <NotesPDF notes={notes} bottomLine={false} />
        </View>
      </Page>
      <Page size="A4">
        <View style={{ ...styles.container, position: "relative" }}>
          <View
            render={({ pageNumber, totalPages }: any) => {
              return (
                <HeaderNewPagesPDF title={`${pageNumber} of ${totalPages}`} />
              );
            }}
          />
          <GovermentsIndiaPDF />
        </View>
        <View
          style={{ ...{ position: "absolute", bottom: 0, right: 0, left: 0 } }}>
          <Footer />
        </View>
      </Page>
    </Document>
  );
};

export default UpdatedPDFReport;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Helvetica",
  },
});
