import { SVGProps } from "react";

const Logo = ({
  width = 100,
  height = 32,
  ...props
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
}): JSX.Element => (
  <svg
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 32"
    {...props}
  >
    <path
      d="m21.519 12.484-.506-.168c-.254-.083-.76-.502-1.098-.586-.337-.084-.759-.168-.759-.419s.084-.67.338-.838c.253-.167.337-.251.084-.419-.253-.084-.928-.419-1.097-.502-.169-.168-.085-.252-.338-.336-.253-.083-.337 0-.337-.335s-.338-.502-.169-.67c.169-.168.169.251.422.168.253-.084.337-.252.337-.252s.17-.503-.253-.503c-.422 0-.422-.586-.168-.67.253-.084.253-.251.337-.419.169-.251.253-.419.338-.67.084-.251 0-.503-.507-.587-.337-.167-.675 0-.675 0s-.422.42-.675.252c-.253-.168-.506-.42-.76-.67-.253-.252-.506-.336-.59-.336-.084 0-.169-.419-.338-.419-.084 0-.59 0-.928.252-.337.251-.506 0-.675.084-.169.083-.59.419-.506.67.084.251.168.084.506.251.338.168.422.084.422.168s.084.251.169.419c.084.167-.507.335-.507.586 0 .252.254.503.17.754-.085.252 0 .42.252.587.254.167.507.167.507.335s.253 0 .422.168c.168.167.084.335-.17.335-.252 0-.421.251-.337.335.085.084.17.167.085.251-.085.084-.085.252.084.252s-.59.335-.59.67-.507.167-.423.503c.085.335-.844.921-.844.921s-.253.42-.337.587c-.084.167-.675.419-.844.251-.253-.168-.169-.419-.422-.168-.253.252 0 .336-.422.503-.422.168-.253.503-.253.503s.084.167.253.167c.253 0 .338.084.253.252-.084.167-.253.335 0 .586.253.252.17 0 .338.084.169.084-.085.251.084.335.17.252.17.335.17.42.084.083.084.167.084.25-.085.084-.085.168.084.168.169.084 0 .168-.253.168-.254 0-.085-.168-.254-.168-.168 0-.337 0-.337.084s-.084.084-.253.084c-.169 0-.085-.084-.338-.084-.168 0-.422-.168-.506.167-.084.336-.253.168-.253.336 0 .167 0 .25.169.335.168.084-.085.084.084.251.169.168.338.168.59.251.254.084.423-.083.507-.083.084 0 .422-.252.338-.084-.085.167-.254.419-.422.419-.254 0-.17.084-.338.084-.169 0-.253.083-.253.083s-.169-.251-.253-.167c-.085.084 0 .167.084.335.085.168.422.419.59.586.17.168.591.838.93.67.337-.167.927-.167 1.096-.502.169-.335.085-.335.169-.587.084-.25 0-.335.253-.335 0 0-.169.252 0 .587.169.335.253 1.005.253 1.005l-.168.503h.084c4.304 0 7.932-3.016 8.776-7.038h-.084c-.085 0-.253.084-.422 0Z"
      fill="#A51C30"
    />
    <path
      d="M32.827 10.473c-.084 0-.253.084-.338 0-.084-.084-.253.084-.253 0-.084 0 0-.252.085-.335.084-.084 0-.335-.17-.335-.168.083-.168.167-.168.167s-.084 0-.084-.167c0-.084.084-.084.168-.168 0-.084-.168-.251-.337-.084h-.085c-.084 0-.253.168-.253.335 0 .168-.253-.083-.422 0h-.168s-.085-.167-.17-.083c-.084 0 0 .167-.084.083-.084 0-.084.084-.168.084-.085 0-.085.084-.17.168-.084.167 0 .251-.084.251h-.168c-.085.084-.253 0-.253.084s-.085.251-.17.335c-.084 0-.252.168-.252.168v.083s.084.168-.17.252c-.168.084-.168-.084-.337 0-.084.084-.084.167-.168.084-.085-.084-.17-.168-.17-.084s-.084.167 0 .251c.085.084.254 0 .254 0 .084 0 .169.084.169.335 0 .252.084.084.084.252 0 .167-.169-.084-.253 0-.084.083-.084.083-.253.083-.085 0-.591.168-.675.084-.17-.084-.338-.084-.338 0s-.169.168-.337.168c-.085 0-.254-.084-.338-.084-.085 0-.169.084-.253 0-.085-.084-.253-.168-.253-.252 0-.083.168 0 .084-.083-.084-.168-.169-.168-.084-.252.084-.083.084-.418-.17-.418-.252 0-.168.167-.252.167-.17 0-.085 0-.085.084.085.084-.084.251-.084.335 0 .168-.084.251 0 .335.084.084.169.168.169.335 0 .252 0 .252-.085.252-.084 0-.084-.084-.253-.084-.169 0-.253.167-.506.084-.253-.084-.085 0-.253 0-.253 0-.253-.252-.422-.084h-.085c-1.097 4.943-5.485 8.63-10.801 8.797.084.42.084.838.084.922.084.168.506 1.09.506 1.09s.675.837.675 1.256c0 .419.17 1.09.675 1.76.591.67.76 1.508.76 1.508s.253 1.089.506 1.424c.254.251.591.67.844.67s.675-.251.675-.67c0-.419.422-.419.422-.419s.422 0 .085-.251c0 0 0-.252.253-.335.253-.168.084-.168.169-.252.084-.168.422 0 .506-.084.084-.084 0-.754-.084-1.089-.085-.335.253-.754.253-.754s.422-.67.169-1.09c-.254-.418-.085-.753-.085-.753s.085-.252-.084-.67c-.17-.42.337-.755.59-.755.254 0 .422-.167.422-.335 0-.167.253 0 .507-.167.253-.084.675-.335.422-.503-.253-.168.506-.587.506-.587s.928-.67 1.181-1.089c.254-.419.254-.754.76-1.005.506-.252.844-.335 1.013-.67.168-.336.506-.42.253-.755s.084-.418.253-.586c.253-.084.59-.251.59-.503 0-.251.085.168.254.084.169-.084.253-.168.253-.251 0-.084.253 0 .253-.084s-.084-.084-.084-.251c0-.084.084-.168-.085-.335-.084-.252-.084-.42-.253-.503-.084-.084-.169-.084-.169-.252 0-.167.17-.083.085-.335-.085-.251-.338-.167-.338-.167s-.169-.084-.253-.168c-.084-.168 0-.335.169-.251.169.084 0-.335.169-.335.168 0 .421.083.421 0 0-.084-.084-.168-.337-.252-.253 0-.084-.167-.253-.167-.169-.084-.253 0-.169-.084 0-.084.084-.168 0-.168 0 0 .169-.167.169-.251.084-.084-.085-.084-.085-.084s-.168-.084 0-.084c.17.084.17.252.338.168.169 0 .169-.168.169-.084s.084.252.084.252 0 .083.253.083.085-.251.253-.167c.17.084.085.251.085.251s0 .168.084.252c.085.167 0 .167.085.167.168 0 .337.084.844 0 .506-.084.506 0 .59-.084.085-.083.507-.083.591.084.169.168-.169 0-.169.168 0 .167.085.418-.084.418-.169.084-.253.252-.338.252-.168 0-.253.084-.253.251 0 .168-.084.168 0 .335.085.168.085.335.169.252.169 0 .084.335.253.251.169-.084.169-.168.084-.335 0-.168.085-.251.085-.251v-.168c0-.084.169-.167.253-.084.084.084.169.252.169.335 0 .084-.085.252.084.335.169.168.253.42.253.42s0 .25.085.335c.084.083.084 0 .084-.084s.084-.084.084 0c.085.084.17.084.17-.168 0-.251 0 0 .084-.084.084-.083-.085-.335-.085-.335s-.169-.251-.084-.335c.084-.084.084.084.169 0 .084-.084.084-.167 0-.335v-.335c0-.084 0-.168-.085-.252-.084-.083-.084-.083 0-.083.085 0 .085.084.169.084s0-.084.084-.084c.085 0 0 .084.085.084.084 0 .084-.168.169-.084.084.084.084.167.084 0v-.252c0-.167.084-.251.169-.335.084-.083.169-.502.084-.502-.084 0-.084 0-.084-.168s.253-.251.253-.251.084-.084.084-.252c0-.167-.084-.419-.084-.502-.084-.084 0-.252.084-.252.085 0 .253-.084.253-.251.085-.168.17-.168.254-.252.084-.083.168-.167.337-.25.085-.085.085-.085.253-.085.17 0 .17.168.17.084.084 0 .084.084.168 0 .084 0-.084-.084-.169-.251-.084-.168 0-.252.084-.335.085-.084.17-.084.17-.252.168.252 0 .168-.085.168Z"
      fill="#A51C30"
    />
    <path
      d="M13.165 0C7.342 0 2.532 4.776 2.532 10.64c0 2.85 1.181 5.447 3.038 7.374L0 23.46l.76.754 5.57-5.53c1.856 1.592 4.219 2.514 6.835 2.514 5.907 0 10.633-4.776 10.633-10.557C23.797 4.86 19.072 0 13.165 0Zm0 20.108c-5.233 0-9.536-4.273-9.536-9.467 0-5.195 4.303-9.552 9.536-9.552 5.232 0 9.62 4.273 9.62 9.552 0 5.278-4.304 9.467-9.62 9.467Z"
      fill="#383838"
    />
    <path
      d="M38.903 18.014a1.43 1.43 0 0 0 1.435-1.425 1.43 1.43 0 0 0-1.435-1.424 1.43 1.43 0 0 0-1.435 1.424 1.43 1.43 0 0 0 1.435 1.425ZM62.025 18.014a1.43 1.43 0 0 0 1.435-1.425 1.43 1.43 0 0 0-1.435-1.424 1.43 1.43 0 0 0-1.434 1.424 1.43 1.43 0 0 0 1.434 1.425Z"
      fill="#A51C30"
    />
    <path
      d="M37.975 12.987s-.085-.084-.085-.168V6.871c0-.084 0-.084.085-.168 0 0 .084-.084.169-.084h.422c.084 0 .084 0 .168.084 0 0 .085.084.085.168v5.948c0 .084 0 .084-.085.168 0 0-.084.084-.169.084h-.421c-.085 0-.085-.084-.17-.084ZM41.013 12.987s-.085-.084-.085-.167V6.955c0-.084 0-.084.085-.168 0-.084.084-.084.168-.084h.592l.083.084 3.038 4.692V6.955c0-.084 0-.084.085-.168 0 0 .084-.084.169-.084h.422c.084 0 .084 0 .168.084 0 0 .085.084.085.168v5.865c0 .083 0 .083-.085.167 0 .084-.084.084-.168.084h-.422c-.085 0-.17-.084-.254-.168l-3.038-4.608v4.525c0 .083 0 .083-.084.167 0 0-.084.084-.169.084h-.422c-.084 0-.168-.084-.168-.084ZM47.848 12.987s-.084-.084-.084-.167V6.955c0-.084 0-.084.084-.168 0 0 .085-.084.169-.084h2.025c.928 0 1.604.168 2.026.587.422.419.59 1.005.59 1.843v1.424c0 .587-.084 1.006-.253 1.425-.169.335-.422.586-.844.838-.337.167-.844.251-1.519.251h-2.11s0-.084-.084-.084Zm2.279-.67c.422 0 .76-.084 1.012-.168.253-.083.422-.335.507-.586.084-.251.168-.587.168-1.006v-1.34c0-.587-.168-1.005-.422-1.34-.253-.252-.759-.42-1.35-.42h-1.35v4.86h1.435ZM54.684 12.987s-.085-.084-.085-.167V6.87c0-.084 0-.084.085-.168 0 0 .084-.083.168-.083h.422c.085.083.169.083.169.167s.084.084.084.168v5.948c0 .084 0 .084-.084.168 0 0-.084.084-.169.084h-.422c-.084-.084-.084-.168-.168-.168ZM57.13 12.987s-.084-.084-.084-.167v-.084l2.279-5.865c.084-.084.169-.168.337-.168h.591c.169 0 .253.084.253.168l2.279 5.865v.084c0 .083 0 .083-.084.167 0 0-.085.084-.17.084h-.337c-.084 0-.084 0-.169-.084l-.084-.084-.506-1.34h-3.038l-.507 1.34c-.084.084-.084.168-.253.168h-.422l-.084-.084Zm1.52-2.178h2.532L59.916 7.54 58.65 10.81ZM66.92 12.987s-.085-.084-.085-.167V6.955c0-.084 0-.084.085-.168 0 0 .084-.084.169-.084h2.278c.675 0 1.266.168 1.603.503.422.335.591.838.591 1.424 0 .587-.169 1.09-.59 1.425-.422.335-.929.502-1.604.502h-1.603v2.263c0 .083 0 .083-.085.167 0 0-.084.084-.168.084h-.422c-.085 0-.17-.084-.17-.084Zm2.363-3.184c.928 0 1.35-.419 1.35-1.173 0-.418-.084-.67-.338-.921-.168-.168-.506-.252-1.012-.252h-1.604v2.346h1.604ZM73.671 12.485c-.422-.42-.675-1.006-.675-1.844V9.133c0-.838.253-1.424.675-1.843.422-.419 1.013-.67 1.772-.67.76 0 1.35.251 1.772.67.422.419.675 1.005.675 1.843v1.508c0 .838-.253 1.425-.675 1.844-.422.418-1.012.586-1.856.586-.591.084-1.266-.168-1.688-.586Zm3.038-.587c.253-.251.422-.754.506-1.34V9.048c0-.586-.169-1.089-.506-1.34-.253-.335-.675-.42-1.181-.42-.507 0-.844.168-1.182.42-.253.335-.422.754-.506 1.34v1.508c0 .587.168 1.09.506 1.341.253.252.675.419 1.181.419.507.084.844-.084 1.182-.419ZM80 12.987s-.084-.084-.084-.167V6.87c0-.084 0-.084.084-.168 0 0 .084-.083.169-.083h.422c.084 0 .084 0 .169.083 0 0 .084.084.084.168v5.362h3.038c.084 0 .084 0 .169.084 0 0 .084.084.084.168v.335c0 .083 0 .083-.084.167-.085 0-.085.084-.17.084H80.17c-.085 0-.085-.084-.169-.084ZM85.654 12.987s-.084-.084-.084-.167V6.87c0-.084 0-.084.084-.168 0 0 .085-.083.169-.083h.422c.084 0 .084 0 .169.083.084.084.084.084.084.168v5.949c0 .083 0 .083-.084.167 0 0-.085.084-.17.084h-.421c-.084 0-.084-.084-.169-.084ZM89.03 12.485c-.422-.42-.676-1.006-.676-1.76V9.05c0-.754.254-1.34.675-1.76.422-.418 1.013-.67 1.857-.67.506 0 1.013.084 1.35.252.338.168.675.419.844.754.169.335.338.67.338 1.005 0 .084 0 .084-.085.168 0 0-.084.084-.168.084h-.422c-.085 0-.085 0-.17-.084 0 0-.084-.084-.084-.168-.084-.502-.253-.754-.59-1.005-.254-.168-.675-.251-1.097-.251-1.097 0-1.604.586-1.688 1.76V10.64c.084 1.173.59 1.76 1.688 1.76.422 0 .843-.084 1.097-.252.253-.167.422-.502.59-1.005 0-.084.085-.084.085-.168 0 0 .084-.083.169-.083h.422c.084 0 .084 0 .168.083 0 0 .085.084.085.168 0 .335-.085.67-.338 1.005-.253.336-.506.587-.844.755-.337.167-.844.25-1.35.25-.76 0-1.435-.25-1.856-.67ZM96.878 12.987s-.085-.084-.085-.167V10.64L94.6 6.955V6.87c0-.084 0-.084.085-.168.084-.083.084-.083.168-.083h.422c.085 0 .17.083.254.167L97.3 9.72l1.772-2.933c.084-.084.169-.167.253-.167h.422c.084 0 .084 0 .169.083 0 0 .084.084.084.168v.084l-2.194 3.686v2.179c0 .083 0 .083-.084.167 0 0-.085.084-.17.084h-.421c-.169 0-.253-.084-.253-.084ZM38.228 27.984c-.085-.084-.085-.168-.085-.252V19.69c0-.084 0-.168.085-.252.084-.083.169-.083.253-.083h.76c.084 0 .168 0 .253.084.084.083.084.167.084.25v7.96c0 .084 0 .168-.084.252-.085.084-.17.084-.254.084h-.759c-.084.083-.253.083-.253 0ZM42.279 27.984c-.085-.084-.085-.167-.085-.251v-8.044c0-.083 0-.167.084-.25.085-.085.17-.085.254-.085h.76c.084 0 .252 0 .252.084.085.084.085.168.085.252v.754c.337-.42.76-.755 1.181-1.006.422-.251 1.013-.335 1.688-.335 1.097 0 1.94.335 2.532 1.005.59.67.928 1.592.928 2.765v4.776c0 .084 0 .168-.085.252-.084.083-.168.083-.253.083h-.76c-.084 0-.168 0-.252-.084-.085-.083-.085-.167-.085-.25v-4.693c0-.838-.169-1.424-.59-1.927-.422-.419-1.013-.67-1.688-.67-.76 0-1.35.251-1.772.67-.422.419-.675 1.09-.675 1.927v4.692c0 .084 0 .168-.085.252-.084.083-.169.083-.253.083h-.76c-.253.084-.337.084-.422 0ZM53.587 27.9a4.75 4.75 0 0 1-1.182-.837c-.253-.335-.422-.587-.422-.838 0-.084 0-.168.085-.252.084-.083.168-.083.253-.083h.928l.169.167c.253.335.59.587.844.754.337.168.76.252 1.35.252.59 0 1.097-.084 1.519-.335.337-.252.59-.587.59-1.006 0-.251-.084-.503-.253-.67a1.636 1.636 0 0 0-.76-.42c-.337-.167-.927-.25-1.687-.418-1.013-.252-1.688-.503-2.11-.922-.422-.419-.59-.921-.59-1.592 0-.419.084-.837.337-1.256.253-.42.591-.67 1.097-.922.507-.251 1.097-.335 1.773-.335.759 0 1.35.084 1.856.335s.928.503 1.181.838c.254.335.422.586.422.838 0 .083 0 .167-.084.251-.084.084-.169.084-.253.084h-.675c-.17 0-.253-.084-.338-.168-.169-.251-.337-.419-.506-.502-.169-.084-.338-.252-.59-.336a3.052 3.052 0 0 0-.93-.167c-.59 0-1.012.084-1.265.335-.337.251-.422.503-.422.921 0 .252.084.42.169.587.084.168.337.335.76.419.337.168.843.251 1.603.419 1.097.251 1.856.586 2.278 1.005.422.42.675.922.675 1.592 0 .503-.169.922-.422 1.34-.253.42-.675.671-1.266.922-.59.252-1.18.336-1.94.336-.929 0-1.604-.084-2.194-.336ZM61.35 27.984c-.084-.084-.084-.168-.084-.252V19.69c0-.084 0-.168.084-.252.084-.083.169-.083.253-.083h.76c.084 0 .169 0 .253.084.084.083.084.167.084.25v7.96c0 .084 0 .168-.084.252-.084.084-.169.084-.253.084h-.76c-.084.083-.169.083-.253 0ZM66.751 31.335c-.59-.335-1.013-.67-1.181-1.089-.254-.419-.338-.754-.338-1.09 0-.083 0-.167.084-.25.085-.084.17-.084.254-.084h.76c.083 0 .168 0 .252.084.085.083.085.167.169.25.337.922 1.013 1.341 2.194 1.341.844 0 1.52-.167 1.941-.586.422-.335.59-1.006.59-1.927V26.81c-.674.838-1.603 1.257-2.784 1.257-1.181 0-2.11-.42-2.7-1.173-.591-.754-.929-1.76-.929-2.933v-.921c0-1.174.338-2.179.928-2.933.591-.754 1.52-1.173 2.7-1.173 1.182 0 2.11.419 2.786 1.34v-.753c0-.084 0-.252.084-.252.084-.084.169-.084.253-.084h.76c.084 0 .169 0 .253.084.084.084.084.168.084.252v8.294c0 2.598-1.35 3.938-3.966 3.938-.928.084-1.688-.084-2.194-.419Zm4.05-5.278c.423-.503.591-1.173.676-1.843V23.04c0-.755-.253-1.341-.675-1.844-.422-.502-1.013-.754-1.773-.754-.843 0-1.434.252-1.772.754a3.557 3.557 0 0 0-.59 2.011v.838c0 .838.253 1.508.59 2.01.253.503.844.755 1.688.755s1.435-.252 1.857-.754ZM75.696 27.984c-.084-.084-.084-.168-.084-.251V16.422c0-.084 0-.252.084-.252.085-.084.169-.084.253-.084h.76c.084 0 .253 0 .253.084.084.084.084.168.084.252v3.938c.338-.42.76-.755 1.182-.922.422-.252 1.013-.335 1.688-.335 1.097 0 1.94.335 2.531 1.005.591.67.928 1.592.928 2.765v4.776c0 .084 0 .167-.084.251-.084.084-.169.084-.253.084h-.844c-.084 0-.169 0-.253-.084-.085-.084-.085-.167-.085-.251v-4.692c0-.838-.168-1.425-.59-1.927-.422-.42-1.013-.67-1.772-.67-.76 0-1.35.25-1.772.67-.422.419-.676 1.089-.676 1.927v4.692c0 .084 0 .167-.084.251-.084.084-.169.084-.253.084h-.76c-.084.084-.168.084-.253 0ZM86.667 25.135v-4.524h-1.35c-.085 0-.17 0-.254-.084-.084-.084-.084-.167-.084-.251v-.587c0-.083 0-.167.084-.251.085-.084.169-.084.253-.084h1.35v-2.848c0-.084 0-.168.085-.252.084-.084.169-.084.253-.084h.76c.084 0 .169 0 .253.084.084.084.084.168.084.252v2.848h2.11c.084 0 .169 0 .253.084.085.084.085.168.085.251v.587c0 .084 0 .168-.085.251-.084.084-.169.084-.253.084H88.1v4.44c0 .587.085 1.006.253 1.341.17.335.507.42.929.42h1.012c.085 0 .17 0 .254.083.084.084.084.168.084.251v.503c0 .084 0 .168-.084.251-.085.084-.17.084-.254.084h-1.181c-1.604.084-2.447-.922-2.447-2.849ZM93.586 27.9a4.747 4.747 0 0 1-1.181-.837c-.253-.335-.422-.587-.422-.838 0-.084 0-.168.084-.252.085-.083.17-.083.254-.083h.928l.169.167c.253.335.59.587.843.754.338.168.76.252 1.35.252.591 0 1.098-.084 1.52-.335.337-.252.59-.587.59-1.006 0-.251-.084-.503-.253-.67a1.636 1.636 0 0 0-.76-.42c-.337-.167-.927-.25-1.687-.418-1.013-.252-1.688-.503-2.11-.922-.422-.419-.59-.921-.59-1.592 0-.419.084-.837.337-1.256.253-.42.59-.67 1.097-.922.507-.251 1.097-.335 1.772-.335.76 0 1.35.084 1.857.335.506.251.928.503 1.181.838.254.335.422.586.422.838 0 .083 0 .167-.084.251-.085.084-.169.084-.253.084h-.675c-.17 0-.254-.084-.338-.168-.169-.251-.338-.419-.506-.502-.17-.084-.338-.252-.591-.336a3.053 3.053 0 0 0-.928-.167c-.591 0-1.013.084-1.266.335-.338.251-.422.503-.422.921 0 .252.084.42.169.587.084.168.337.335.76.419.337.168.843.251 1.603.419 1.097.251 1.856.586 2.278 1.005.422.42.675.922.675 1.592 0 .503-.169.922-.422 1.34-.253.42-.675.671-1.266.922-.59.252-1.181.336-1.94.336-1.013 0-1.688-.084-2.195-.336Z"
      fill="#383838"
    />
  </svg>
);

export default Logo;