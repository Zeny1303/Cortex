import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;