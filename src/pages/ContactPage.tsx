import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => (
  <div className="min-h-screen pt-28 px-6 max-w-3xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="section-title text-foreground mb-6">Contact Us</h1>
      <div className="glass-panel rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">support@asbrand.com</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">+880 1XXX XXXXXX</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-muted-foreground">Dhaka, Bangladesh</span>
        </div>
      </div>
    </motion.div>
  </div>
);

export default ContactPage;
