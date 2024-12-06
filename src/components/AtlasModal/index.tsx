import CloseModalIcon from "assets/icons/CloseModalIcon";
import styles from "components/Modal/styles.module.scss";
import Text from "components/Text";
import { FC, ReactNode, useRef, useEffect, CSSProperties } from "react";

export interface ModalCompositeStyle {
  modal?: CSSProperties;
  content?: CSSProperties;
  backdrop?: CSSProperties;
}

export const AtlasModal: FC<{
  show: boolean;
  title: string;
  subtitle: string;
  style: ModalCompositeStyle;
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  onClose: () => void;
}> = ({ show, title, subtitle, style, header, content, footer, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    show
      ? modalRef.current?.classList.add(styles.visible)
      : modalRef.current?.classList.remove(styles.visible);
  }, [show]);

  return (
    <div
      ref={modalRef}
      style={style.backdrop}
      className={`${styles.modal__wrap}`}>
      <div style={style.modal} className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <div>
              <Text color="#A51C30" weight={400} size="18px" lineHeight="24px">
                {title}
              </Text>
              <Text color="#575A5C" weight={400} size="12px" lineHeight="17px">
                {subtitle}
              </Text>
            </div>
            <CloseModalIcon
              onClick={() => {
                onClose();
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          {header}
        </header>
        <div className={styles.content} style={style.content}>
          <>{content}</>
        </div>
        <footer className={styles.footer}>
          <>{footer}</>
        </footer>
      </div>
    </div>
  );
};
