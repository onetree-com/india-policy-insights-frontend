import { SVGProps } from "react";

const CloseIcon = ({
  width = 16,
  height = 17,
  color = "#565656",
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.354 6.146a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0Z"
      fill="#3D4247"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.354 10.854a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708Z"
      fill="#3D4247"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14.167A5.667 5.667 0 1 0 8 2.833a5.667 5.667 0 0 0 0 11.334Zm0 1A6.667 6.667 0 1 0 8 1.833a6.667 6.667 0 0 0 0 13.334Z"
      fill="#3D4247"
    />
  </svg>
);

export default CloseIcon;
