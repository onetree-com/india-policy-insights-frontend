import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import TextWithDot from "./TextWithDot";
import IndicatorChangeSummaryListPDF from "./IndicatorChangeSummaryListPDF";
import { FC } from "react";
import { ImprovementRanking, TopIndicatorsChange } from "models/indicator";
import TextTranslation from "./TextTranslation";
import { useTranslation } from "react-i18next";

interface Props {
  image: string;
  improvementRanking?: ImprovementRanking;
  topIndicatorsChange: TopIndicatorsChange[][];
  divisionType: string;
  totalDivisions: number;
  currentLanguage?: string;
}

const IndicatorChangeSummaryPDF: FC<Props> = ({
  image,
  improvementRanking,
  topIndicatorsChange,
  divisionType,
  totalDivisions,
  currentLanguage,
}) => {
  const tkeys = {
    Districts: "districts",
    "Assembly Constituencies": "ACs",
    "Parliamentary Constituencies": "PCs",
  };
  const { i18n } = useTranslation();
  const listWorsened =
    topIndicatorsChange.length > 0
      ? topIndicatorsChange[0]?.map((item) => item.indicator)
      : [];
  const listImprovement =
    topIndicatorsChange.length > 0
      ? topIndicatorsChange[1]?.map((item) => item.indicator)
      : [];
  return (
    <>
      <View style={styles.container}>
        <View style={{ ...styles.side, marginRight: 10 }}>
          <TextTranslation
            style={{ ...styles.text, color: "#757575", textAlign: "center" }}
            tkey="ranking_based_on_percentage"
          />

          <Text
            style={{ ...styles.text, color: "#757575", textAlign: "center" }}>
            <TextTranslation tkey="showing" />{" "}
            <TextTranslation
              style={{
                ...styles.text,
                color: "#1D9744",
              }}
              tkey="any_improvement"
            />{" "}
            (<TextTranslation tkey="out_of" /> {totalDivisions}{" "}
            <TextTranslation tkey={tkeys[divisionType as keyof typeof tkeys]} />
            )
          </Text>
          <View style={styles.centerCircle}>
            <View style={styles.circle}>
              <Text
                style={{
                  color: "#666666",
                  fontSize: "30pt",
                  fontWeight: 700,
                  fontFamily: "Helvetica-Bold",
                  fontStyle: "bold",
                }}>
                {improvementRanking?.ranking ?? 0}
              </Text>
              <Text style={{ ...styles.text, color: "#666666" }}>
                <TextTranslation tkey="shared_by" />{" "}
                {improvementRanking?.sharedBy ?? 0}{" "}
                <TextTranslation
                  tkey={tkeys[divisionType as keyof typeof tkeys]}
                />
              </Text>
            </View>
            <IndicatorChangeSummaryListPDF
              title="top_indicators_showing"
              subtitle="improvement"
              list={listImprovement}
              color="#1D9744"
              currentLanguage={currentLanguage}
            />
          </View>
        </View>
        <View style={styles.side}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <TextWithDot tkey="highest_improvement" color="#1D9744" />
            <TextWithDot tkey="improved" color="#95C35F" />
            <TextWithDot tkey="worsened" color="#E39C57" />
            <TextWithDot tkey="extremely_worsened" color="#D7191C" />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: `${i18n.language === "hi" ? "20pt" : ""}`,
            }}>
            <Image
              src={image}
              style={{
                width: "130pt",
                height: "130pt",
                objectFit: "contain",
              }}
            />
          </View>
          <IndicatorChangeSummaryListPDF
            title="top_indicators_showing"
            subtitle="worsened"
            list={listWorsened}
            color="#D7191C"
            currentLanguage={currentLanguage}
          />
        </View>
      </View>

      <TextTranslation
        style={{
          ...styles.text,
          color: "#666666",
          marginTop: 5,
          width: "100%",
          marginLeft: 20,
        }}
        tkey="for_more_details"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    marginLeft: 20,
  },
  side: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  text: {
    fontSize: "7pt",
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
  circle: {
    borderRadius: "50%",
    border: "10px solid #3E6081",
    width: 120,
    height: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  progressCircle: {
    borderRadius: "50%",
    width: 120,
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "conic-gradient(crimson 288deg, black 0deg)",
  },
  innerCirle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: "50%",
    backgroundColor: "lightgrey",
  },
  percentage: {
    position: "relative",
    fontSize: 10,
    color: "rgba(0,0,0,0.8)",
  },
  centerCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
});

export default IndicatorChangeSummaryPDF;
