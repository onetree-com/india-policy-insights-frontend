import { FC } from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from "assets/images/GeographicInsightsLogo.png";
import { useTranslation } from "react-i18next";

const Footer: FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  return (
    <View fixed break style={styles.container}>
      <Image style={styles.logo} src={Logo} />
      <View style={{ width: "454pt" }}>
        <Text style={currentLanguage === 'en' ?  styles.description: styles.descriptionHi}>
         {t("ipi_description")}
        </Text>
        <Text style={currentLanguage === 'en' ?  styles.contact: styles.contactHi}>
           {t("more_info")}
          <Text style={{ color: "#a51c30" }}> {t("professor")} </Text>
          {t("professor_mail")}
        </Text>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#F5F4F4",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "18.5pt",
    paddingVertical: "9pt",
  },
  logo: {
    width: "80pt",
    height: "23.5pt",
  },
  description: {
    fontFamily: "Helvetica",
    fontSize: "7.5pt",
    fontWeight: 300,
  },
  descriptionHi: {
    fontFamily: "Noto Sans Devanagari",
    fontSize: "7.5pt",
    fontWeight: 300,
  },
  contact: {
    fontFamily: "Helvetica",
    fontSize: "7.5pt",
  },
  contactHi: {
    fontFamily: "Noto Sans Devanagari",
    fontSize: "7.5pt",
  },
});
