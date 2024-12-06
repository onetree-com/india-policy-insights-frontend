import { FC } from "react";
import styles from "./styles.module.scss";

const ProgressBar: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.filler}></div>
    </div>
  );
};

export default ProgressBar;
