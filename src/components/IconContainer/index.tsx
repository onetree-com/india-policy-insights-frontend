import { FC, ReactNode } from "react";
import styles from "components/IconContainer/styles.module.scss";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  background?: string;
}

const IconContainer: FC<Props> = ({ children, onClick, background }) => {
  return (
    <div
      id="icon-container"
      style={{ background: background }}
      onClick={onClick}
      className={styles.container}>
      {children}
    </div>
  );
};
export default IconContainer;
