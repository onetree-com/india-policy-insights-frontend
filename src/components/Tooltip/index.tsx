import { FC } from "react";
import styles from "components/Tooltip/styles.module.scss";
import cx from "classnames";

const Tooltip: FC<{
  label: string;
  arrow?: boolean;
  show?: boolean;
  left?: string;
  top?: string;
  bottom?: string;
  right?: string;
  style?: object;
}> = ({
  label,
  arrow = true,
  show,
  left = "auto",
  top = "-15px",
  bottom = "auto",
  right = "auto",
  style
}) => {
  return (
    <section
      className={cx(styles.tooltip, styles.top, show && styles["inline-block"])}
      style={{ left: left, top: top, bottom: bottom, right: right, ...style }}>
      {arrow && <label className={styles["tooltip-arrow"]}></label>}
      <label className={styles["tooltip-label"]}>{label}</label>
    </section>
  );
};

export default Tooltip;
