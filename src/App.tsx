import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProductProvider } from "@/context/ProductContext";
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
import CustomerLoginPage from "./pages/CustomerLoginPage";
import OwnerLoginPage from "./pages/OwnerLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import WishlistPage from "./pages/WishlistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/customer-login" element={<CustomerLoginPage />} />
                <Route path="/owner-login" element={<OwnerLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/panjabi" element={<CategoryPage />} />
                <Route path="/shirt" element={<CategoryPage />} />
                <Route path="/pant" element={<CategoryPage />} />
                <Route path="/katua" element={<CategoryPage />} />
                <Route path="/tshirt" element={<CategoryPage />} />
                <Route path="/polo" element={<CategoryPage />} />
                <Route path="/hoodie" element={<CategoryPage />} />
                <Route path="/jacket" element={<CategoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
