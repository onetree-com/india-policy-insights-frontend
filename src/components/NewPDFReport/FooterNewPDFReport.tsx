import { View, StyleSheet } from "@react-pdf/renderer";
import TextTranslation from "./TextTranslation";

const FooterNewPDFReport = () => (
  <View style={styles.footer}>
    <View style={{ ...styles.footerItem, marginRight: 15 }}>
      <TextTranslation style={styles.footerItemTitle} tkey="acknowledgements" />
      <TextTranslation
        style={styles.footerItemText}
        tkey="acknowledgements_desc"
      />
    </View>
    <View style={styles.footerItem}>
      <TextTranslation style={styles.footerItemTitle} tkey="citation" />

      <TextTranslation style={styles.footerItemText} tkey="citation_desc" />
    </View>
  </View>
);

export default FooterNewPDFReport;

const styles = StyleSheet.create({
  footer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
  },
  footerItem: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  footerItemTitle: {
    color: "#A92D38",
    fontSize: "11pt",
    marginBottom: 10,
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
  footerItemText: {
    color: "#9B9B9B",
    fontSize: "8pt",
    fontWeight: 600,
  },
});
