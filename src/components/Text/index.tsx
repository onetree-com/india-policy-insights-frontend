import { CSSProperties, FC } from "react";

interface Props {
  size?: string;
  weight?: number;
  color?: string;
  textAlign?:
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";
  lineHeight?: string;
  style?: CSSProperties;
  children: any;
  className?: string;
  htmlTitle?: string;
}

const Text: FC<Props> = ({
  size,
  weight,
  color,
  textAlign,
  lineHeight,
  style,
  className,
  children,
  htmlTitle,
}) => {
  return (
    <p
      title={htmlTitle}
      style={{
        fontSize: size ? size : "",
        color: color ? color : "",
        textAlign: textAlign ? textAlign : "start",
        lineHeight: lineHeight ? lineHeight : "",
        fontFamily: weight === 700 ? "Helvetica-Bold" : "Helvetica",
        ...style,
      }}
      className={className}>
      {children}
    </p>
  );
};

export default Text;
