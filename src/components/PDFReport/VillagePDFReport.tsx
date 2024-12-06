import { FC, useState, useEffect } from "react";
import { Page, View, Document, StyleSheet } from "@react-pdf/renderer";
import Footer from "components/PDFComponents/Footer";
import Header from "components/PDFComponents/Header";
import VillageData from "components/PDFComponents/VillageData";
import Sources from "components/PDFComponents/Sources";
import { indicator } from "models/indicator";
import { division } from "models/divisions";
import { DivisionTypes } from "context/globalContext";
import { getMeasurements } from "api/getMeasurements";
import { useTranslation } from "react-i18next";

const PDFReport: FC<{
  indicators?: indicator[];
  RegionType: DivisionTypes;
  Region?: division;
  StateId: number;
  parentDivisions?: string;
}> = ({ indicators, RegionType, Region, StateId, parentDivisions }) => {
  const [indicatorsData, setIndicatorsData] = useState<indicator[]>();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  useEffect(() => {
    const controller = new AbortController();
    if (indicators?.length !== 0) {
      getMeasurements<indicator[]>({
        StateId,
        RegionType,
        RegionId: Region?.id!,
        Year: 2016,
        YearEnd: 2021,
        controller: controller,
        Indicators: indicators!.map((indicator) => {
          return indicator.indId!;
        }),
        currentLanguage,
      }).then((data: any) => {
        const sortedIndicators = indicators!.sort(
          (a: indicator, b: indicator) => {
            return a.indId! - b.indId!;
          }
        );
        const sortedData = data.region.sort((a: indicator, b: indicator) => {
          return a.indId! - b.indId!;
        });
        setIndicatorsData(
          sortedIndicators.map((indicator, index) => {
            const {
              prevalence,
              prevalenceEnd,
              prevalenceColor,
              prevalenceEndColor,
            } = sortedData[index] ?? {};
            return {
              ...indicator,
              prevalence,
              prevalenceEnd,
              prevalenceColor,
              prevalenceEndColor,
            };
          })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, Region, currentLanguage]);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            paddingHorizontal: "15pt",
          }}>
          <Header
            RegionName={
              Region?.name !== undefined
                ? Region.name
                : `${RegionType?.replace("_", " ")?.replace("ies", "y")}`
            }
            parentDivision={
              parentDivisions !== undefined
                ? parentDivisions!
                : "District, State"
            }
          />
          <View
            style={{
              height: "770pt",
              width: "100%",
              marginBottom: 15,
            }}>
            <VillageData indicators={indicatorsData!} />
            <View style={{ position: "absolute", bottom: 0 }}>
              <Sources />
            </View>
          </View>
        </View>
        <Footer />
      </Page>
    </Document>
  );
};
export default PDFReport;

const styles = StyleSheet.create({
  page: {
    paddingTop: "13.5pt",
    flexDirection: "column",
  },
});
