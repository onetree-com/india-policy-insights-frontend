import { SVGProps } from "react";

const RadioUnchecked = ({
  size = 12,
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
}): JSX.Element => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.99996 1.77777C5.39996 1.77777 1.66663 5.5111 1.66663 10.1111C1.66663 14.7111 5.39996 18.4444 9.99996 18.4444C14.6 18.4444 18.3333 14.7111 18.3333 10.1111C18.3333 5.5111 14.6 1.77777 9.99996 1.77777ZM9.99996 16.7778C6.31663 16.7778 3.33329 13.7944 3.33329 10.1111C3.33329 6.42777 6.31663 3.44444 9.99996 3.44444C13.6833 3.44444 16.6666 6.42777 16.6666 10.1111C16.6666 13.7944 13.6833 16.7778 9.99996 16.7778Z"
      fill="#D6D6D6"
    />
  </svg>
);

export default RadioUnchecked;
