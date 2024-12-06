import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import React, { FC } from "react";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import TextTranslation from "./TextTranslation";
Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });

interface Props {
  type?: "village";
  currentLanguage?: string;
  header: string[];
  data: {
    id: number;
    subText: string;
    items: {
      indId: number;
      indicator: string;
      programs: string;
      india: number;
      state?: number;
      district: number;
      change?: number;
      village?: number;
      colorChange: string;
    }[];
  }[];
}

const CustomTablePDF: FC<Props> = ({ header, data, type, currentLanguage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {header.map((text, key) => (
          <React.Fragment key={key}>
            <TextTranslation
              style={{
                ...styles.headerText,
                width: key > 1 ? "10%" : type === "village" ? "35%" : "30%",
                textAlign: key > 1 ? "center" : undefined,
                whiteSpace: "nowrap",
              }}
              tkey={text}
            />
          </React.Fragment>
        ))}
      </View>
      {data.map((item) => (
        <React.Fragment key={item.id}>
          <View style={styles.subHeader}>
            <Text
              orphans={0}
              widows={0}
              style={{
                ...styles.subHeaderText,
                fontFamily:
                  currentLanguage === "en"
                    ? "Helvetica-Bold"
                    : "Noto Sans Devanagari",
              }}>
              {item.subText}
            </Text>
          </View>
          <View style={styles.body}>
            {item.items.map((subItems) => (
              <View wrap={false} key={subItems.indId} style={styles.bodyItem}>
                <Text
                  orphans={0}
                  widows={0}
                  style={{
                    ...(currentLanguage === "en"
                      ? styles.bodyText
                      : styles.bodyTextHi),
                    width: type === "village" ? "35%" : "30%",
                  }}>
                  {subItems.indicator}
                </Text>
                <Text
                  orphans={0}
                  widows={0}
                  style={{
                    ...styles.bodyText,
                    width: type === "village" ? "35%" : "30%",
                  }}>
                  {subItems.programs}
                </Text>
                <Text
                  orphans={0}
                  widows={0}
                  style={{
                    ...styles.bodyText,
                    width: "10%",
                    textAlign: "center",
                  }}>
                  {subItems.india ?? "n/a"}
                </Text>
                {type !== "village" && (
                  <Text
                    orphans={0}
                    widows={0}
                    style={{
                      ...styles.bodyText,
                      width: "10%",
                      textAlign: "center",
                    }}>
                    {subItems.state ?? "n/a"}
                  </Text>
                )}
                <Text
                  orphans={0}
                  widows={0}
                  style={{
                    ...styles.bodyText,
                    width: "10%",
                    textAlign: "center",
                    fontFamily: "Helvetica-Bold",
                  }}>
                  {subItems.district ?? "n/a"}
                </Text>
                {type !== "village" ? (
                  <Text
                    orphans={0}
                    widows={0}
                    style={{
                      ...styles.bodyText,
                      marginLeft: "10pt",
                      textAlign: "center",
                    }}>
                    {subItems.change ?? "n/a"}
                  </Text>
                ) : null}

                <View
                  style={{
                    position: "relative",
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                  }}>
                  {type === "village" ? (
                    <Text
                      orphans={0}
                      widows={0}
                      style={{
                        ...styles.bodyText,
                        textAlign: "center",
                      }}>
                      {subItems.village ?? "n/a"}
                    </Text>
                  ) : null}
                  <View
                    style={{
                      position: "absolute",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      right: 15,
                      top: "-2pt",
                      alignSelf: "center",
                      backgroundColor: subItems.colorChange,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
  },
  header: {
    width: "100%",
    backgroundColor: "#A92D38",
    padding: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: "7pt",
    color: "#ffffff",
  },
  subHeader: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  subHeaderText: {
    fontSize: "6pt",
    color: "#484848",
  },
  body: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  bodyItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    paddingHorizontal: 3,
  },
  bodyText: {
    fontFamily: "Helvetica",
    fontSize: "7pt",
    color: "#6B6B6B",
  },
  bodyTextHi: {
    fontFamily: "Noto Sans Devanagari",
    fontSize: "7pt",
    color: "#6B6B6B",
  },
});

export default CustomTablePDF;
