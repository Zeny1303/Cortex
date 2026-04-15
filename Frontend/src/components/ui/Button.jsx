import { motion } from "framer-motion";

const Button = ({ children, className = "", ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-xl px-4 py-2 font-medium transition bg-gradient-to-r from-indigo-600 to-blue-600 text-white ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;