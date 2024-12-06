import { SVGProps } from "react";

const InfoIcon = ({
  size = 24,
  color = "#383838",
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
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 8.25C12.6904 8.25 13.25 7.69036 13.25 7C13.25 6.30964 12.6904 5.75 12 5.75C11.3096 5.75 10.75 6.30964 10.75 7C10.75 7.69036 11.3096 8.25 12 8.25ZM12 18.5C11.4477 18.5 11 18.0523 11 17.5L11 10.5C11 9.94772 11.4477 9.5 12 9.5C12.5523 9.5 13 9.94772 13 10.5L13 17.5C13 18.0523 12.5523 18.5 12 18.5Z"
      fill={color}
    />
  </svg>
);

export default InfoIcon;
