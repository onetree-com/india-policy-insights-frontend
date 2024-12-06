import { View, Text, StyleSheet } from "@react-pdf/renderer";
import NumberOfIndicators from "./NumberOfIndicators";
import IndicatorChangeSummaryPDF from "./IndicatorChangeSummaryPDF";
import { FC } from "react";
import {
  ImprovementRanking,
  IndicatorsBetterThan,
  TopIndicatorsChange,
} from "models/indicator";
import TextTranslation from "./TextTranslation";

interface Props {
  image: string;
  indicatorsBetterThan: IndicatorsBetterThan[];
  improvementRanking?: ImprovementRanking;
  topIndicatorsChange: TopIndicatorsChange[][];
  divisionType: string;
  totalDivisions: number;
  currentLanguage?: string;
}

const IndicatorSummaryNewPDFReport: FC<Props> = ({
  image,
  indicatorsBetterThan,
  improvementRanking,
  topIndicatorsChange,
  divisionType,
  totalDivisions,
  currentLanguage,
}) => (
  <View style={styles.indicatorContainer}>
    <View style={styles.indicator}>
      <View style={styles.indicatorText}>
        <TextTranslation style={styles.primaryText} tkey="indicator_summary" />
        <Text style={styles.secondaryText}>(2021)</Text>
      </View>
      <NumberOfIndicators
        type="allindia"
        value={
          indicatorsBetterThan.length === 0
            ? 0
            : indicatorsBetterThan[0].betterThanAverage
        }
        total={
          indicatorsBetterThan.length === 0
            ? 0
            : indicatorsBetterThan[0].totalIndicators
        }
      />
      <NumberOfIndicators
        type="state"
        value={
          indicatorsBetterThan.length === 0
            ? 0
            : indicatorsBetterThan[1].betterThanAverage
        }
        total={
          indicatorsBetterThan.length === 0
            ? 0
            : indicatorsBetterThan[1].totalIndicators
        }
      />
    </View>
    <View style={styles.indicatorChange}>
      <View style={styles.indicatorText}>
        <TextTranslation
          style={styles.primaryText}
          tkey="indicator_change_summary"
        />
        <Text> </Text>
        <TextTranslation
          style={styles.secondaryText}
          tkey="between_2016_2021"
        />
      </View>
      <IndicatorChangeSummaryPDF
        image={image}
        divisionType={divisionType}
        totalDivisions={totalDivisions}
        improvementRanking={improvementRanking}
        topIndicatorsChange={topIndicatorsChange}
        currentLanguage={currentLanguage}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  indicatorContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderTop: "1px solid #A92D38",
    borderBottom: "1px solid #A92D38",
  },
  indicator: {
    display: "flex",
    flexDirection: "column",
    width: "35%",
    alignItems: "center",
    paddingVertical: 20,
    borderRight: "1px solid #A92D38",
  },
  indicatorChange: {
    display: "flex",
    flexDirection: "column",
    width: "65%",
    alignItems: "center",
    paddingVertical: 20,
  },
  indicatorText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  primaryText: {
    color: "#A92D38",
    fontSize: "12pt",
    fontWeight: 600,
    fontFamily: "Helvetica",
    fontStyle: "normal",
  },
  secondaryText: {
    color: "#B74F59",
    fontSize: "9pt",
    fontWeight: 400,
  },
});

export default IndicatorSummaryNewPDFReport;
