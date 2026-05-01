import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";

interface Props {
  products: Product[];
}

const HeroCarousel = ({ products }: Props) => {
  const items = products.slice(0, 6);
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const next = useCallback(() => setCurrent(p => (p + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, items.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 20;
    setParallax({ x, y });
  };

  if (items.length === 0) return null;

  const product = items[current];
  const previews = Array.from({ length: Math.min(4, items.length - 1) }, (_, i) =>
    items[(current + 1 + i) % items.length]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
      className="relative w-full overflow-hidden rounded-3xl border border-white/30 shadow-xl"
    >
      <div className="relative h-[420px] md:h-[540px]">
        {/* Background image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <motion.img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              animate={{ x: parallax.x, y: parallax.y }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              style={{ scale: 1.1 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Text overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-xl text-white"
            >
              <span className="inline-block text-xs font-mono uppercase tracking-widest bg-white/40 backdrop-blur-xl border border-white/30 px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-lg">
                {product.title}
              </h1>
              <p className="text-sm md:text-base text-white/90 mb-5 line-clamp-2 max-w-md drop-shadow">
                {product.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold drop-shadow">৳{product.price}</span>
                <Link
                  to={`/product/${product.id}`}
                  className="group inline-flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/30 hover:bg-white/60 text-white hover:text-foreground px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-xl"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right preview cards (desktop) */}
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
          {previews.map((p, i) => {
            const targetIdx = (current + 1 + i) % items.length;
            return (
              <motion.button
                key={`${p.id}-${targetIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setCurrent(targetIdx)}
                className="group w-32 h-40 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl hover:scale-105 transition-transform duration-300"
                style={{ filter: i === 0 ? "blur(0)" : `blur(${i * 0.5}px)` }}
              >
                <div className="relative w-full h-full">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-[10px] font-semibold text-white truncate">{p.title}</p>
                    <p className="text-[10px] font-mono text-white/80">৳{p.price}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/60 hover:text-foreground transition-colors duration-300 shadow-xl z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/60 hover:text-foreground transition-colors duration-300 shadow-xl z-20 md:hidden"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="hidden md:flex absolute right-44 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 items-center justify-center text-white hover:bg-white/60 hover:text-foreground transition-colors duration-300 shadow-xl z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-2"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
