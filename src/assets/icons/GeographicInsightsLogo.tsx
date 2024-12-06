import { SVGProps } from "react";

const ExpandUp = ({
  size = 24,
  color = "#565656",
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width="213"
    height="63"
    viewBox="0 0 213 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <rect width="213" height="63" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1">
        <use
          xlinkHref="#image0_6831_89620"
          transform="translate(-0.00131296) scale(0.00501313 0.0169492)"
        />
      </pattern>
      <image
        id="image0_6831_89620"
        width="200"
        height="59"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export default ExpandUp;