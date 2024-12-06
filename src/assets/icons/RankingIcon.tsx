import { SVGProps } from "react";

const RankingIcon = ({
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
    {...props}
    viewBox="0 0 24 24"
  >
    <path
      d="M5 17h8M5 12h6M5 7h4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path
      d="m19 6-.53-.53.53-.53.53.53L19 6Zm3.53 2.47a.75.75 0 0 1-1.06 1.06l1.06-1.06Zm-6 1.06a.75.75 0 1 1-1.06-1.06l1.06 1.06ZM19.75 18a.75.75 0 0 1-1.5 0h1.5Zm-.22-12.53 3 3-1.06 1.06-3-3 1.06-1.06Zm0 1.06-3 3-1.06-1.06 3-3 1.06 1.06ZM18.25 18V6h1.5v12h-1.5Z"
      fill={color}
    />
  </svg>
);

export default RankingIcon;
