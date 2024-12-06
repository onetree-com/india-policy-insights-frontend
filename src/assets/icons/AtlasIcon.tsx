import { SVGProps } from "react";

const AtlasIcon = ({
  size = 24,
  color = "#A51C30",
  bottomColor = "#E38C98",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  bottomColor?: string;
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
      d="M18.25 10c0 2.236-1.139 4.066-2.527 5.467-1.388 1.4-2.963 2.304-3.67 2.671a.106.106 0 0 1-.106 0c-.707-.367-2.282-1.272-3.67-2.671C6.89 14.067 5.75 12.237 5.75 10a6.25 6.25 0 1 1 12.5 0Z"
      stroke={color}
      strokeWidth={1.5}
    />
    <path
      d="M8 20.25a.75.75 0 0 0 0 1.5v-1.5Zm8 1.5a.75.75 0 0 0 0-1.5v1.5Zm-8 0h8v-1.5H8v1.5Z"
      fill={bottomColor}
    />
    <circle cx={12} cy={10} r={2.25} stroke={color} strokeWidth={1.5} />
  </svg>
);

export default AtlasIcon;
