import { FC } from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from "assets/images/Logo.png";
import { useTranslation } from "react-i18next";

const Header: FC<{ RegionName: string; parentDivision: string }> = ({
  RegionName,
  parentDivision,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  return (
    <View fixed style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <Text style={currentLanguage === 'en' ?  styles.divisionType: styles.divisionTypeHi}>{RegionName}, </Text>
        <Text style={currentLanguage === 'en' ?  styles.parentDivisions: styles.parentDivisionsHi}>{parentDivision}</Text>
      </View>
      <View>
        <Image style={styles.logo} src={Logo} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "9.38pt",
    borderBottom: "1pt",
    borderBottomColor: "#ADADAD",
  },
  divisionType: {
    fontFamily: "Helvetica",
    color: "#A51C30",
    fontWeight: 700,
    fontSize: "27pt",
  },
  divisionTypeHi: {
    fontFamily: "Noto Sans Devanagari",
    color: "#A51C30",
    fontWeight: 700,
    fontSize: "27pt",
  },
  parentDivisions: {
    fontFamily: "Helvetica",
    color: "#A51C30",
    fontSize: "13.5pt",
    paddingBottom: "2.5pt",
  },
  parentDivisionsHi: {
    fontFamily: "Noto Sans Devanagari",
    color: "#A51C30",
    fontSize: "13.5pt",
    paddingBottom: "2.5pt",
  },
  logo: {
    width: "57.75pt",
    height: "18pt",
    marginHorizontal: "auto",
  },
  logoText: {
    marginTop: "1.5pt",
    fontFamily: "Helvetica",
    fontSize: "6pt",
    fontWeight: 300,
  },
});
