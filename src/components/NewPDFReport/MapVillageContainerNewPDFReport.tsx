import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";
import { DivisionTypes } from "context/globalContext";
import { division } from "models/divisions";
import { FC } from "react";
import TextTranslation from "./TextTranslation";

interface Props {
  RegionType: DivisionTypes;
  Region?: division;
  parentDivision?: string;
  mapImageDistrict?: string;
  mapImageVillage?: string;
}

const MapVillageContainerNewPDFReport: FC<Props> = ({
  RegionType,
  Region,
  parentDivision,
  mapImageDistrict,
  mapImageVillage,
}) => {
  return (
    <View
      style={{
        ...styles.districtContainer,
        paddingBottom: !mapImageDistrict ? 180 : 0,
      }}>
      <View style={styles.villageName}>
        {Region?.name !== undefined ? (
          <Text style={styles.primaryText}>{Region.name}</Text>
        ) : (
          <TextTranslation style={styles.primaryText} tkey={`${RegionType}`} />
        )}
        {parentDivision ? (
          <Text style={styles.secondaryText}>{parentDivision}</Text>
        ) : (
          <TextTranslation style={styles.secondaryText} tkey="state" />
        )}
      </View>
      {mapImageDistrict ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            width: "100%",
          }}>
          <Image
            src={mapImageDistrict}
            style={{
              width: 250,
              height: 200,
              objectFit: "contain",
            }}
          />
          {mapImageVillage ? (
            <Image
              src={mapImageVillage}
              style={{
                width: 160,
                height: 200,
                objectFit: "contain",
              }}
            />
          ) : (
            <TextTranslation
              tkey="no_map_available"
              style={{ fontWeight: 300 }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

export default MapVillageContainerNewPDFReport;

const styles = StyleSheet.create({
  districtContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  villageName: {
    display: "flex",
    flexDirection: "column",
  },
  primaryText: {
    color: "#A92D38",
    fontSize: "12pt",
    fontWeight: 600,
    fontFamily: "Helvetica",
    fontStyle: "normal",
  },
  secondaryText: {
    color: "#B74F59",
    fontSize: "9pt",
    fontWeight: 400,
  },
});
