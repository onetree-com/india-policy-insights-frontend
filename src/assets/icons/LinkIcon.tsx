import { SVGProps } from "react";

const LinkIcon = ({
  size = 24,
  color = "#3D4247",
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
      d="M10 16H7a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4h3M16 12H8M14 16h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-3"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LinkIcon;
