import { SVGProps } from "react";

const MenuKebab = ({
  size = 24,
  color = "#7E7E7E",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <circle
      cx="12"
      cy="6"
      r="1"
      transform="rotate(-180 12 6)"
      fill="#383838"
      stroke="#383838"
    />
    <circle
      cx="12"
      cy="11.5"
      r="1"
      transform="rotate(-180 12 11.5)"
      fill="#383838"
      stroke="#383838"
    />
    <circle
      cx="12"
      cy="17"
      r="1"
      transform="rotate(-180 12 17)"
      fill="#383838"
      stroke="#383838"
    />
  </svg>
);

export default MenuKebab;
