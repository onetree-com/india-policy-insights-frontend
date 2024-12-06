import ExpandDown from "assets/icons/ExpandDown";
import cx from "classnames";
import styles from "components/Header/styles.module.scss";
import Text from "components/Text";
import Tooltip from "components/Tooltip";
import { GlobalContext } from "context/globalContext";
import DivisionList, { DivisionKey } from "models/divisions";
import FeatureList, { FeatureKey } from "models/features";
import { FC, Fragment, memo, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelect from "i18n/LanguageSelect";

export type HeaderOptionType = {
  feature: FeatureKey;
  icon: ({ selected }: any) => JSX.Element;
  selected: boolean;
  disabled?: boolean;
  excluded?: boolean;
  exclude?: Array<string>;
};

export const HeaderOptions = memo<{
  options: Array<HeaderOptionType>;
  division: DivisionKey;
  classes: {
    option: any;
  };
}>(({ options, division, classes }) => {
  const navigate = useNavigate();
  const onClickHandler = (feature: string, division: string) => {
    navigate(`/${feature}/${division}`);
  };
  return (
    <Fragment>
      {options.map((option, index) => (
        <HeaderOption
          key={index}
          option={option}
          classes={{
            option: classes.option,
          }}
          onClick={() => {
            onClickHandler(
              FeatureList[option.feature].route,
              DivisionList[division].route
            );
          }}
        />
      ))}
    </Fragment>
  );
});

export const HeaderOption: FC<{
  option: HeaderOptionType;
  classes: {
    option: any;
  };
  onClick: () => void;
}> = ({ option, classes, onClick }) => {
  const style = useMemo(
    () =>
      option.selected
        ? {
            size: "14px",
            color: "#A51C30",
            weight: 700,
            lineHeight: "16.1px",
          }
        : {
            size: "14px",
            color: "#3D4247",
            weight: 400,
            lineHeight: "24px",
          },
    [option.selected]
  );
  const { globalState } = useContext(GlobalContext)!;
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        classes.option,
        option.selected && styles["active"],
        option.excluded && styles["icon-container__disabled"],
        option.disabled && styles["disabled"]
      )}
      onClick={() => {
        if (!option.excluded && !option.disabled) onClick();
        else {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 5000);
        }
      }}
      onMouseEnter={() => {
        if (option.excluded) setShowTooltip(true);
      }}
      onMouseLeave={() => {
        if (option.excluded) setShowTooltip(false);
      }}>
      {option.excluded && (
        <Tooltip
          top="auto"
          bottom="-16px"
          right="0px"
          show={showTooltip}
          arrow={false}
          style={{
            padding: "4px 8px",
            backgroundColor: "rgba(46, 45, 45, 0.85)",
            borderRadius: "4px",
            textTransform: "none",
            fontFamily: "Helvetica",
            fontSize: "11px",
            fontWeight: "400",
          }}
          label={t("feature_not_available") + `${t(globalState.divisionType)}`}
        />
      )}
      {option.icon({ selected: option.selected })}
      <Text {...style}>{t(FeatureList[option.feature].label)}</Text>
    </div>
  );
};

export const HeaderExpandDropdown: FC<{
  option: HeaderOptionType;
  showDropdown: boolean;
}> = ({ option, showDropdown }) => {
  return (
    <>
      {option && option.icon({ selected: true })}
      <Text
        size="14px"
        weight={400}
        color={showDropdown ? "#7E7E7E" : "#A51C30"}
        lineHeight="22px">
        {option ? FeatureList[option.feature].label : ""}
      </Text>
      <ExpandDown color={showDropdown ? "#A51C30" : "#7E7E7E"} />
    </>
  );
};

export const HeaderDropdown: FC<{
  options: Array<HeaderOptionType>;
  division: DivisionKey;
  show: boolean;
}> = ({ options, division, show }) => {
  return (
    <>
      {show && (
        <div className={styles["dropdown-options"]}>
          <HeaderOptions
            options={options}
            division={division}
            classes={{ option: styles["dropdown-option"] }}
          />
          <div
            className={`${styles["dropdown-option"]} ${styles.languageSelect}`}>
            <LanguageSelect />
          </div>
        </div>
      )}
    </>
  );
};
