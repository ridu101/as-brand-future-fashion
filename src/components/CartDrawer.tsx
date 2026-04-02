import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] glass-panel border-l border-border">
            <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="font-heading font-bold text-lg">Cart ({totalItems})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-primary/5 transition-colors duration-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                    <p className="font-heading">Your cart is empty</p>
                  </div>
                ) : (
                  items.map(item => (
                    <motion.div key={`${item.product.id}-${item.size}`} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                      className="glass-panel rounded-2xl p-3 flex gap-3">
                      <img src={item.product.image} alt={item.product.title} className="w-20 h-24 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-sm truncate">{item.product.title}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">Size: {item.size}</p>
                        <p className="price-text text-sm mt-1">৳{item.product.price}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="p-1 rounded-lg bg-secondary hover:bg-primary/10 transition-colors duration-300">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="p-1 rounded-lg bg-secondary hover:bg-primary/10 transition-colors duration-300">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.product.id, item.size)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors duration-300 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="price-text text-xl">৳{totalPrice}</span>
                  </div>
                  <Link to="/cart" onClick={() => setIsCartOpen(false)}
                    className="neon-button block w-full py-3 text-center rounded-xl font-heading font-semibold">
                    View Cart & Checkout
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
