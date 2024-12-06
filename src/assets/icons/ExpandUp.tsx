import { SVGProps } from "react";

const ExpandUp = ({
  size = 24,
  color = "#565656",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="m17 14.32-5-5-5 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ExpandUp;
