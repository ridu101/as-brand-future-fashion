import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Edit, X, Save, Upload } from "lucide-react";
import { Product, ProductColor, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateCategoryImage, getCategoryFallbackImage } from "@/lib/categoryImages";

const inputCls = "w-full bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300";

const AdminProductsByCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorFileRef = useRef<HTMLInputElement>(null);
  const [colorUploadIdx, setColorUploadIdx] = useState<number>(-1);

  const catName = categories.find(c => c.slug === category)?.name || category;
  const catProducts = products.filter(p => p.category === category);

  const emptyProduct = (): Omit<Product, "id"> => ({
    title: "", category: category || "panjabi", year: 2025, price: 0, costPrice: 0,
    sizes: ["S", "M", "L", "XL"], stock: 10, description: "", image: "",
    colors: [
      { name: "Black", code: "#1a1a2e", image: "" },
      { name: "White", code: "#f8f9fa", image: "" },
      { name: "Navy", code: "#16213e", image: "" },
    ],
  });

  const [newProduct, setNewProduct] = useState(emptyProduct());

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

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "new" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    if (target === "new") setNewProduct(p => ({ ...p, image: url }));
    else if (editingProduct) setEditingProduct(p => p ? { ...p, image: url } : null);
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number, target: "new" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    if (target === "new") {
      setNewProduct(p => {
        const colors = [...(p.colors || [])];
        colors[idx] = { ...colors[idx], image: url };
        return { ...p, colors };
      });
    } else if (editingProduct) {
      setEditingProduct(p => {
        if (!p) return null;
        const colors = [...(p.colors || [])];
        colors[idx] = { ...colors[idx], image: url };
        return { ...p, colors };
      });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) { toast.error("Title and price required"); return; }
    const check = validateCategoryImage(newProduct.category, newProduct.image);
    if (!check.valid) { toast.error(check.message!); return; }
    const finalImage = newProduct.image || getCategoryFallbackImage(newProduct.category);
    const finalColors = (newProduct.colors || []).map(c => ({ ...c, image: c.image || finalImage }));
    addProduct({ ...newProduct, image: finalImage, colors: finalColors, id: `custom-${Date.now()}` } as Product);
    setNewProduct(emptyProduct());
    setShowAdd(false);
    toast.success("Product added!");
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    const check = validateCategoryImage(editingProduct.category, editingProduct.image);
    if (!check.valid) { toast.error(check.message!); return; }
    const finalImage = editingProduct.image || getCategoryFallbackImage(editingProduct.category);
    const finalColors = (editingProduct.colors || []).map(c => ({ ...c, image: c.image || finalImage }));
    updateProduct({ ...editingProduct, image: finalImage, colors: finalColors });
    setEditingProduct(null);
    toast.success("Product updated!");
  };

  const updateNewColor = (idx: number, field: keyof ProductColor, value: string) => {
    setNewProduct(p => {
      const colors = [...(p.colors || [])];
      colors[idx] = { ...colors[idx], [field]: value };
      return { ...p, colors };
    });
  };

  const updateEditColor = (idx: number, field: keyof ProductColor, value: string) => {
    setEditingProduct(p => {
      if (!p) return null;
      const colors = [...(p.colors || [])];
      colors[idx] = { ...colors[idx], [field]: value };
      return { ...p, colors };
    });
  };

  const addColorSlot = (target: "new" | "edit") => {
    const newColor = { name: "", code: "#000000", image: "" };
    if (target === "new") setNewProduct(p => ({ ...p, colors: [...(p.colors || []), newColor] }));
    else setEditingProduct(p => p ? { ...p, colors: [...(p.colors || []), newColor] } : null);
  };

  const removeColorSlot = (idx: number, target: "new" | "edit") => {
    if (target === "new") setNewProduct(p => ({ ...p, colors: (p.colors || []).filter((_, i) => i !== idx) }));
    else setEditingProduct(p => p ? { ...p, colors: (p.colors || []).filter((_, i) => i !== idx) } : null);
  };

  const renderColorEditor = (colors: ProductColor[], target: "new" | "edit") => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-heading font-semibold">Color Variants</p>
        {colors.length < 5 && (
          <button type="button" onClick={() => addColorSlot(target)} className="text-xs text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Color
          </button>
        )}
      </div>
      {colors.map((color, idx) => (
        <div key={idx} className="glass-panel rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input type="color" value={color.code} onChange={e => target === "new" ? updateNewColor(idx, "code", e.target.value) : updateEditColor(idx, "code", e.target.value)}
              className="w-8 h-8 rounded-lg border border-border cursor-pointer" />
            <input placeholder="Color name" value={color.name} onChange={e => target === "new" ? updateNewColor(idx, "name", e.target.value) : updateEditColor(idx, "name", e.target.value)}
              className={`${inputCls} flex-1`} />
            {colors.length > 1 && (
              <button type="button" onClick={() => removeColorSlot(idx, target)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {color.image && <img src={color.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
            <button type="button" onClick={() => {
              setColorUploadIdx(idx);
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (ev) => handleColorImageUpload(ev as any, idx, target);
              input.click();
            }} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> {color.image ? "Change" : "Upload"} Image
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <button onClick={() => navigate("/admin/products")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </button>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{catName}</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="neon-button px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add {catName}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddProduct} className="glass-panel rounded-2xl p-6 space-y-4 mb-8 overflow-hidden">
            <input placeholder="Product Title" value={newProduct.title} onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))} className={inputCls} required />
            <div className="grid grid-cols-3 gap-4">
              <input type="number" placeholder="Selling Price" value={newProduct.price || ""} onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))} className={inputCls} required />
              <input type="number" placeholder="Cost Price (hidden)" value={newProduct.costPrice || ""} onChange={e => setNewProduct(p => ({ ...p, costPrice: Number(e.target.value) }))} className={inputCls} />
              <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: Number(e.target.value) }))} className={inputCls} />
            </div>
            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className={`${inputCls} min-h-[80px]`} />
            <div>
              <p className="text-sm font-heading font-semibold mb-2">Main Image</p>
              <div className="flex items-center gap-3">
                {newProduct.image && <img src={newProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="neon-button-outline px-4 py-2 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleMainImageUpload(e, "new")} />
              </div>
            </div>
            {renderColorEditor(newProduct.colors || [], "new")}
            <button type="submit" className="neon-button px-6 py-3 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {catProducts.map(p => (
          <motion.div key={p.id} layout className="glass-panel rounded-xl p-4 flex items-center gap-4">
            <img src={p.image} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">৳{p.price} · Cost: ৳{p.costPrice || 0} · Stock: {p.stock}</p>
              {p.colors && (
                <div className="flex gap-1 mt-1">
                  {p.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.code }} title={c.name} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors duration-300"><Edit className="w-4 h-4" /></button>
              <button onClick={() => { deleteProduct(p.id); toast.success("Deleted"); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors duration-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto bg-white/90 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Edit Product</h2>
                <button onClick={() => setEditingProduct(null)}><X className="w-5 h-5" /></button>
              </div>
              <input value={editingProduct.title} onChange={e => setEditingProduct(p => p ? { ...p, title: e.target.value } : null)} className={inputCls} />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : null)} className={inputCls} />
                <input type="number" placeholder="Cost Price" value={editingProduct.costPrice || ""} onChange={e => setEditingProduct(p => p ? { ...p, costPrice: Number(e.target.value) } : null)} className={inputCls} />
                <input type="number" placeholder="Stock" value={editingProduct.stock} onChange={e => setEditingProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)} className={inputCls} />
              </div>
              <textarea value={editingProduct.description} onChange={e => setEditingProduct(p => p ? { ...p, description: e.target.value } : null)} className={`${inputCls} min-h-[80px]`} />
              <div>
                <p className="text-sm font-heading font-semibold mb-2">Main Image</p>
                <div className="flex items-center gap-3">
                  {editingProduct.image && <img src={editingProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                  <button type="button" onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file"; input.accept = "image/*";
                    input.onchange = (ev) => handleMainImageUpload(ev as any, "edit");
                    input.click();
                  }} disabled={uploading} className="neon-button-outline px-3 py-1.5 text-xs flex items-center gap-1">
                    <Upload className="w-3 h-3" /> {uploading ? "Uploading..." : "Change"}
                  </button>
                </div>
              </div>
              {renderColorEditor(editingProduct.colors || [], "edit")}
              <button onClick={handleSaveEdit} className="neon-button px-6 py-2.5 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductsByCategory;
