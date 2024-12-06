import { SVGProps } from "react";

const Arrow = ({
  size = 24,
  color = "#F5F4F4",
  strokeWidth = 2,
  arrowType = "up",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
  arrowType?: "up" | "down";
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    style={{
      transform: `${arrowType.toLowerCase() === "up" ? "" : "scaleY(-1)"}`,
    }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M17 13L12.6286 8.5L8 13"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <path d="M12.5 9.5L12.5 18" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

export default Arrow;
