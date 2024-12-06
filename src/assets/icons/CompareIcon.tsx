import { SVGProps } from "react";

const CompareIcon = ({
  size = 24,
  color1 = "#3D4247",
  color2 = "#575A5C",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color1?: string;
  color2?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect
      x={3}
      y={5}
      width={8}
      height={8}
      rx={1}
      stroke={color1}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <rect
      x={13}
      y={13}
      width={8}
      height={8}
      rx={1}
      stroke={color2}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default CompareIcon;
