import { Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";
import Logo from "assets/images/FrontPageLogo.png";

const FrontPage: FC = () => {
  const date = new Date();
  return (
    <Page size="A4">
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: "90pt",
          }}>
          <Image src={Logo} style={styles.logo} />
          <Text
            style={[
              styles.text,
              {
                fontSize: "20pt",
                textAlign: "center",
                marginTop: "30pt",
              },
            ]}>
            This is an India Policy {"\n"} Insights Report
          </Text>
        </View>
        <Text style={[styles.text, styles.date]}>{`${date.getDate()} - ${
          date.getMonth() + 1
        } - ${date.getFullYear()}`}</Text>
      </View>
    </Page>
  );
};

export default FrontPage;

const styles = StyleSheet.create({
  container: {
    borderRadius: "10pt",
    backgroundColor: "#F5F4F4",
    height: "97%",
    width: "95%",
    margin: "15pt",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: { width: "161.25pt", height: "51.75pt" },
  date: {
    fontSize: "12pt",
    lineHeight: "10pt",
    fontWeight: 300,
    marginTop: "460pt",
    marginBottom: "0pt",
  },
  text: {
    fontFamily: "Helvetica",
    letterSpacing: "0.2pt",
    color: "#3D4247",
  },
});
