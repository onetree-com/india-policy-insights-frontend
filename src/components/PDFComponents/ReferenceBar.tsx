import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";

const ReferenceBar: FC<{ numbers: number[] | string[]; colors: string[] }> = ({
  numbers,
  colors,
}) => {
  return (
    <View style={styles.colorBar}>
      <View style={styles.barColors}>
        {colors
          ? colors.map((color, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.color,
                    {
                      backgroundColor: color,
                      width: `${100 / colors.length}%`,
                      borderBottomLeftRadius: `${index === 0 ? "5pt" : 0}`,
                      borderTopLeftRadius: `${index === 0 ? "5pt" : 0}`,
                      borderTopRightRadius: `${
                        index === colors.length - 1 ? "5pt" : 0
                      }`,
                      borderBottomRightRadius: `${
                        index === colors.length - 1 ? "5pt" : 0
                      }`,
                    },
                  ]}></View>
              );
            })
          : ""}
      </View>
      <View style={styles.barNumbers}>
        {numbers
          ? numbers.map((number, index) => {
              return (
                <Text key={index} style={styles.text}>
                  {number}
                </Text>
              );
            })
          : ""}
      </View>
    </View>
  );
};

export default ReferenceBar;

const styles = StyleSheet.create({
  colorBar: {
    width: "100%",
    marginTop: "6pt",
  },
  barColors: {
    width: "100%",
    flexDirection: "row",
    marginBottom: "3pt",
  },
  color: {
    height: "14.25pt",
    border: "1pt solid #fff",
  },
  barNumbers: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: "7.25pt",
  },
});
