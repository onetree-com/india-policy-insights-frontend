import { FC } from "react";
import styles from "components/Checkbox/styles.module.scss";
import cx from "classnames";

interface Props {
  onClick: (isChecked: boolean) => void;
  isChecked: boolean;
  customStyles?: React.CSSProperties;
}

const Checkbox: FC<Props> = ({ onClick, isChecked, customStyles }) => {
  return (
    <svg
      style={customStyles}
      className={cx(styles.checkbox, isChecked && styles["checkbox--active"])}
      aria-hidden="true"
      viewBox="0 0 15 11"
      fill="none"
      onClick={(): void => {
        onClick(isChecked);
      }}>
      <path
        d="M1 4.5L5 9L14 1"
        strokeWidth="2"
        stroke={isChecked ? "#fff" : "none"}
      />
    </svg>
  );
};

export default Checkbox;
