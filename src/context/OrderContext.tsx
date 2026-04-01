import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  deliveryType: "dhaka" | "outside";
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  userEmail: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Order;
  getOrdersByUser: (email: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("as_orders");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("as_orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = useCallback((data: Omit<Order, "id" | "status" | "createdAt">): Order => {
    const order: Order = {
      ...data,
      id: `ORD-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const getOrdersByUser = useCallback((email: string) => {
    return orders.filter(o => o.userEmail === email);
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrdersByUser, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
