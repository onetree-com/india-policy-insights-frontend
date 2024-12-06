import { View, Image, StyleSheet } from "@react-pdf/renderer";
import Logo from "assets/images/Logo.png";
import { FC } from "react";
import TextTranslation from "./TextTranslation";

interface Props {
  title: string;
}

const HeaderNewPDFReport: FC<Props> = ({ title }) => {
  const tkeys = {
    Districts: "ipi_factsheet_districts",
    Villages: "ipi_factsheet_villages",
    "Assembly Constituencies": "ipi_factsheet_acs",
    "Parliamentary Constituencies": "ipi_factsheet_pcs",
  };
  return (
    <View style={styles.header}>
      <TextTranslation
        style={styles.headerText}
        tkey={tkeys[title as keyof typeof tkeys]}
      />
      <Image style={styles.logo} src={Logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
  },
  headerText: {
    color: "#104952",
    fontSize: "14pt",
    fontWeight: 700,
    fontFamily: "Helvetica-Bold",
    fontStyle: "bold",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default HeaderNewPDFReport;
