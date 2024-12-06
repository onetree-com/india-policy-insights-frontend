import { View, StyleSheet, Image } from "@react-pdf/renderer";
import NumberOfIndicators from "./NumberOfIndicators";
import { FC } from "react";
import ReferenceBar from "components/PDFComponents/ReferenceBar";
import { IndicatorsBetterThan } from "models/indicator";
import TextTranslation from "./TextTranslation";

interface Props {
  image: string;
  indicatorsBetterThan: IndicatorsBetterThan[];
}

const IndicatorSummaryVillage: FC<Props> = ({
  image,
  indicatorsBetterThan,
}) => (
  <View style={styles.container}>
    <TextTranslation style={styles.primaryText} tkey="indicator_summary" />
    <View style={styles.content}>
      <NumberOfIndicators
        marginTop={10}
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
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "30%",
          marginTop: 30,
        }}>
        <TextTranslation
          style={{
            fontWeight: 700,
            fontFamily: "Helvetica",
            fontStyle: "normal",
            color: "#4D4D4E",
            fontSize: "11pt",
            textAlign: "center",
          }}
          tkey="number_of_indicators_in_each_decile"
        />
        <Image
          src={image}
          style={{
            width: "130pt",
            height: "130pt",
            objectFit: "contain",
          }}
        />
        <View style={styles.betterWorse}>
          <TextTranslation
            style={{ ...styles.betterWorseText, marginRight: 4 }}
            tkey="better"
          />
          <View style={styles.betterWorseLine}></View>
          <TextTranslation
            style={{ ...styles.betterWorseText, marginRight: 3 }}
            tkey="worse"
          />
        </View>
        <ReferenceBar
          colors={[
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
          ]}
          numbers={[]}
        />
      </View>
      <NumberOfIndicators
        marginTop={10}
        type="district"
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
  </View>
);

export default IndicatorSummaryVillage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    borderBottom: "1px solid #A92D38",
    borderTop: "1px solid #A92D38",
    padding: "20px 0",
    flexDirection: "column",
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  betterWorse: {
    display: "flex",
    marginTop: 4,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  betterWorseText: {
    color: "#666666",
    fontSize: "7pt",
    fontWeight: 400,
  },
  betterWorseLine: {
    width: "80%",
    borderBottom: "1px solid #666666",
  },
});
