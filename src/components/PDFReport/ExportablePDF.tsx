import { FC, useState, useEffect } from "react";
import { Page, View, Document, StyleSheet } from "@react-pdf/renderer";
import Footer from "components/PDFComponents/Footer";
import Header from "components/PDFComponents/Header";
import IndicatorData from "components/PDFComponents/IndicatorData";
import Sources from "components/PDFComponents/Sources";
import HeadcountAndRanking from "components/PDFComponents/HeadcountAndRanking";
import { indicator } from "models/indicator";
import { DivisionTypes } from "context/globalContext";
import { division } from "models/divisions";
import { getMeasurements } from "api/getMeasurements";
import { useTranslation } from "react-i18next";

const parseData = (indicators: any, data: any) => {
  return indicators.map((ind: any) => {
    return {
      ...ind,
      ...data.region.find((i: any) => {
        return i.indId === ind.indId;
      }),
    };
  });
};

const ExportablePDF: FC<{
  mapImagePrevalence?: string;
  mapImageHeadcount?: string;
  indicators?: Partial<indicator>[];
  RegionType: DivisionTypes;
  Region?: division;
  setIsLoading: any;
  State: { name: string; id: number };
}> = ({
  indicators,
  RegionType,
  Region,
  State,
  setIsLoading,
  mapImagePrevalence,
  mapImageHeadcount,
}) => {
  const [indicatorsData, setIndicatorsData] = useState<Partial<indicator>[]>();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const normalizeData = (
    allIndia: indicator[],
    stateValues: indicator[],
    indicators: indicator[]
  ): Partial<indicator>[] => {
    const result: Partial<indicator>[] = [];
    if (indicators) {
      indicators.forEach((indicator) => {
        let allIndiaIndicator = allIndia.find((allIndiaInd: indicator) => {
          return allIndiaInd.indId === indicator.indId;
        });
        let stateIndicator = stateValues.find((stateInd: indicator) => {
          return stateInd.indId === indicator.indId;
        });

        result.push({
          ...indicator,
          prevalence: indicator.prevalence,
          prevalenceEnd: indicator.prevalenceEnd,
          prevalenceRank: indicator.prevalenceRank,
          headcountRank: indicator.headcountRank,
          prevalenceColor: indicator?.prevalenceColor?.slice(0, 7),
          allIndia: allIndiaIndicator?.prevalence!,
          stateValue: stateIndicator?.prevalence!,
        });
      });
      return result;
    } else {
      return result;
    }
  };

  useEffect(() => {
    if (indicators && indicators.length > 0) {
      setIsLoading(true);
      getMeasurements<indicator>({
        RegionType,
        RegionId: Region?.id!,
        Year: 2016,
        YearEnd: 2021,
        Indicators: indicators!.map((indicator) => {
          return indicator.indId!;
        }),
        StateId: State?.id!,
        currentLanguage,
      }).then((data: any) => {
        //set indicatorsData as empty array to cause PDF component to delete all pages to prevent duplications and wrong page counts.
        setIndicatorsData([]);
        setIndicatorsData(
          normalizeData(data.allIndia, data.state, parseData(indicators, data))
        );
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators, Region?.id, currentLanguage]);

  return (
    <Document>
      {indicatorsData
        ? indicatorsData.map((indicator) => {
            const ind = indicators?.find((i) => i.indId === indicator.indId);
            return (
              <Page key={indicator.indId} size="A4" style={styles.page}>
                <View
                  style={{
                    paddingHorizontal: "15pt",
                  }}>
                  <Header
                    RegionName={
                      Region?.name !== undefined ? Region.name : "District"
                    }
                    parentDivision={
                      State.name !== undefined ? State.name! : "State"
                    }
                  />
                  <View
                    style={{
                      height: "770pt",
                      width: "100%",
                      marginBottom: 15,
                    }}>
                    <IndicatorData
                      prevalence={indicator?.prevalence ?? 0}
                      prevalenceEnd={indicator?.prevalenceEnd ?? 0}
                      headcount={indicator?.headcount ?? 0}
                      stateValue={indicator.stateValue ?? 0}
                      indiaValue={indicator.allIndia ?? 0}
                      indicatorName={indicator?.indName}
                      indDescription={ind?.indDescription}
                      indReadingStrategy={indicator?.indReadingStrategy}
                      mapImage={mapImagePrevalence}
                    />
                    <HeadcountAndRanking
                      Region={
                        Region?.name !== undefined ? Region.name : RegionType
                      }
                      RegionType={RegionType}
                      IndName={indicator?.indName!}
                      PrevalenceRanking={indicator?.prevalenceRank!}
                      HeadcountRanking={indicator?.headcountRank!}
                      mapImage={mapImageHeadcount}
                    />
                    {/* TODO integrate ^^ hardcoded numbers to backend */}
                    <Sources />
                  </View>
                </View>
                <Footer />
              </Page>
            );
          })
        : null}
    </Document>
  );
};
export default ExportablePDF;

const styles = StyleSheet.create({
  page: {
    paddingTop: "13.5pt",
    flexDirection: "column",
  },
});
