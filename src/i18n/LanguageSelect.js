import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
const languageMap = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
];
const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const onChange = (selectedOption) => {
    if (currentLanguage === "en" && selectedOption.value === "hi") {
      i18n.changeLanguage("hi");
    } else {
      i18n.changeLanguage("en");
    }
  };
  return (
    <div style={{ marginRight: 10 }}>
      <Select
        isSearchable={false}
        options={languageMap}
        styles={{
          control: (base) => ({
            ...base,
            fontFamily: "Helvetica",
            fontSize: "14px",
          }),
          option: (base) => ({
            ...base,
            fontFamily: "Helvetica",
            fontSize: "14px",
          }),
        }}
        onChange={onChange}
        placeholder={currentLanguage === "en" ? "Language / भाषा" : "चुनिए"}
      />
    </div>
  );
};
export default LanguageSelect;
