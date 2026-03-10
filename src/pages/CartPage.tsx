import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [deliveryLocation, setDeliveryLocation] = useState<"dhaka" | "outside">("dhaka");
  const deliveryCharge = deliveryLocation === "dhaka" ? 60 : 120;
  const finalTotal = totalPrice + deliveryCharge;

  const handleCheckout = () => {
    toast.success("Order placed successfully! Cash on delivery.", {
      description: `Total: ৳${finalTotal} (including ৳${deliveryCharge} delivery)`,
    });
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop" className="neon-button px-6 py-2.5 text-sm">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="section-title text-foreground mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}`} className="glass-panel rounded-2xl p-4 flex gap-4">
                <img src={item.product.image} alt={item.product.title} className="w-24 h-28 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">{item.product.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Size: {item.size}</p>
                  <p className="price-text mt-1">৳{item.product.price}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="p-1 rounded-lg bg-secondary/50 hover:bg-primary/20"><Minus className="w-3 h-3" /></button>
                      <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="p-1 rounded-lg bg-secondary/50 hover:bg-primary/20"><Plus className="w-3 h-3" /></button>
                    </div>
                    <p className="price-text">৳{item.product.price * item.quantity}</p>
                    <button onClick={() => removeItem(item.product.id, item.size)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-panel rounded-2xl p-6 h-fit sticky top-28">
            <h3 className="font-heading font-bold text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">৳{totalPrice}</span>
              </div>

              <div>
                <p className="text-muted-foreground mb-2">Delivery Location</p>
                <div className="flex gap-2">
                  {(["dhaka", "outside"] as const).map(loc => (
                    <button
                      key={loc}
                      onClick={() => setDeliveryLocation(loc)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono transition-all ${
                        deliveryLocation === loc ? "neon-button" : "glass-panel"
                      }`}
                    >
                      {loc === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-mono">৳{deliveryCharge}</span>
              </div>

              <div className="border-t border-border/30 pt-3 flex justify-between">
                <span className="font-heading font-semibold">Total</span>
                <span className="price-text text-xl">৳{finalTotal}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground glass-panel rounded-xl p-3">
              💰 Payment: Cash On Delivery
            </div>

            <button onClick={handleCheckout} className="neon-button w-full py-3.5 mt-6 text-base font-heading font-semibold">
              Place Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;
