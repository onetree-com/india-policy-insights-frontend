import { SVGProps } from "react";

const FileDockIcon = ({
  width = 15,
  height = 16,
  color = "#383838",
  ...props
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  color?: string;
}): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.48662 3.00415C8.43748 3.00041 8.36913 3 8.23224 3H5.625C5.01808 3 4.62576 3.00133 4.33669 3.04019C4.06561 3.07664 3.98064 3.13548 3.93306 3.18306C3.88548 3.23064 3.82664 3.3156 3.79019 3.58669C3.75133 3.87576 3.75 4.26808 3.75 4.875V11.125C3.75 11.7319 3.75133 12.1242 3.79019 12.4133C3.82664 12.6844 3.88548 12.7694 3.93306 12.8169C3.98064 12.8645 4.06561 12.9234 4.33669 12.9598C4.62576 12.9987 5.01808 13 5.625 13H9.375C9.98193 13 10.3742 12.9987 10.6633 12.9598C10.9344 12.9234 11.0194 12.8645 11.0669 12.8169C11.1145 12.7694 11.1734 12.6844 11.2098 12.4133C11.2487 12.1242 11.25 11.7319 11.25 11.125V6.01777C11.25 5.88088 11.2496 5.81252 11.2459 5.76339C11.2458 5.76246 11.2457 5.76156 11.2456 5.76069C11.2451 5.76002 11.2445 5.75934 11.2439 5.75863C11.2118 5.72125 11.1637 5.67262 11.0669 5.57583L8.67418 3.18306C8.57738 3.08626 8.52876 3.03822 8.49137 3.00612C8.49066 3.00551 8.48998 3.00493 8.48931 3.00436C8.48844 3.00429 8.48754 3.00422 8.48662 3.00415ZM8.28523 1.74984C8.48299 1.74897 8.73459 1.74786 8.96947 1.84515C9.20436 1.94244 9.38148 2.12113 9.5207 2.26159C9.53347 2.27447 9.54592 2.28703 9.55806 2.29918L11.9508 4.69194C11.963 4.70409 11.9755 4.71653 11.9884 4.7293C12.1289 4.86852 12.3076 5.04565 12.4049 5.28053C12.5021 5.51541 12.501 5.76701 12.5002 5.96478C12.5001 5.98291 12.5 6.00059 12.5 6.01777L12.5 11.1661C12.5 11.7202 12.5001 12.1976 12.4487 12.5799C12.3936 12.9896 12.2694 13.3823 11.9508 13.7008C11.6323 14.0194 11.2396 14.1436 10.8299 14.1987C10.4476 14.2501 9.97019 14.25 9.41613 14.25H5.58387C5.02981 14.25 4.55242 14.2501 4.17013 14.1987C3.76044 14.1436 3.36772 14.0194 3.04918 13.7008C2.73064 13.3823 2.60642 12.9896 2.55134 12.5799C2.49994 12.1976 2.49997 11.7202 2.5 11.1661L2.5 4.875C2.5 4.86124 2.5 4.84752 2.5 4.83386C2.49997 4.2798 2.49994 3.80242 2.55134 3.42013C2.60642 3.01043 2.73064 2.61771 3.04918 2.29918C3.36772 1.98064 3.76044 1.85642 4.17013 1.80134C4.55242 1.74994 5.0298 1.74997 5.58386 1.75C5.59753 1.75 5.61124 1.75 5.625 1.75H8.23224C8.24941 1.75 8.26709 1.74992 8.28523 1.74984Z"
      fill={color}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 8.625C5 8.27982 5.27982 8 5.625 8L9.375 8C9.72018 8 10 8.27982 10 8.625C10 8.97018 9.72018 9.25 9.375 9.25L5.625 9.25C5.27982 9.25 5 8.97018 5 8.625Z"
      fill={color}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5 11.125C5 10.7798 5.27982 10.5 5.625 10.5L8.125 10.5C8.47018 10.5 8.75 10.7798 8.75 11.125C8.75 11.4702 8.47018 11.75 8.125 11.75L5.625 11.75C5.27982 11.75 5 11.4702 5 11.125Z"
      fill={color}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.50001 4.875V2.375H8.75001V4.875C8.75001 5.1873 8.75134 5.35864 8.76732 5.47752C8.76753 5.47906 8.76773 5.48058 8.76794 5.48207C8.76943 5.48227 8.77095 5.48248 8.77249 5.48269C8.89136 5.49867 9.06271 5.5 9.37501 5.5H11.875V6.75H9.37501C9.36366 6.75 9.35233 6.75 9.341 6.75C9.07596 6.75006 8.81838 6.75011 8.60594 6.72154C8.36643 6.68934 8.09314 6.61089 7.86613 6.38388C7.63912 6.15687 7.56066 5.88358 7.52846 5.64407C7.4999 5.43163 7.49995 5.17405 7.5 4.90901C7.50001 4.89768 7.50001 4.88635 7.50001 4.875Z"
      fill={color}
    />
  </svg>
);

export default FileDockIcon;