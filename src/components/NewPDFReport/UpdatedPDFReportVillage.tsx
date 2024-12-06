import { Page, View, Document, StyleSheet } from "@react-pdf/renderer";
import HeaderNewPDFReport from "./HeaderNewPDFReport";
import FooterNewPDFReport from "./FooterNewPDFReport";
import MapVillageContainerNewPDFReport from "./MapVillageContainerNewPDFReport";
import { division } from "models/divisions";
import { DivisionTypes } from "context/globalContext";
import { FC } from "react";
import IndicatorSummaryVillage from "./IndicatorSummaryVillage";
import NotesPDF from "./NotesPDF";
import HeaderNewPagesPDF from "./HeaderNewPagesPDF";
import CustomTablePDF from "./CustomTablePDF";
import GovermentsIndiaPDF from "./GovermentsIndiaPDF";
import Footer from "components/PDFComponents/Footer";
import { IndicatorsBetterThan, TableOfIndicators } from "models/indicator";

interface Props {
  RegionType: DivisionTypes;
  Region?: division;
  parentDivision?: string;
  image: string;
  indicatorsBetterThan: IndicatorsBetterThan[];
  colors: { [key: number]: string };
  tableOfIndicators: TableOfIndicators[];
  mapImageDistrict?: string;
  mapImageVillage?: string;
}

const UpdatedPDFReportVillage: FC<Props> = ({
  RegionType,
  Region,
  parentDivision,
  image,
  indicatorsBetterThan,
  colors,
  tableOfIndicators,
  mapImageDistrict,
  mapImageVillage,
}) => {
  const header = [
    "indicator_perc",
    "goi_programs",
    "india",
    "District",
    "village",
  ];
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
            district: indicator.statePrevalence,
            village: indicator.regionPrevalence,
            colorChange: colors[indicator.prevalenceChangeCategory],
          })),
        }))
      : [];
  const notes = [
    {
      title: "india",
      subtitle: "india_notes_desc",
    },
    {
      title: "District",
      subtitle: "district_notes_desc",
    },
    {
      title: "village",
      subtitle: "village_notes_desc",
    },
    {
      title: "data_rounding",
      subtitle: "data_rounding_notes_desc",
    },
  ];
  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <HeaderNewPDFReport title={"Villages"} />
          <MapVillageContainerNewPDFReport
            {...{ RegionType, Region, parentDivision }}
            mapImageVillage={mapImageVillage}
            mapImageDistrict={mapImageDistrict}
          />
          <IndicatorSummaryVillage
            indicatorsBetterThan={indicatorsBetterThan}
            image={image}
          />
          <NotesPDF notes={notes} />
          <FooterNewPDFReport />
        </View>
      </Page>
      <Page size="A4" style={{ paddingBottom: "30pt" }}>
        <View style={{ ...styles.container, paddingVertical: 0 }}>
          <View
            render={({ pageNumber, totalPages }: any) => {
              return (
                <View style={{ marginBottom: "20pt", marginTop: "15pt" }} fixed>
                  <HeaderNewPagesPDF title={`${pageNumber} of ${totalPages}`} />
                </View>
              );
            }}
            fixed
          />
          <CustomTablePDF {...{ data, header, type: "village" }} />
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
          style={{
            ...{ position: "absolute", bottom: 0, right: 0, left: 0 },
          }}>
          <Footer />
        </View>
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Helvetica",
  },
});

export default UpdatedPDFReportVillage;
