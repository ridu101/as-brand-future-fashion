import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductsByCategory: (slug: string) => Product[];
  getTrendingProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getSeasonalProducts: (season: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  refresh: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const mapRow = (r: any): Product => ({
  id: r.id,
  title: r.title,
  price: r.price,
  costPrice: r.cost_price,
  category: r.category,
  year: r.year,
  sizes: (r.sizes as string[]) || [],
  stock: r.stock,
  description: r.description,
  image: r.image,
  colors: (r.colors as Product["colors"]) || [],
  trending: !!r.trending,
  featured: !!r.featured,
  seasonal: r.seasonal || undefined,
});

const toRow = (p: Partial<Product>): any => ({
  title: p.title,
  price: p.price ?? 0,
  cost_price: p.costPrice ?? 0,
  category: p.category,
  year: p.year ?? 2025,
  sizes: p.sizes ?? [],
  stock: p.stock ?? 0,
  description: p.description ?? "",
  image: p.image ?? "",
  colors: p.colors ?? [],
  trending: !!p.trending,
  featured: !!p.featured,
  seasonal: p.seasonal ?? null,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (!error && data) setProducts(data.map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        refresh();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  const addProduct = useCallback(async (product: Omit<Product, "id">) => {
    const { error } = await supabase.from("products").insert(toRow(product));
    if (error) { toast.error(error.message || "Failed to add product"); throw error; }
    await refresh();
  }, [refresh]);

  const updateProduct = useCallback(async (product: Product) => {
    const { error } = await supabase.from("products").update(toRow(product)).eq("id", product.id);
    if (error) { toast.error(error.message || "Failed to update product"); throw error; }
    await refresh();
  }, [refresh]);

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message || "Failed to delete product"); throw error; }
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProductsByCategory = useCallback((slug: string) => products.filter(p => p.category === slug), [products]);
  const getTrendingProducts = useCallback(() => products.filter(p => p.trending), [products]);
  const getFeaturedProducts = useCallback(() => products.filter(p => p.featured), [products]);
  const getSeasonalProducts = useCallback((season: string) => products.filter(p => p.seasonal === season), [products]);
  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, getProductsByCategory, getTrendingProducts, getFeaturedProducts, getSeasonalProducts, getProductById, searchProducts, refresh }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
