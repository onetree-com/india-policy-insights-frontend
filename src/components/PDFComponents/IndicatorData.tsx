import { FC } from "react";
import { SourceObject } from "@react-pdf/types";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import HighestImprovement from "assets/images/HighestImprovement.png";
import Improvement from "assets/images/Improvement.png";
import Worsened from "assets/images/Worsened.png";
import ExtremelyWorsened from "assets/images/ExtremelyWorsened.png";
import NoChange from "assets/images/NoChange.png";
import VillageLevelEmptyState from "assets/images/VillageLevelEmptyState.png";
import NationalIcon from "assets/images/NationalIcon.png";
import StateIcon from "assets/images/StateIcon.png";
import { readingStrategy } from "models/indicator";
import ReferenceBar from "./ReferenceBar";
import Bar from "./Bar";
import { useTranslation } from "react-i18next";

const IndicatorData: FC<
  Partial<{
    indicatorName: string;
    indDescription: string;
    prevalence: number;
    prevalenceEnd: number;
    indReadingStrategy: readingStrategy;
    stateValue: number;
    indiaValue: number;
    headcount: number;
    mapImage: string;
  }>
> = ({
  indicatorName,
  indDescription,
  prevalence,
  prevalenceEnd,
  indReadingStrategy,
  stateValue,
  indiaValue,
  headcount,
  mapImage,
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const renderArrow: (
    value: number,
    valueEnd: number,
    type: readingStrategy
  ) => SourceObject = (
    value: number,
    valueEnd: number,
    type: readingStrategy
  ) => {
    if (value > valueEnd) {
      switch (true) {
        case value - valueEnd >= 50:
          return type === readingStrategy.LowerIsBetter
            ? HighestImprovement
            : ExtremelyWorsened;
        default:
          return type === readingStrategy.LowerIsBetter
            ? Improvement
            : Worsened;
      }
    } else if (valueEnd !== value) {
      switch (true) {
        case valueEnd - value >= 50:
          return type === readingStrategy.LowerIsBetter
            ? ExtremelyWorsened
            : HighestImprovement;

        default:
          return type === readingStrategy.LowerIsBetter
            ? Worsened
            : Improvement;
      }
    } else {
      return NoChange;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <Text style={[styles.boldText, { fontSize: "12pt", color: "#A51C30" }]}>
          {indicatorName}
        </Text>
        <Text style={[styles.text, { fontSize: "10pt", marginTop: "6pt" }]}>
          {indDescription}
        </Text>
        <View style={styles.values}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "6pt",
            }}>
            <Text style={currentLanguage === 'en' ?  styles.text: styles.textHi}>2021 {t("prevalence")}</Text>
            <Text style={styles.boldText}>
              {prevalenceEnd !== undefined ? prevalenceEnd + "%" : "no data"}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "6pt",
            }}>
            <Text style={currentLanguage === 'en' ?  styles.text: styles.textHi}>2016 {t("prevalence")}</Text>
            <Text style={styles.boldText}>
              {prevalence !== undefined ? prevalence + "%" : t("no_data")}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "6pt",
            }}>
            <Text style={currentLanguage === 'en' ?  styles.text: styles.textHi}>{t("change")} (2021-2016)</Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                src={renderArrow(
                  prevalence!,
                  prevalenceEnd!,
                  indReadingStrategy!
                )}
                style={{
                  transform: `rotate(${
                    prevalence! > prevalenceEnd! ? "180" : "0"
                  })`,
                  width: "10pt",
                  height: "10pt",
                  marginRight: "3pt",
                }}
              />
              <Text style={styles.boldText}>
                {prevalence !== undefined && prevalenceEnd !== undefined
                  ? `${
                      prevalenceEnd! > prevalence!
                        ? (prevalenceEnd! - prevalence!).toFixed(2)
                        : (prevalence! - prevalenceEnd!).toFixed(2)
                    }%`
                  : "no data"}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Text style={currentLanguage === 'en' ?  styles.text: styles.textHi}>2021 {t("head_count")} (N)</Text>
            <Text style={styles.boldText}>
              {headcount !== undefined ? headcount : t("no_data")}
            </Text>
          </View>
        </View>
        <Bar
          indReadingStrategy={indReadingStrategy!}
          prevalenceEnd={prevalenceEnd!}
          stateValue={stateValue!}
          indiaValue={indiaValue!}
        />
        <View style={styles.references}>
          <View style={styles.reference}>
            <View
              style={{
                backgroundColor: "#A51C30",
                width: "3pt",
                height: "15pt",
                borderRadius: "4pt",
                marginRight: "4pt",
              }}></View>
            <Text style={[currentLanguage === 'en' ?  styles.text: styles.textHi, { fontSize: "8.5pt", fontWeight: 300 }]}>
              {t("district")}:
            </Text>
            <Text style={[styles.boldText, { fontSize: "8.5pt" }]}>
              {prevalenceEnd}
            </Text>
          </View>
          <View style={styles.reference}>
            <Image
              src={StateIcon}
              style={{
                width: "7.5pt",
                height: "6pt",
                marginRight: "4pt",
                marginBottom: "2pt",
              }}
            />
            <Text style={[currentLanguage === 'en' ?  styles.text: styles.textHi, { fontSize: "8.5pt", fontWeight: 300 }]}>
              {t("state")}:
            </Text>
            <Text style={[styles.boldText, { fontSize: "8.5pt" }]}>
              {stateValue}
            </Text>
          </View>
          <View style={[styles.reference, { width: "33%" }]}>
            <Image
              src={NationalIcon}
              style={{
                width: "7.5pt",
                height: "6pt",
                marginRight: "4pt",
                marginBottom: "2pt",
              }}
            />
            <Text style={[currentLanguage === 'en' ?  styles.text: styles.textHi, { fontSize: "8.5pt", fontWeight: 300 }]}>
              {t("national")}:
            </Text>

            <Text style={[styles.boldText, { fontSize: "8.5pt" }]}>
              {indiaValue}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ width: "272pt", height: "281pt" }}>
        <Text
          style={[
            currentLanguage === 'en' ?  styles.text: styles.textHi,
            {
              marginBottom: "6pt",
              fontSize: "12pt",
              color: "#A51C30",
            },
          ]}>
          {t("distribution_of_prevalence")}
        </Text>
        <Image src={mapImage ?? VillageLevelEmptyState} />
        {/* TODO swap placeholder for map ^^ */}
        <ReferenceBar
          colors={
            indReadingStrategy === readingStrategy.LowerIsBetter
              ? [
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
                ]
              : [
                  "#E31E24",
                  "#E94E3A",
                  "#EE7A62",
                  "#F4A294",
                  "#CCB1B1",
                  "#ABC4CC",
                  "#8BC4F2",
                  "#44A3DB",
                  "#008DD2",
                  "#086192",
                ]
          }
          numbers={[
            0.8, 8.1, 19.2, 28.4, 39.1, 45.3, 53.0, 69.2, 75.1, 85.3, 99.8,
          ]}
        />
      </View>
    </View>
  );
};

export default IndicatorData;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "289pt",
    marginTop: "10.5pt",
  },
  indicatorContainer: {
    height: "289pt",
    width: "265pt",
  },
  values: {
    marginLeft: "69.25pt",
    height: "78.75pt",
    width: "159.75pt",
    marginTop: "30pt",
  },
  bar: { width: "100%", marginTop: "30pt" },
  text: {
    fontFamily: "Helvetica",
    fontSize: "9.5pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
  },
  textHi: {
    fontFamily: "Noto Sans Devanagari",
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
  },
  references: {
    marginTop: "49pt",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reference: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
  },
});
