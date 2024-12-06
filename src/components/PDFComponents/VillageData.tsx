import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";
import ReferenceBar from "./ReferenceBar";
import { indicator } from "models/indicator";

const Sources: FC<{ indicators: indicator[] }> = ({ indicators }) => {
  return (
    <View style={styles.container}>
      <View style={styles.references}>
        <Text style={[styles.text, { width: "420pt", marginRight: "30pt" }]}>
          Beariate perunt. Aximpor magni odiae et aut officae mo optatur, ullor
          ad ulloreperae volorem voluptat as magnimet es num conserunt, sit
          aperferiti re dolupta tiissimolo idic tendiam dis santiuscipid quatur
        </Text>
        <View style={{ width: "350pt" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={[styles.text, { fontWeight: 300, margin: 0 }]}>
              Better
            </Text>
            <View
              style={{
                width: "170pt",
                height: "2pt",
                backgroundColor: "#D6D6D6",
              }}></View>
            <Text style={[styles.text, { fontWeight: 300 }]}>Worse</Text>
          </View>
          <ReferenceBar
            numbers={[0.8, 19.2, 39.1, 53.0, 75.1, 99.8]}
            colors={["#086192", "#8BC4F2", "#C5B3B8", "#EB7F69", "#E31E24"]}
          />
        </View>
      </View>
      <Text
        style={[
          styles.boldText,
          { fontSize: "12pt", color: "#A51C30", marginTop: "10pt" },
        ]}>
        Indicator Change Overview
      </Text>
      <View style={styles.tHead}>
        <View style={styles.indName}>
          <Text style={[styles.boldText, { fontSize: "14pt", color: "#fff" }]}>
            Indicator
          </Text>
        </View>
        <View style={styles.indValue}>
          <Text style={[styles.boldText, { fontSize: "14pt", color: "#fff" }]}>
            2016
          </Text>
        </View>
        <View style={styles.indValue}>
          <Text style={[styles.boldText, { fontSize: "14pt", color: "#fff" }]}>
            2021
          </Text>
        </View>
      </View>
      {indicators
        ? indicators.map((indicator, index) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <View
                  style={[
                    styles.indName,
                    {
                      backgroundColor: `${
                        index % 2 === 0 ? "#F5F4F4" : "#E8E8E8"
                      }`,
                      margin: "1pt",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.boldText,
                      { fontSize: "11pt", maxLines: 1 },
                    ]}>
                    {indicator.indName}
                  </Text>
                </View>
                <View
                  style={[
                    styles.indValue,
                    {
                      backgroundColor: `${
                        indicator.prevalenceColor ??
                        `${index % 2 === 0 ? "#F5F4F4" : "#E8E8E8"}`
                      }`,
                      margin: "1pt",
                    },
                  ]}>
                  <Text style={[styles.boldText, { fontSize: "11pt" }]}>
                    {indicator.prevalence !== undefined
                      ? indicator.prevalence
                      : "no data"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.indValue,
                    {
                      backgroundColor: `${
                        indicator.prevalenceColor ??
                        `${index % 2 === 0 ? "#F5F4F4" : "#E8E8E8"}`
                      }`,
                      margin: "1pt",
                    },
                  ]}>
                  <Text style={[styles.boldText, { fontSize: "11pt" }]}>
                    {indicator.prevalenceEnd !== undefined
                      ? indicator.prevalenceEnd
                      : "no data"}
                  </Text>
                </View>
              </View>
            );
          })
        : null}
    </View>
  );
};

export default Sources;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: "10.5pt",
  },
  references: {
    flexDirection: "row",
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: "9.5pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
    fontWeight: 700,
    fontStyle: "bold",
    fontSize: "9.5pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
    marginBottom: "-4pt",
  },
  tHead: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "24pt",
    marginTop: "10pt",
    marginBottom: "7.5pt",
    backgroundColor: "#A51C30",
  },
  indName: {
    width: "396pt",
    paddingLeft: "15pt",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "3pt",
  },
  indValue: {
    width: "169pt",
    paddingVertical: "3pt",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
