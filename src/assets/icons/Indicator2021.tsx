import { SVGProps } from "react";

const Indicator2021 = ({
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
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}>
    <g filter='url(#filter0_d_6388_858)'>
      <circle cx='11.5' cy='11.5' r='6.5' fill={color} />
      <circle cx='11.5' cy='11.5' r='5.25' stroke='white' strokeWidth='2.5' />
    </g>
    <path
      d='M8.41465 13.3032L10.5471 20.0051C10.8427 20.9342 12.1573 20.9342 12.4529 20.0051L14.5853 13.3032C14.7906 12.6583 14.3092 12 13.6324 12L11.5 12L9.36758 12C8.69077 12 8.20944 12.6583 8.41465 13.3032Z'
      fill={color}
      stroke={color}
    />
    <defs>
      <filter
        id='filter0_d_6388_858'
        x='1'
        y='1'
        width='21'
        height='21'
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'>
        <feFlood floodOpacity='0' result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          result='hardAlpha'
        />
        <feOffset />
        <feGaussianBlur stdDeviation='2' />
        <feColorMatrix
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
        />
        <feBlend
          mode='normal'
          in2='BackgroundImageFix'
          result='effect1_dropShadow_6388_858'
        />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_6388_858'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default Indicator2021;
