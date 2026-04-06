import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";

interface Props {
  products: Product[];
}

const HeroCarousel = ({ products }: Props) => {
  const [current, setCurrent] = useState(0);
  const items = products.slice(0, 6);

  const next = useCallback(() => setCurrent(prev => (prev + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  if (items.length === 0) return null;

  const product = items[current];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl glass-card">
      <div className="relative aspect-[16/7] md:aspect-[16/6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex"
          >
            <div className="w-1/2 md:w-2/5 relative overflow-hidden">
              <img src={product.image} alt={product.title}
                className="w-full h-full object-cover" />
            </div>
            <div className="w-1/2 md:w-3/5 flex flex-col justify-center p-6 md:p-12">
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-2">{product.category}</span>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground leading-tight mb-3">{product.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 hidden sm:block">{product.description}</p>
              <div className="flex items-center gap-4">
                <span className="price-text text-2xl md:text-3xl">৳{product.price}</span>
                <Link to={`/product/${product.id}`}
                  className="neon-button px-5 py-2.5 text-sm">
                  Shop Now
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <button onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-panel flex items-center justify-center hover:bg-primary/10 transition-colors">
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-panel flex items-center justify-center hover:bg-primary/10 transition-colors">
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-foreground/20 hover:bg-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
