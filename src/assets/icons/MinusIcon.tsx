import { SVGProps } from "react";

const MinusIcon = ({
  width = 17,
  height = 3,
  color = "#383838",
  ...props
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M.625 2.206a.684.684 0 0 1-.462-.164A.59.59 0 0 1 0 1.607v-.98A.59.59 0 0 1 .163.19.628.628 0 0 1 .625 0H15.56c.18 0 .326.064.434.19.127.11.19.255.19.436v.98a.546.546 0 0 1-.19.436.586.586 0 0 1-.434.164H.625Z"
      fill={color}
    />
  </svg>
);

export default MinusIcon;
