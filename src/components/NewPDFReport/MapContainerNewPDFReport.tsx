import { View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { DivisionTypes } from "context/globalContext";
import { division } from "models/divisions";
import { FC } from "react";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import { useTranslation } from "react-i18next";
Font.register({ family: "Noto Sans Devanagari", src: NotoSansDevanagari });

interface Props {
  RegionType: DivisionTypes;
  Region?: division;
  State?: { name: string; id: number };
  mapImageDistrict?: string;
  mapImageState?: string;
  currentLanguage?: string;
}

const MapContainerNewPDFReport: FC<Props> = ({
  RegionType,
  Region,
  State,
  mapImageDistrict,
  mapImageState,
  currentLanguage,
}) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        ...styles.districtContainer,
        paddingBottom: !mapImageDistrict ? 180 : 0,
      }}>
      <View style={styles.districtName}>
        <Text
          style={{
            ...styles.primaryText,
            fontFamily:
              currentLanguage !== "en" ? "Noto Sans Devanagari" : "Helvetica",
          }}>
          {Region?.name !== undefined
            ? Region.name
            : `${t(RegionType?.replace("_", " ")?.replace("ies", "y"))}`}
        </Text>
        <Text
          style={{
            ...styles.secondaryText,
            fontFamily:
              currentLanguage !== "en" ? "Noto Sans Devanagari" : "Helvetica",
          }}>
          {State?.name !== undefined ? State.name! : t("state")}
        </Text>
      </View>
      {mapImageDistrict && mapImageState && (
        <View
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            width: "100%",
          }}>
          <Image
            src={mapImageState}
            style={{
              width: 250,
              height: 200,
              objectFit: "contain",
            }}
          />
          <Image
            src={mapImageDistrict}
            style={{
              width: 160,
              height: 200,
              objectFit: "contain",
            }}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  districtContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  districtName: {
    display: "flex",
    flexDirection: "column",
  },
  primaryText: {
    color: "#A92D38",
    fontSize: "12pt",
    fontWeight: 600,

    fontStyle: "normal",
  },
  secondaryText: {
    color: "#B74F59",
    fontSize: "9pt",
    fontWeight: 400,
  },
});

export default MapContainerNewPDFReport;
