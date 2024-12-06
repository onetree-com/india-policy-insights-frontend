import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React, { FC } from "react";
import TextTranslation from "./TextTranslation";
import TextWithDot from "./TextWithDot";

interface Props {
  notes: { title: string; subtitle: string | string[] }[];
  bottomLine?: boolean;
}

const NotesPDF: FC<Props> = ({ notes, bottomLine = true }) => {
  return (
    <View
      style={{
        ...styles.container,
        borderBottom: bottomLine ? "1px solid #A92D38" : undefined,
      }}>
      <TextTranslation
        style={{ ...styles.primaryText, marginBottom: 16 }}
        tkey="notes"
      />
      {notes.map(({ title, subtitle }, index) => (
        <React.Fragment key={index}>
          <Text
            style={{ ...styles.primaryText, fontSize: "9pt", marginBottom: 8 }}>
            <TextTranslation
              style={{
                ...styles.primaryText,
                fontSize: "9pt",
                marginBottom: 8,
              }}
              tkey={title}
            />
            :{" "}
            {Array.isArray(subtitle) && subtitle.length > 0 ? (
              subtitle.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <TextTranslation style={styles.secondaryText} tkey={item} />
                  </React.Fragment>
                );
              })
            ) : (
              <TextTranslation
                style={styles.secondaryText}
                tkey={subtitle as string}
              />
            )}
          </Text>
          {Array.isArray(subtitle) && subtitle.length > 0 ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-15pt",
                marginLeft: "-60pt",
              }}>
              <TextWithDot tkey="highest_improvement" color="#1D9744" />
              <Text style={{ fontSize: 10, fontWeight: 300 }}> | </Text>
              <TextWithDot tkey="improved" color="#95C35F" />
              <Text style={{ fontSize: 10, fontWeight: 300 }}> | </Text>
              <TextWithDot tkey="worsened" color="#E39C57" />
              <Text style={{ fontSize: 10, fontWeight: 300 }}> | </Text>
              <TextWithDot tkey="extremely_worsened" color="#D7191C" />
            </View>
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
};

export default NotesPDF;

const styles = StyleSheet.create({
  container: {
    display: "flex",
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
    fontSize: "10pt",
    fontWeight: 600,
    fontFamily: "Helvetica-Bold",
    fontStyle: "normal",
  },
  secondaryText: {
    color: "#666666",
    fontSize: "7pt",
    fontWeight: 400,
  },
});
