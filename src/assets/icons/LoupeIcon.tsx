import { SVGProps } from "react";

const LoupeIcon = ({
  size = 17,
  color = "#7E7E7E",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8.00001"
      cy="7.99992"
      r="6.66667"
      stroke="#7E7E7E"
      stroke-width="1.5"
    />
    <path
      d="M15.5 15.5L13 13"
      stroke="#7E7E7E"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M6.78845 11.4095L6.66705 11.4095C5.72424 11.4095 5.25284 11.4095 4.95994 11.1166C4.66705 10.8237 4.66705 10.3523 4.66705 9.40948L4.66705 9.28809"
      stroke="#7E7E7E"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      d="M9.28845 11.4095L9.40985 11.4095C10.3527 11.4095 10.8241 11.4095 11.117 11.1166C11.4099 10.8237 11.4099 10.3523 11.4099 9.40948L11.4099 9.28809"
      stroke="#7E7E7E"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      d="M6.78845 4.66644L6.66705 4.66644C5.72424 4.66644 5.25284 4.66644 4.95995 4.95934C4.66705 5.25223 4.66705 5.72363 4.66705 6.66644L4.66705 6.78784"
      stroke="#7E7E7E"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      d="M9.28845 4.66644L9.40985 4.66644C10.3527 4.66644 10.8241 4.66644 11.117 4.95934C11.4099 5.25223 11.4099 5.72363 11.4099 6.66644L11.4099 6.78784"
      stroke="#7E7E7E"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
);

export default LoupeIcon;
