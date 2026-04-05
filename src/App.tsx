import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProductProvider } from "@/context/ProductContext";
import { OrderProvider } from "@/context/OrderContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import TrendingPage from "./pages/TrendingPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductsByCategory from "./pages/admin/AdminProductsByCategory";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminReturns from "./pages/admin/AdminReturns";
import AdminSells from "./pages/admin/AdminSells";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AnimatedBackground />
                  <Navbar />
                  <CartDrawer />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
                    <Route path="/admin/products/add" element={<ProtectedRoute adminOnly><AdminAddProduct /></ProtectedRoute>} />
                    <Route path="/admin/products/:category" element={<ProtectedRoute adminOnly><AdminProductsByCategory /></ProtectedRoute>} />
                    <Route path="/admin/returns" element={<ProtectedRoute adminOnly><AdminReturns /></ProtectedRoute>} />
                    <Route path="/admin/sells" element={<ProtectedRoute adminOnly><AdminSells /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/panjabi" element={<CategoryPage />} />
                    <Route path="/shirt" element={<CategoryPage />} />
                    <Route path="/pant" element={<CategoryPage />} />
                    <Route path="/katua" element={<CategoryPage />} />
                    <Route path="/tshirt" element={<CategoryPage />} />
                    <Route path="/polo" element={<CategoryPage />} />
                    <Route path="/hoodie" element={<CategoryPage />} />
                    <Route path="/jacket" element={<CategoryPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Footer />
                </BrowserRouter>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
