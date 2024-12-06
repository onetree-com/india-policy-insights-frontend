import { SVGProps } from "react";

const AddIcon = ({
  size = 18,
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
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      d="M9 4.592v8.727M13.364 8.956H4.636"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export default AddIcon;
