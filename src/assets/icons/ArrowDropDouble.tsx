import { SVGProps } from "react";

const ArrowDropDouble = ({
  size = 22,
  color = "#383838",
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
    {...props}
  >
    <path
      d="m10.35 19.57-3.757-4.508a.8.8 0 0 1 .615-1.312h6.667a.8.8 0 0 1 .615 1.312l-3.756 4.507a.25.25 0 0 1-.384 0ZM10.734 2.98l3.756 4.508a.8.8 0 0 1-.615 1.312H7.208a.8.8 0 0 1-.615-1.312L10.35 2.98a.25.25 0 0 1 .384 0Z"
      fill={color}
    />
  </svg>
);

export default ArrowDropDouble;
