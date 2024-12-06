import { FC } from "react";
import styles from "components/Loader/styles.module.scss";

const Loader: FC<{
  customStyle?: { size: number; color: string; thickness: number };
}> = ({ customStyle }) => {
  return (
    <div
      style={
        customStyle
          ? {
              width: `${customStyle.size}px`,
              height: `${customStyle.size}px`,
              border: `${customStyle.thickness}px solid transparent`,
              borderTop: `${customStyle.thickness}px solid ${customStyle.color}`,
            }
          : {}
      }
      className={styles["loader"]}></div>
  );
};

export default Loader;
