import { SVGProps } from "react";

const Indicator2016 = ({
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
    <g filter='url(#filter0_d_6388_852)'>
      <circle cx='11.5' cy='11.5' r='6.5' fill={color} />
      <circle cx='11.5' cy='11.5' r='5.25' stroke='white' strokeWidth='2.5' />
    </g>
    <path
      d='M14.5853 9.6968L12.4529 2.99491C12.1573 2.06585 10.8427 2.06585 10.5471 2.99491L8.41466 9.6968C8.20945 10.3417 8.69078 11 9.36758 11H11.5H13.6324C14.3092 11 14.7906 10.3417 14.5853 9.6968Z'
      fill={color}
      stroke={color}
    />
    <defs>
      <filter
        id='filter0_d_6388_852'
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
          result='effect1_dropShadow_6388_852'
        />
        <feBlend
          mode='normal'
          in='SourceGraphic'
          in2='effect1_dropShadow_6388_852'
          result='shape'
        />
      </filter>
    </defs>
  </svg>
);

export default Indicator2016;
