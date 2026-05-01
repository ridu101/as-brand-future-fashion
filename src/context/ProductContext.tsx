import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product, products as defaultProducts, categories } from "@/data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (slug: string) => Product[];
  getTrendingProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getSeasonalProducts: (season: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("as_products");
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch { return defaultProducts; }
  });

  useEffect(() => {
    localStorage.setItem("as_products", JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
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
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductsByCategory, getTrendingProducts, getFeaturedProducts, getSeasonalProducts, getProductById, searchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
