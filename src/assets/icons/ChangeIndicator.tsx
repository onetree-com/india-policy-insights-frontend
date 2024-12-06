import { SVGProps } from "react";

const ChangeIndicator = ({
  width = "100%",
  height = "100%",
  type = "right",
  ...props
}: SVGProps<SVGSVGElement> & {
  width?: string;
  height?: string;
  type: string;
}): JSX.Element => (
  <svg
    width={width}
    height={height}
    fill="none"
    style={{
      transform: `${type.toLowerCase() === "right" ? "" : "scaleX(-1)"}`,
      position: "absolute",
    }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M1 7.00012L4 4.08584L1 1.00012" stroke="white" />
    <path d="M12 7L15 4.08571L12 1" stroke="white" />
    <path d="M23 7L26 4.08571L23 1" stroke="white" />
    <path d="M34 7L37 4.08571L34 1" stroke="white" />
    <path d="M45 7L48 4.08571L45 1" stroke="white" />
    <path d="M56 7L59 4.08571L56 1" stroke="white" />
    <path d="M67 7L70 4.08571L67 1" stroke="white" />
    <path d="M78 7L81 4.08571L78 1" stroke="white" />
    <path d="M89 7L92 4.08571L89 1" stroke="white" />
    <path d="M100 7L103 4.08571L100 1" stroke="white" />
    <path d="M111 7L114 4.08571L111 1" stroke="white" />
    <path d="M122 7L125 4.08571L122 1" stroke="white" />
    <path d="M133 7L136 4.08571L133 1" stroke="white" />
    <path d="M144 7L147 4.08571L144 1" stroke="white" />
    <path d="M155 7L158 4.08571L155 1" stroke="white" />
    <path d="M166 7L169 4.08571L166 1" stroke="white" />
    <path d="M177 7L180 4.08571L177 1" stroke="white" />
    <path d="M188 7L191 4.08571L188 1" stroke="white" />
    <path d="M199 7L202 4.08571L199 1" stroke="white" />
    <path d="M210 7L213 4.08571L210 1" stroke="white" />
    <path d="M221 7L224 4.08571L221 1" stroke="white" />
    <path d="M232 7L235 4.08571L232 1" stroke="white" />
    <path d="M243 7L246 4.08571L243 1" stroke="white" />
    <path d="M254 7L257 4.08571L254 1" stroke="white" />
    <path d="M265 7L268 4.08571L265 1" stroke="white" />
    <path d="M276 7L279 4.08571L276 1" stroke="white" />
    <path d="M287 7L290 4.08571L287 1" stroke="white" />
    <path d="M298 7L301 4.08571L298 1" stroke="white" />
    <path d="M309 7L312 4.08571L309 1" stroke="white" />
    <path d="M320 7L323 4.08571L320 1" stroke="white" />
    <path d="M331 7L334 4.08571L331 1" stroke="white" />
    <path d="M342 7L345 4.08571L342 1" stroke="white" />
    <path d="M353 7L356 4.08571L353 1" stroke="white" />
    <path d="M364 7L367 4.08571L364 1" stroke="white" />
    <path d="M375 7L378 4.08571L375 1" stroke="white" />
    <path d="M386 7L389 4.08571L386 1" stroke="white" />
    <path d="M397 7L400 4.08571L397 1" stroke="white" />
    <path d="M408 7L411 4.08571L408 1" stroke="white" />
    <path d="M419 7L422 4.08571L419 1" stroke="white" />
    <path d="M430 7L433 4.08571L430 1" stroke="white" />
    <path d="M441 7L444 4.08571L441 1" stroke="white" />
    <path d="M452 7L455 4.08571L452 1" stroke="white" />
    <path d="M463 7L466 4.08571L463 1" stroke="white" />
    <path d="M474 7L477 4.08571L474 1" stroke="white" />
    <path d="M485 7L488 4.08571L485 1" stroke="white" />
    <path d="M496 7L499 4.08571L496 1" stroke="white" />
    <path d="M507 7L510 4.08571L507 1" stroke="white" />
    <path d="M518 7L521 4.08571L518 1" stroke="white" />
  </svg>
);

export default ChangeIndicator;
