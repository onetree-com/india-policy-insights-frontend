import AtlasIcon from "assets/icons/AtlasIcon";
import CompareIcon from "assets/icons/CompareIcon";
import DeepDiveIcon from "assets/icons/DeepDiveIcon";
import CreateReportIcon from "assets/icons/CreateReportIcon";
import ExpandRight from "assets/icons/ExpandRight";
import Isotipo from "assets/icons/Isotipo";
import Logo from "assets/icons/Logo";
import RankingIcon from "assets/icons/RankingIcon";
import LanguageSelect from "../../i18n/LanguageSelect";
import cx from "classnames";
import styles from "components/Header/styles.module.scss";
import { GlobalContext, GlobalNavigationType } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import DivisionList, { DivisionKey } from "models/divisions";
import { FC, useContext, useMemo, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import { useTranslation } from "react-i18next";
import {
  HeaderDropdown,
  HeaderExpandDropdown,
  HeaderOptions,
  HeaderOptionType,
} from "./HeaderOptions";

type HeaderProperties = GlobalNavigationType & {};

const Header: FC<HeaderProperties> = ({ feature, division, exclude }) => {
  var options = useHeaderOptions({ feature, division, exclude });
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const isTablet = useMediaQuery(MediaQueries.TABLET);

  return (
    <>
      {isDesktop || isTablet ? (
        <DesktopHeader options={options} division={division} />
      ) : (
        <MobileHeader options={options} division={division} />
      )}
    </>
  );
};

export default Header;

const DesktopHeader: FC<{
  options: Array<HeaderOptionType>;
  division: DivisionKey;
}> = ({ options, division }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <a href={process.env.REACT_APP_WEBSITE_HOME_URL}>
            <Logo />
          </a>
          <div className={styles.border}></div>
          <div className={styles.breadcrumb}>
            <a
              className={styles.select}
              href={process.env.REACT_APP_WEBSITE_URL}>
              {t("data_explorer")}
            </a>
            <ExpandRight size={24} />
            <div className={styles.division}>
              {t(DivisionList[division].label)}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <LanguageSelect />
          <HeaderOptions
            options={options}
            division={division}
            classes={{ option: styles["icon-container"] }}
          />
        </div>
      </div>
    </>
  );
};

const MobileHeader: FC<{
  options: Array<HeaderOptionType>;
  division: DivisionKey;
}> = ({ options, division }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const onExpandDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.container}>
        <div className={cx(styles.left, styles.selectMobile)}>
          <Isotipo />
          <div className={styles.border}></div>
          <div className={styles.breadcrumb}>
            <div className={styles.linkIconContainer}>
              <a
                className={styles.select}
                href={process.env.REACT_APP_WEBSITE_URL}>
                {t("data_explorer")}
              </a>
              <ExpandRight size={18} />
            </div>
            <div className={styles.division}>
              {DivisionList[division].label}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles["mobile-options"]} onClick={onExpandDropdown}>
            <HeaderExpandDropdown
              option={options.find((o) => o.selected)!}
              showDropdown={showDropdown}
            />
          </div>
        </div>
      </div>
      <HeaderDropdown
        options={options}
        division={division}
        show={showDropdown}
      />
    </>
  );
};

const options: Array<HeaderOptionType> = [
  {
    feature: "ATLAS",
    icon: ({ selected }: any) => (
      <AtlasIcon
        color={selected ? "#A51C30" : "#3D4247"}
        bottomColor={selected ? "#E38C98" : "#3D4247"}
      />
    ),
    selected: false,
    disabled: false,
    exclude: [],
  },
  {
    feature: "RANKING",
    icon: ({ selected }: any) => (
      <RankingIcon color={selected ? "#A51C30" : "#3D4247"} />
    ),
    selected: false,
    disabled: false,
    exclude: [
      DivisionList.VILLAGES.label,
      DivisionList.ASSEMBLY_CONSTITUENCIES.label,
    ],
  },
  {
    feature: "DEEP_DIVE",
    icon: ({ selected }: any) => (
      <DeepDiveIcon color={selected ? "#A51C30" : "#3D4247"} />
    ),
    selected: false,
    disabled: false,
    exclude: [],
  },
  {
    feature: "COMPARE",
    icon: ({ selected }: any) => (
      <CompareIcon
        color1={selected ? "#A51C30" : "#3D4247"}
        color2={selected ? "#E38C98" : "#3D4247"}
      />
    ),
    selected: false,
    disabled: false,
    exclude: [],
  },
  {
    feature: "CREATE_REPORT",
    icon: ({ selected }: any) => (
      <CreateReportIcon color={selected ? "#A51C30" : "#3D4247"} />
    ),
    selected: false,
    disabled: true,
    exclude: [],
  },
];

const useHeaderOptions = ({ feature }: HeaderProperties) => {
  const { globalState } = useContext(GlobalContext)!;

  return useMemo<Array<HeaderOptionType>>(
    () =>
      options.map((option) => ({
        ...option,
        selected: feature === option.feature,
        disabled: option.disabled,
        excluded: option.exclude?.some(
          (option: any) => option === globalState.divisionType
        ),
      })),
    [feature, globalState.divisionType]
  );
};
