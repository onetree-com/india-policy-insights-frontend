import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  title: string;
}

const HeaderNewPagesPDF: FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default HeaderNewPagesPDF;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#666666",
  },
});
