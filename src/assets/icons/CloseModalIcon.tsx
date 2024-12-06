import { SVGProps } from "react";

const CloseModalIcon = ({
  size = 15,
  color = "#565656",
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
    viewBox="0 0 15 15"
    {...props}
    style={{
      cursor: "pointer",
      ...props.style,
    }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.56 14.56a1.5 1.5 0 0 1-2.12 0l-12-12A1.5 1.5 0 1 1 2.56.44l12 12a1.5 1.5 0 0 1 0 2.12Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.44 14.56a1.5 1.5 0 0 1 0-2.12l12-12a1.5 1.5 0 0 1 2.12 2.12l-12 12a1.5 1.5 0 0 1-2.12 0Z"
      fill={color}
    />
  </svg>
);

export default CloseModalIcon;
