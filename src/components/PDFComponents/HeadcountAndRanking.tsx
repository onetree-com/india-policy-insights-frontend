import { FC } from "react";
import { Image, StyleSheet, Text, View, Font } from "@react-pdf/renderer";
import VillageLevelEmptyState from "assets/images/VillageLevelEmptyState.png";
import ReferenceBar from "./ReferenceBar";
import { DivisionTypes } from "context/globalContext";
import { useTranslation } from "react-i18next";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";

Font.register({family: 'Noto Sans Devanagari', src: NotoSansDevanagari});

const HeadcountAndRanking: FC<{
  Region: string;
  RegionType: DivisionTypes;
  IndName: string;
  PrevalenceRanking: number;
  HeadcountRanking: number;
  mapImage?: string;
}> = ({
  Region,
  RegionType,
  IndName,
  PrevalenceRanking,
  HeadcountRanking,
  mapImage,
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <View style={styles.container}>
    <View style={styles.indicatorContainer}>
      <Text
        style={[
          currentLanguage === 'en' ?  styles.text: styles.textHi,
          {
            fontSize: "12pt",
            color: "#A51C30",
            marginTop: "12pt",
          },
        ]}>
        { t("ranking_title") }
      </Text>
      <Text
        style={[
         currentLanguage === 'en' ?  styles.text: styles.textHi,
          {
            fontSize: "10pt",
            marginTop: "12pt",
            fontWeight: 300,
          },
        ]}>
        {t(Region)}{" "}
        {RegionType === DivisionTypes.District
          ? t("district")
          : t(RegionType)?.toLowerCase().replace("ies", "y")}{" "}
        {t("holds")}{" "}
        <Text
          style={[
            styles.boldText,
            {
              fontSize: "10pt",
              marginTop: "6pt",
            },
          ]}>
          {PrevalenceRanking}
        </Text>{" "}
        {RegionType !== DivisionTypes.Assembly_Constituencies ? (
          <>
            {t("and")}{" "}
            <Text
              style={[
                styles.boldText,
                {
                  fontSize: "10pt",
                  marginTop: "6pt",
                },
              ]}>
              {HeadcountRanking}
            </Text>{" "}
            {t("ranks_prevalence")}
          </>
        ) : (
          <>rank in prevalence</>
        )}
        {t("among_all")} {`${t(RegionType)?.toLowerCase()} `}
        {t("of_india")}
      </Text>
      {/* <Text
        style={[
          styles.boldText,
          {
            fontSize: "12pt",
            color: "#A51C30",
            marginTop: "25.5pt",
          },
        ]}>
        {IndName} Burden
      </Text>
      <Text
        style={[
          styles.text,
          {
            fontSize: "10pt",
            marginTop: "6pt",
            fontWeight: 300,
          },
        ]}>
        The percentage and number of high burden villages in {Region}{" "}
        {RegionType?.toLowerCase().replace("ies", "y")} are{" "}
        <Text
          style={[
            styles.boldText,
            {
              fontSize: "10pt",
              marginTop: "6pt",
            },
          ]}>
          {"xx" ?? BurdenPercentage}
        </Text>{" "}
        and{" "}
        <Text
          style={[
            styles.boldText,
            {
              fontSize: "10pt",
              marginTop: "6pt",
            },
          ]}>
          {"xx" ?? BurdenNumber}
        </Text>{" "}
        respectively.
      </Text>
      <Text
        style={[
          styles.text,
          {
            fontSize: "10pt",
            marginTop: "30pt",
            fontWeight: 300,
          },
        ]}>
        The correlation coefficient (r) between prevalence and headcount is{" "}
        <Text
          style={[
            styles.boldText,
            {
              fontSize: "10pt",
              marginTop: "6pt",
            },
          ]}>
          xx
        </Text>
        .
      </Text> */}
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
        {t("distribution_of_headcounts")}
      </Text>
      <Image src={mapImage ?? VillageLevelEmptyState} />
      {/* TODO swap placeholder for map ^^ */}
      <ReferenceBar
        colors={[
          "#D7CCE7",
          "#C8BCDC",
          "#BDB0D3",
          "#B0A1C8",
          "#A291BD",
          "#9786B4",
          "#8D7BAC",
          "#836FA3",
          "#78639A",
          "#67518C",
        ]}
        numbers={[
          "0.8K",
          "1.2K",
          "2.4K",
          "3.1K",
          "4.3K",
          "5.0K",
          "6.2K",
          "7.1K",
          "8.3K",
          "9.3K",
          "10.4K",
        ]}
      />
    </View>
  </View>
  )
  
};

export default HeadcountAndRanking;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "275pt",
    marginTop: "10.5pt",
  },
  indicatorContainer: {
    height: "289pt",
    width: "265pt",
  },
  values: {
    marginLeft: "69.25pt",
    height: "78.75pt",
    width: "129.75pt",
    marginTop: "30pt",
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
  },
  textHi: {
    fontFamily: "Noto Sans Devanagari",
    fontSize: "8.25pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
    fontWeight: 300,
  }
});
