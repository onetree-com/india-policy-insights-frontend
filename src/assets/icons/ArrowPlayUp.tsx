import { SVGProps } from "react";

const ArrowPlayUp = ({
  size = 24,
  color = "#575A5C",
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
    <path d="m16.184 15-4.092-6L8 15h8.184Z" fill={color} stroke={color} />
  </svg>
);

export default ArrowPlayUp;
