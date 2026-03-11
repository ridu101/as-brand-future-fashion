import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  const inputCls = "w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50";

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">We'd love to hear from you</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 space-y-5">
              <h2 className="font-heading text-lg font-bold text-foreground">Get in Touch</h2>
              {[
                { icon: Mail, text: "support@asbrand.com", label: "Email" },
                { icon: Phone, text: "+880 1XXX XXXXXX", label: "Phone" },
                { icon: MapPin, text: "Dhaka, Bangladesh", label: "Location" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm text-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Owner</h2>
              <p className="text-foreground">Mohammad Azharul Islam</p>
              <p className="text-sm text-muted-foreground mt-1">Founder & CEO, AS Brand</p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Follow Us</h2>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: MessageCircle, label: "WhatsApp" },
                ].map(s => (
                  <button key={s.label} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <s.icon className="w-5 h-5 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
              <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} />
              <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className={`${inputCls} min-h-[120px]`} />
              <button type="submit" className="neon-button w-full py-3 text-sm font-heading font-semibold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-10 glass-panel rounded-2xl overflow-hidden h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.38703692693!2d90.27923710646989!3d23.780573258035957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563b06e5a1e23!2sDhaka!5e0!3m2!1sen!2sbd!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            title="AS Brand Location"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
