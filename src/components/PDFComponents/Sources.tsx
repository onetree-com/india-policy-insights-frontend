import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";

const Sources: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: "12pt", color: "#A51C30" }]}>
        Acknowledgments:
      </Text>
      <Text style={[styles.text, { fontSize: "10pt", marginBottom: "10px" }]}>
        We wish to acknowledge the support of the National Informatics Centre
        (Bharat Maps), Demographic and Health Surveys, and the International
        Institute for Population Sciences in facilitating access to the data.
      </Text>
    </View>
  );
};

export default Sources;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: "10.5pt",
  },
  sources: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: "30pt",
    marginTop: "4.5pt",
  },
  source: {
    width: "30%",
    marginRight: "2%",
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: "8.25pt",
    lineHeight: "1.5pt",
    letterSpacing: "0.2pt",
    color: "#3D4247",
    fontWeight: 300,
  },
});
