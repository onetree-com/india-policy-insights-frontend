import { View, StyleSheet } from "@react-pdf/renderer";
import { FC } from "react";
import TextTranslation from "./TextTranslation";

interface Props {
  tkey: string;
  color: string;
}

const TextWithDot: FC<Props> = ({ tkey, color }) => {
  return (
    <View style={{ ...styles.container, color }}>
      <View style={{ ...styles.dot, backgroundColor: color }}></View>
      <TextTranslation style={styles.text} tkey={tkey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    marginRight: 5,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    marginRight: 2,
  },
  text: {
    fontSize: "7pt",
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
});

export default TextWithDot;
