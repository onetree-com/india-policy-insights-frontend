import { FC } from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import TotalPopulationIcon from "assets/images/TotalPopulationPDFIcon.png";
import PopulationDensityIcon from "assets/images/PopulationDensityPDFIcon.png";
import SexRatioIcon from "assets/images/SexRatioPDFIcon.png";
import ChildPopulationIcon from "assets/images/ChildPopulationPDFIcon.png";
import LiteratePercentageIcon from "assets/images/LiteratePercentagePDFIcon.png";
import { DivisionTypes } from "../../context/globalContext/index";

const DivisionProfile: FC<{
  divisionType: DivisionTypes;
  totalPop: string;
  childPop: string;
  popDensity: string;
  sexRatio: number;
  literatePercentage: string;
}> = ({
  divisionType,
  totalPop,
  childPop,
  popDensity,
  sexRatio,
  literatePercentage,
}) => {
  //TODO remove nullish coalescing operator
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{divisionType} Profile</Text>
      <View style={styles.items}>
        <View style={[styles.item, { width: "66.75pt" }]}>
          <Image style={styles.image} src={TotalPopulationIcon} />
          <View>
            <Text style={styles.itemValue}>{totalPop}</Text>
            <Text style={styles.itemName}>Total Population</Text>
          </View>
        </View>
        <View style={[styles.item, { width: "101.25pt" }]}>
          <Image style={styles.image} src={ChildPopulationIcon} />
          <View>
            <Text style={styles.itemValue}>{"xx" ?? childPop}</Text>
            <Text style={styles.itemName}>Child Population (0-5 years)</Text>
          </View>
        </View>
        <View style={[styles.item, { width: "74.25pt" }]}>
          <Image style={styles.image} src={PopulationDensityIcon} />
          <View>
            <Text style={styles.itemValue}>{popDensity}</Text>
            <Text style={styles.itemName}>Population Density</Text>
          </View>
        </View>
        <View style={[styles.item, { width: "50.25pt" }]}>
          <Image style={styles.image} src={SexRatioIcon} />
          <View>
            <Text style={styles.itemValue}>{sexRatio}</Text>
            <Text style={styles.itemName}>Sex Ratio</Text>
          </View>
        </View>
        <View style={[styles.item, { width: "51.75pt" }]}>
          <Image style={styles.image} src={LiteratePercentageIcon} />
          <View>
            <Text style={styles.itemValue}>{literatePercentage}</Text>
            <Text style={styles.itemName}>% literate</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "10.5pt",
    paddingLeft: "4pt",
    paddingBottom: "11.25pt",
    borderBottom: "1pt",
    borderBottomColor: "#ADADAD",
  },
  title: {
    fontFamily: "Helvetica",
    fontSize: "13.5pt",
    fontWeight: 700,
    color: "#A51C30",
    marginBottom: "7.5pt",
  },
  items: {
    display: "flex",
    width: "100%",
    paddingRight: "12pt",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    height: "18pt",
    display: "flex",
    flexDirection: "row",
  },
  image: {
    height: "18pt",
    width: "18pt",
    marginRight: "6pt",
  },
  itemName: {
    fontFamily: "Helvetica",
    fontSize: "8pt",
    fontWeight: 300,
  },
  itemValue: {
    fontFamily: "Helvetica",
    fontSize: "10pt",
    fontWeight: 700,
  },
});

export default DivisionProfile;
