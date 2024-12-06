import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";

const Popup: FC<{
  children: ReactNode;
  show: boolean;
  position: "left" | "right";
}> = ({ children, show, position }) => {
  return (
    <section
      style={position === "left" ? { left: "100%" } : { right: "700%" }}
      className={styles.popup}>
      <div className={`${styles.popupContent} ${show ? styles.show : ""}`}>
        {children}
      </div>
    </section>
  );
};

export default Popup;
