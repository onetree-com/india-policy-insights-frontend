import Text from "components/Text";
import { FC, ReactNode } from "react";
import styles from "components/Indicator/styles.module.scss";

interface Props {
  title: string;
  marginTop: string;
  content: ReactNode;
  classNameContent?: string;
}

const AtlasInformationBars: FC<Props> = ({
  content,
  title,
  marginTop,
  classNameContent,
}) => (
  <div style={{ marginTop }}>
    <Text
      style={{ letterSpacing: "0.04em", marginBottom: "5px" }}
      lineHeight="10px"
      weight={300}
      size="10px"
      color="#3D4247">
      {title}
    </Text>
    <div className={classNameContent ?? styles.percentGrid}>{content}</div>
  </div>
);

export default AtlasInformationBars;
