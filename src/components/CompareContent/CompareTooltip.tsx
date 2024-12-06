import { Dispatch, FC, SetStateAction } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";
import InfoIcon from "assets/icons/InfoIcon";
import CloseModalIcon from "assets/icons/CloseModalIcon";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  description: string;
  descriptionHi: string;
  setInfoRow: Dispatch<
    SetStateAction<
      | {
          show: boolean;
          title: string;
          description: string;
          descriptionHi: string;
        }
      | undefined
    >
  >;
}

const CompareTooltip: FC<Props> = ({
  description,
  descriptionHi,
  title,
  setInfoRow,
}) => {
  const { i18n } = useTranslation();
  return (
    <div className={cx(styles.compareTooltip, styles["compareTooltip-top"])}>
      <div className={cx(styles["compareTooltip-header"])}>
        <InfoIcon color="white" />
        <CloseModalIcon
          color="white"
          size={8.7}
          onClick={() => setInfoRow(undefined)}
        />
      </div>
      <span className={cx(styles["compareTooltip-title"])}>{title}</span>
      <p className={cx(styles["compareTooltip-paragrah"])}>
        {i18n.language === "en" ? description : descriptionHi}
      </p>
      <span className={styles["compareTooltip-arrow"]}></span>
    </div>
  );
};

export default CompareTooltip;
