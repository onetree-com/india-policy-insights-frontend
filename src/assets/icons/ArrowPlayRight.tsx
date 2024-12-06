import { SVGProps } from "react";

const ArrowPlayRight = ({
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
    {...props}
  >
    <path d="m9.092 16.092 6-4.092-6-4.092v8.184Z" fill={color} />
    <path
      d="m14.768 12.826-4.612 3.146a1 1 0 0 1-1.564-.826V8.854a1 1 0 0 1 1.564-.826l4.612 3.146a1 1 0 0 1 0 1.652Z"
      fill={color}
    />
  </svg>
);

export default ArrowPlayRight;
