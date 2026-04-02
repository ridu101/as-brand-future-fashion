import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star, Mail } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { toast } from "sonner";

const Index = () => {
  const { getTrendingProducts, getFeaturedProducts, getSeasonalProducts } = useProducts();
  const trending = getTrendingProducts().slice(0, 8);
  const featured = getFeaturedProducts().slice(0, 8);
  const eidCollection = getSeasonalProducts("eid").slice(0, 4);
  const winterCollection = getSeasonalProducts("winter").slice(0, 4);
  const summerCollection = getSeasonalProducts("summer").slice(0, 4);
  const [email, setEmail] = useState("");

  const sectionAnim = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6 },
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed to newsletter!");
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08] bg-[radial-gradient(circle,#007BFF_0%,transparent_70%)] animate-pulse-glow" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">New Collection 2025</span>
          </motion.div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
            <span className="text-foreground">Redefine</span><br />
            <span className="text-gradient">Your Style</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Premium fashion curated by AS Brand. Where modern design meets timeless elegance.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="neon-button px-8 py-3.5 text-base flex items-center gap-2">Shop Now <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/categories" className="neon-button-outline px-8 py-3.5 text-base">Explore Collection</Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Trending Now" subtitle="Most popular picks this season" link="/trending" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Latest Collection" subtitle="Fresh arrivals just for you" link="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <h2 className="section-title text-foreground text-center mb-12">Seasonal Collections</h2>
          <div className="space-y-16">
            <SeasonSection title="🌙 Eid Collection" products={eidCollection} />
            <SeasonSection title="❄️ Winter Collection" products={winterCollection} />
            <SeasonSection title="☀️ Summer Collection" products={summerCollection} />
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Featured Categories" subtitle="Browse by category" link="/categories" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link to={`/${cat.slug}`} className="block group">
                  <div className="glass-card overflow-hidden relative">
                    <div className="aspect-[3/5] overflow-hidden">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading font-bold text-lg text-foreground">{cat.name}</h3>
                      <span className="text-xs text-primary font-mono mt-1 inline-flex items-center gap-1">Explore <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <h2 className="section-title text-foreground text-center mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rahim K.", text: "Amazing quality and modern design! AS Brand never disappoints.", rating: 5 },
              { name: "Nusrat A.", text: "The panjabi collection is stunning. Fast delivery too.", rating: 5 },
              { name: "Tanvir H.", text: "Best online shopping experience. Love the clean design!", rating: 4 },
            ].map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 mb-4">"{review.text}"</p>
                <p className="text-xs font-heading font-bold text-foreground">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20 max-w-3xl mx-auto">
        <motion.div {...sectionAnim} className="glass-card p-8 md:p-12 text-center">
          <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">Stay Updated</h2>
          <p className="text-sm text-muted-foreground mb-6">Subscribe to get exclusive offers and new arrivals.</p>
          <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300" />
            <button type="submit" className="neon-button px-6 py-3 text-sm">Subscribe</button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, link }: { title: string; subtitle: string; link: string }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="section-title text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
    <Link to={link} className="text-sm text-primary hover:underline font-mono hidden md:flex items-center gap-1">
      View All <ArrowRight className="w-3 h-3" />
    </Link>
  </div>
);

const SeasonSection = ({ title, products }: { title: string; products: any[] }) => (
  <div>
    <h3 className="font-heading text-xl font-semibold text-foreground mb-6">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  </div>
);

export default Index;
