import { SVGProps } from "react";

const CircleOutlined = ({
  size = 24,
  centerColor = "#3D4247",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  centerColor?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <g filter="url(#filter0_d_6734_1508)">
      <circle cx="10.5" cy="10.5" r="6.5" fill={centerColor} />
      <circle cx="10.5" cy="10.5" r="5.25" stroke="white" strokeWidth="2.5" />
    </g>
    <defs>
      <filter
        id="filter0_d_6734_1508"
        x="0"
        y="0"
        width="21"
        height="21"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6734_1508"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6734_1508"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default CircleOutlined;
