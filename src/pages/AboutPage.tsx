import { motion } from "framer-motion";

const AboutPage = () => (
  <div className="min-h-screen pt-28 px-6 max-w-3xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="section-title text-foreground mb-6">About AS Brand</h1>
      <div className="glass-panel rounded-2xl p-8 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-foreground">AS Brand</strong> is a premium fashion label founded by <strong className="text-foreground">Mohammad Azharul Islam</strong>, dedicated to bringing futuristic, high-quality clothing to the modern Bangladeshi consumer.
        </p>
        <p>
          Our collections span traditional Panjabis, casual streetwear, winter essentials, and everything in between — all curated with an eye for quality, fit, and contemporary design.
        </p>
        <p>
          We believe fashion should be an experience, not just a transaction. That's why we've built our platform with cutting-edge design and technology to make your shopping journey as immersive as the clothes themselves.
        </p>
      </div>
    </motion.div>
  </div>
);

export default AboutPage;
