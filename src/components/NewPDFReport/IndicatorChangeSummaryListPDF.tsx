import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { FC } from "react";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import TextTranslation from "./TextTranslation";
Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });
interface Props {
  title: string;
  subtitle: string;
  color: string;
  list: string[];
  currentLanguage?: string;
}

const IndicatorChangeSummaryListPDF: FC<Props> = ({
  title,
  subtitle,
  color,
  list,
  currentLanguage,
}) => (
  <View style={styles.container}>
    <TextTranslation style={styles.title} tkey={title} />
    <TextTranslation
      style={{
        ...styles.subtitle,
        color,
      }}
      tkey={subtitle}
    />
    {list.map((item, index) => (
      <Text
        key={index}
        style={{
          ...styles.listItem,
          color,
          fontFamily:
            currentLanguage !== "en"
              ? "Noto Sans Devanagari"
              : "Helvetica-Bold",
        }}>
        {item}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: 15,
  },
  title: {
    marginBottom: 1,
    fontSize: "14pt",
    fontWeight: 400,
    color: "#878787",
  },
  subtitle: {
    marginBottom: 10,
    fontSize: "12pt",
  },
  listItem: {
    marginBottom: 2,
    fontSize: "6pt",
  },
});

export default IndicatorChangeSummaryListPDF;
