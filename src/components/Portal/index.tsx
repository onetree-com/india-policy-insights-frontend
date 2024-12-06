import {
  FC,
  PropsWithChildren
} from "react";
import { createPortal } from "react-dom";

const PORTAL_ROOT = document.querySelector("#portal-root") as HTMLElement;
const Portal: FC<PropsWithChildren> = ({ children }) => createPortal(children, PORTAL_ROOT);

export default Portal;
