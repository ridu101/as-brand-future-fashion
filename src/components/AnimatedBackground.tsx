import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f9fcff 0%, #eef6ff 40%, #ffffff 100%)" }} />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.15]"
        style={{ background: "radial-gradient(circle, #007BFF 0%, transparent 70%)", top: "10%", left: "15%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #00C6FF 0%, transparent 70%)", bottom: "10%", right: "10%" }}
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default AnimatedBackground;
