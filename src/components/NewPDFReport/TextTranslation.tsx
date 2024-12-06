import { StyleSheet, Text, Font } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import NotoSansDevanagari from "fonts/NotoSans-Black.ttf";
import NotoSansDevanagariBold from "fonts/NotoSans-Bold.ttf";
Font.register({
  family: "Noto Sans Devanagari",
  fonts: [
    { src: NotoSansDevanagari },
    { src: NotoSansDevanagariBold, fontWeight: 700, fontStyle: "bold" },
  ],
});

const TextTranslation = ({ style, tkey }: { style?: any; tkey: string }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  return (
    <Text style={[style, currentLang === "en" ? styles.text : styles.textHi]}>
      {t(tkey)}
    </Text>
  );
};

export default TextTranslation;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Helvetica",
  },
  textHi: {
    fontFamily: "Noto Sans Devanagari",
  },
});
