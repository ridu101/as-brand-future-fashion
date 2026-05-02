import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Product, ProductColor, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateCategoryImage, getCategoryFallbackImage } from "@/lib/categoryImages";

const inputCls = "w-full bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addProduct } = useProducts();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", category: "panjabi", year: 2025, price: 0, costPrice: 0,
    sizes: "S,M,L,XL", stock: 10, description: "", image: "",
    colors: [
      { name: "Black", code: "#1a1a2e", image: "" },
      { name: "White", code: "#f8f9fa", image: "" },
      { name: "Navy", code: "#16213e", image: "" },
    ] as ProductColor[],
  });

  if (!isAdmin) { navigate("/login"); return null; }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    setUploading(false);
    if (error) { toast.error("Upload failed"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) { toast.error("Title and price required"); return; }

    // Category-image validation
    const check = validateCategoryImage(form.category, form.image);
    if (!check.valid) { toast.error(check.message || "Image does not match selected category"); return; }

    // Fallback to category default image when none provided
    const finalImage = form.image || getCategoryFallbackImage(form.category);
    const finalColors = form.colors.map(c => ({ ...c, image: c.image || finalImage }));

    const p: Product = {
      id: `custom-${Date.now()}`,
      title: form.title, category: form.category, year: form.year, price: form.price,
      costPrice: form.costPrice, sizes: form.sizes.split(",").map(s => s.trim()),
      stock: form.stock, description: form.description,
      image: finalImage,
      colors: finalColors,
    };
    addProduct(p);
    toast.success("Product added!");
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen pt-28 px-6 max-w-2xl mx-auto pb-20">
      <button onClick={() => navigate("/admin/products")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Add New Product</h1>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-4">
        <input placeholder="Product Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} required />
        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-3 gap-4">
          <input type="number" placeholder="Selling Price" value={form.price || ""} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className={inputCls} required />
          <input type="number" placeholder="Cost Price" value={form.costPrice || ""} onChange={e => setForm(p => ({ ...p, costPrice: Number(e.target.value) }))} className={inputCls} />
          <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} className={inputCls} />
        </div>
        <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))} className={inputCls} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputCls} min-h-[100px]`} />
        
        <div>
          <p className="text-sm font-heading font-semibold mb-2">Main Image</p>
          <div className="flex items-center gap-3">
            {form.image && <img src={form.image} alt="" className="w-16 h-16 rounded-xl object-cover" />}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="neon-button-outline px-4 py-2 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload from Device"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImage(file);
              if (url) setForm(p => ({ ...p, image: url }));
            }} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-heading font-semibold">Color Variants</p>
            {form.colors.length < 5 && (
              <button type="button" onClick={() => setForm(p => ({ ...p, colors: [...p.colors, { name: "", code: "#000000", image: "" }] }))}
                className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Color
              </button>
            )}
          </div>
          {form.colors.map((color, idx) => (
            <div key={idx} className="glass-panel rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input type="color" value={color.code} onChange={e => {
                  const colors = [...form.colors]; colors[idx] = { ...colors[idx], code: e.target.value }; setForm(p => ({ ...p, colors }));
                }} className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
                <input placeholder="Color name" value={color.name} onChange={e => {
                  const colors = [...form.colors]; colors[idx] = { ...colors[idx], name: e.target.value }; setForm(p => ({ ...p, colors }));
                }} className={`${inputCls} flex-1`} />
                {form.colors.length > 1 && (
                  <button type="button" onClick={() => setForm(p => ({ ...p, colors: p.colors.filter((_, i) => i !== idx) }))}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><X className="w-3.5 h-3.5" /></button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {color.image && <img src={color.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <button type="button" onClick={() => {
                  const input = document.createElement("input"); input.type = "file"; input.accept = "image/*";
                  input.onchange = async (ev: any) => {
                    const file = ev.target.files?.[0]; if (!file) return;
                    const url = await uploadImage(file); if (!url) return;
                    const colors = [...form.colors]; colors[idx] = { ...colors[idx], image: url }; setForm(p => ({ ...p, colors }));
                  };
                  input.click();
                }} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> {color.image ? "Change" : "Upload"} Image
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="neon-button px-6 py-3 text-sm font-heading font-semibold flex items-center gap-2 w-full justify-center">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </motion.form>
    </div>
  );
};

export default AdminAddProduct;
