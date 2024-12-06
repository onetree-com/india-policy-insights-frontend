import { motion } from "framer-motion";
import { FC, PropsWithChildren } from "react";

const TransitionWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.div
      initial={{ x: -25, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -25, opacity: 0 }}
      transition={{
        duration: 0,
      }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionWrapper;
