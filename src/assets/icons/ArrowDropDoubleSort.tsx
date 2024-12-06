import { SVGProps } from "react";

const ArrowDropDoubleSort = ({
  size = 22,
  ascending,
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  ascending?: boolean;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="m10.35 19.57-3.757-4.508a.8.8 0 0 1 .615-1.312h6.667a.8.8 0 0 1 .615 1.312l-3.756 4.507a.25.25 0 0 1-.384 0Z"
      fill={!ascending ? "#383838" : "#C3C9D0"}
    />
    <path
      d="m10.734 2.98 3.756 4.508a.8.8 0 0 1-.615 1.312H7.208a.8.8 0 0 1-.615-1.312L10.35 2.98a.25.25 0 0 1 .384 0Z"
      fill={!ascending ? "#C3C9D0" : "#383838"}
    />
  </svg>
);

export default ArrowDropDoubleSort;
