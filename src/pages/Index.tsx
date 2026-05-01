import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Mail } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import ProductSlider from "@/components/ProductSlider";
import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { toast } from "sonner";

const Index = () => {
  const { getTrendingProducts, getFeaturedProducts, getSeasonalProducts, products } = useProducts();
  const trending = getTrendingProducts().slice(0, 8);
  const featured = getFeaturedProducts().slice(0, 8);
  const latestProducts = products.slice(0, 6);

  // Show only the selected seasonal collection if one is active
  const savedSeason = localStorage.getItem("clothify_season");
  const seasonalProducts = savedSeason ? getSeasonalProducts(savedSeason) : [];
  const seasonLabels: Record<string, string> = { eid: "🌙 Eid Collection", winter: "❄️ Winter Collection", summer: "☀️ Summer Collection" };

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
      {/* Hero Carousel */}
      <section className="px-6 pt-28 pb-10 max-w-7xl mx-auto">
        <HeroCarousel products={latestProducts} />
      </section>

      {/* Seasonal Collection (if selected) */}
      {savedSeason && seasonalProducts.length > 0 && (
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <motion.div {...sectionAnim}>
            <SectionHeader title={seasonLabels[savedSeason] || "Seasonal Collection"} subtitle="Curated picks for the season" link="/shop" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {seasonalProducts.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </motion.div>
        </section>
      )}

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Trending Now" subtitle="Most popular picks this season" link="/trending" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <SectionHeader title="Latest Collection" subtitle="Fresh arrivals just for you" link="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto">
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

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div {...sectionAnim}>
          <h2 className="section-title text-foreground text-center mb-10">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rahim K.", text: "Amazing quality and modern design! Clothify Shopping never disappoints.", rating: 5 },
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

      <section className="px-6 py-16 max-w-3xl mx-auto">
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

export default Index;
