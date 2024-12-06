import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { FC } from "react";
import TextTranslation from "./TextTranslation";

interface Props {
  type: "allindia" | "state" | "district";
  value: number;
  total: number;
  marginTop?: number;
}

const NumberOfIndicators: FC<Props> = ({ type, value, marginTop, total }) => (
  <View style={{ ...styles.container, marginTop: marginTop ?? 20 }}>
    <TextTranslation style={styles.primaryText} tkey="number_of_indicators" />
    <TextTranslation
      style={styles.secondaryText}
      tkey={`better_than_${type}_average`}
    />
    <View style={styles.card}>
      <Text style={styles.cardPrimaryText}>{value}</Text>
      <Text style={styles.cardSecondaryText}>
        <TextTranslation style={styles.cardSecondaryText} tkey="out_of" />
        {" " + total}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#4D4D4E",
    fontSize: "11pt",
    fontWeight: 900,
  },
  secondaryText: {
    color: "#1D9744",
    fontSize: "11pt",
    fontWeight: 900,
  },
  card: {
    padding: 16,
    border: "4px solid #405F84",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cardPrimaryText: {
    color: "#1D9744",
    fontSize: "40pt",
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
  cardSecondaryText: {
    color: "#676767",
    fontSize: "10pt",
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
});

export default NumberOfIndicators;
