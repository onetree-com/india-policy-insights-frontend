import { SVGProps } from "react";

const DeepDiveIcon = ({
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
      d="M4 9.333V14c0 2.828 0 4.243.879 5.121C5.757 20 7.172 20 10 20h4c2.828 0 4.243 0 5.121-.879C20 18.243 20 16.828 20 14v-4c0-2.828 0-4.243-.879-5.121C18.243 4 16.828 4 14 4H9.333"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <path
      d="M15.75 8.875a.75.75 0 0 0-1.5 0h1.5ZM15 15v.75h.75V15H15Zm-6.125-.75a.75.75 0 0 0 0 1.5v-1.5ZM8.53 7.47a.75.75 0 0 0-1.06 1.06l1.06-1.06Zm5.72 1.405V15h1.5V8.875h-1.5ZM15 14.25H8.875v1.5H15v-1.5Zm.53.22-7-7-1.06 1.06 7 7 1.06-1.06Z"
      fill={color}
    />
  </svg>
);

export default DeepDiveIcon;
