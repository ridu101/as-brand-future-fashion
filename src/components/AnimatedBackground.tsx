import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #050B14 0%, #0A192F 30%, #0c2341 50%, #0A192F 70%, #050B14 100%)" }} />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)", top: "10%", left: "20%" }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #00F0FF 0%, transparent 70%)", bottom: "10%", right: "10%" }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)", top: "50%", left: "60%" }}
        animate={{ x: [0, 40, -60, 0], y: [0, -80, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default AnimatedBackground;
