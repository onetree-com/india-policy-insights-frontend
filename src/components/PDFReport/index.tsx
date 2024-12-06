import { FC, useState, useEffect } from "react";
import {
  Page,
  View,
  Document,
  StyleSheet,
  Text,
  Font,
} from "@react-pdf/renderer";
import Footer from "components/PDFComponents/Footer";
import Header from "components/PDFComponents/Header";
import IndicatorData from "components/PDFComponents/IndicatorData";
import HeadcountAndRanking from "components/PDFComponents/HeadcountAndRanking";
import { indicator } from "models/indicator";
import { division } from "models/divisions";
import { DivisionTypes } from "context/globalContext";
import { getMeasurements } from "api/getMeasurements";
import { useTranslation } from "react-i18next";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";

Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });

const PDFReport: FC<{
  indicator?: indicator;
  RegionType: DivisionTypes;
  Region?: division;
  State?: { name: string; id: number };
  demographicProfile?: {
    population: number;
    density: number;
    female: number;
    male: number;
    literate: number;
  };
  mapImagePrevalence?: string;
  mapImageHeadcount?: string;
}> = ({
  indicator,
  RegionType,
  Region,
  State,
  demographicProfile,
  mapImagePrevalence,
  mapImageHeadcount,
}) => {
  const [indicatorData, setIndicatorData] = useState<Partial<indicator>>();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    if (indicator?.indId !== undefined && RegionType !== undefined) {
      getMeasurements<indicator>({
        RegionType,
        RegionId: Region?.id!,
        Year: 2016,
        YearEnd: 2021,
        Indicators: [indicator?.indId!],
        StateId: State?.id!,
        currentLanguage,
      }).then((data: any) => {
        setIndicatorData({
          ...data.region[0],
          stateValue: data.state[0].prevalenceEnd,
          allIndia: data.allIndia[0].prevalenceEnd,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicator, Region, currentLanguage]);
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
                : `${t(RegionType)?.replace("_", " ")?.replace("ies", "y")}`
            }
            parentDivision={
              State?.name !== undefined ? State.name! : t("state")
            }
          />
          <View
            style={{
              width: "100%",
              height: "100%",
            }}>
            <IndicatorData
              prevalence={indicatorData?.prevalence ?? 0}
              prevalenceEnd={indicatorData?.prevalenceEnd ?? 0}
              headcount={indicatorData?.headcount ?? 0}
              stateValue={indicatorData?.stateValue ?? 0}
              indiaValue={indicatorData?.allIndia ?? 0}
              indicatorName={indicator?.indName}
              indDescription={indicator?.indDescription}
              indReadingStrategy={indicatorData?.indReadingStrategy}
              mapImage={mapImagePrevalence}
            />
            <HeadcountAndRanking
              Region={Region?.name !== undefined ? Region.name : RegionType}
              RegionType={RegionType}
              IndName={indicator?.indName!}
              PrevalenceRanking={indicatorData?.prevalenceRank!}
              HeadcountRanking={indicatorData?.headcountRank!}
              mapImage={mapImageHeadcount}
            />
            {/* TODO integrate ^^ hardcoded numbers to backend */}
            <View style={styles.container}>
              <Text
                style={[
                  currentLanguage === "en" ? styles.text : styles.textHi,
                  { fontSize: "12pt", color: "#A51C30", marginBottom: "10px" },
                ]}>
                {t("acknowledgments_title")}:
              </Text>
              <Text
                style={[
                  currentLanguage === "en" ? styles.text : styles.textHi,
                  { fontSize: "10pt", marginBottom: "10px" },
                ]}>
                {t("acknowledgments_description")}
              </Text>
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
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: "8.25pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
    fontWeight: 300,
  },
  textHi: {
    fontFamily: "Noto Sans Devanagari",
    fontSize: "8.25pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
    fontWeight: 300,
  },
});
