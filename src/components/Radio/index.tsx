import cx from "classnames";
import styles from "components/Radio/styles.module.scss";
import { FC, ReactNode, useContext, useState } from "react";
import {
  DivisionTypes,
  GlobalContext
} from "../../context/globalContext/index";

interface Props {
  onChange: () => void;
  value: string;
  customDot?: ReactNode;
  isChecked?: boolean;
}

const Radio: FC<Props> = ({ onChange, value, customDot, isChecked }) => {
  const { globalState } = useContext(GlobalContext)!;
  const [selected, setSelected] = useState(
    globalState.selectedDivision?.division?.geoId === value
  );
  return (
    <div
      className={styles["modern-radio-container"]}
      onClick={() => {
        onChange();
        setSelected(!selected);
      }}>
      <div
        className={cx(
          styles["radio-outer-circle"],
          `${
            isChecked
              ? null
              : styles.unselected ??
                globalState.divisionType === DivisionTypes.Village
              ? globalState.selectedDivision?.village?.geoId !== undefined &&
                globalState.selectedDivision?.village?.geoId !== value
                ? styles["unselected"]
                : null
              : globalState.selectedDivision?.division?.geoId !== undefined &&
                globalState.selectedDivision?.division?.geoId !== value
              ? styles["unselected"]
              : null
          }`
        )}>
        {customDot ?? (
          <div
            className={cx(
              styles["radio-inner-circle"],
              `${
                isChecked
                  ? null
                  : styles.unselected ??
                    globalState.divisionType === DivisionTypes.Village
                  ? globalState.selectedDivision?.village?.geoId ===
                      undefined ||
                    globalState.selectedDivision?.village?.geoId !== value
                    ? styles["unselected-circle"]
                    : null
                  : globalState.selectedDivision?.division?.geoId ===
                      undefined ||
                    globalState.selectedDivision?.division?.geoId !== value
                  ? styles["unselected-circle"]
                  : null
              }`
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Radio;
