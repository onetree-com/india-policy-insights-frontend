import { FC } from "react";
import { StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import NationalIcon from "assets/images/NationalIcon.png";
import StateIcon from "assets/images/StateIcon.png";
import Lineargradient from "assets/images/LinearGradient.png";
import { readingStrategy } from "models/indicator";

const Bar: FC<{
  indReadingStrategy: readingStrategy;
  prevalenceEnd: number;
  stateValue: number;
  indiaValue: number;
}> = ({ prevalenceEnd, indReadingStrategy, stateValue, indiaValue }) => {
  return (
    <View style={styles.bar}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          marginBottom: "5pt",
        }}>
        <Text style={[styles.text, { fontSize: "10.5pt", fontWeight: 300 }]}>
          0
        </Text>
        <Text style={[styles.text, { fontSize: "10.5pt", fontWeight: 300 }]}>
          100
        </Text>
      </View>
      <View style={{ position: "relative" }}>
        <Image
          src={Lineargradient}
          style={{
            transform: `rotate(${
              indReadingStrategy === readingStrategy.HigherIsBetter
                ? "180"
                : "0"
            })`,
            width: "100%",
            height: "7.5pt",
            zIndex: -1000,
            position: "absolute",
            bottom: -5,
          }}
        />
        <View
          style={{
            height: "7.5pt",
            marginTop: "12pt",
            flexDirection: "row",
          }}>
          <View
            style={{
              position: "relative",
            }}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left:
                  prevalenceEnd !== undefined
                    ? prevalenceEnd! * 2.45
                    : 0 * 2.45,
              }}>
              <View
                style={{
                  backgroundColor: "#A51C30",
                  width: "3pt",
                  height: "12pt",
                  borderRadius: "4pt",
                  left: 19,
                  bottom: -7,
                }}></View>
            </View>
          </View>
          <View
            style={{
              position: "relative",
            }}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: stateValue! * 2.45,
              }}>
              <Image
                style={{
                  width: "9pt",
                  height: "7.5pt",
                  bottom: -15,
                  left: 2,
                }}
                src={StateIcon}
              />
            </View>
          </View>
          <View
            style={{
              position: "relative",
            }}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: indiaValue! * 2.45,
              }}>
              <Image
                style={{
                  width: "9pt",
                  height: "7.5pt",
                  bottom: 5,
                  left: 2,
                }}
                src={NationalIcon}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Bar;

const styles = StyleSheet.create({
  bar: { width: "100%", marginTop: "30pt" },
  text: {
    fontFamily: "Helvetica",
    fontSize: "9.5pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
  },
});
