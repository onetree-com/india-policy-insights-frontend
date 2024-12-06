import { SVGProps } from "react";

const DistrictIndicator = ({
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
    <g filter="url(#a)">
      <circle cx={11.5} cy={11.5} r={6.5} fill={color} />
      <circle cx={11.5} cy={11.5} r={5.25} stroke="#fff" strokeWidth={2.5} />
    </g>
    <defs>
      <filter
        id="a"
        x={1}
        y={1}
        width={21}
        height={21}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={2} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_6560_8527"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_6560_8527"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default DistrictIndicator;
