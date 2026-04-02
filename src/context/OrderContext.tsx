import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/context/CartContext";
import { toast } from "sonner";

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
  userId: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Promise<Order | null>;
  getOrdersByUser: () => Order[];
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) { setOrders([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(o => ({
        id: o.id,
        customerName: o.customer_name,
        phone: o.phone,
        address: o.address,
        city: o.city,
        deliveryType: o.delivery_type as "dhaka" | "outside",
        items: o.items as unknown as CartItem[],
        subtotal: o.subtotal,
        deliveryCharge: o.delivery_charge,
        totalPrice: o.total_price,
        status: o.status as Order["status"],
        createdAt: o.created_at,
        userId: o.user_id,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const placeOrder = useCallback(async (data: Omit<Order, "id" | "status" | "createdAt">): Promise<Order | null> => {
    if (!user) return null;
    const insertData = {
      user_id: user.id,
      customer_name: data.customerName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      delivery_type: data.deliveryType,
      items: JSON.parse(JSON.stringify(data.items)),
      subtotal: data.subtotal,
      delivery_charge: data.deliveryCharge,
      total_price: data.totalPrice,
    };
    const { data: inserted, error } = await supabase.from("orders").insert(insertData).select().single();

    if (error) { toast.error("Failed to place order"); return null; }

    const order: Order = {
      id: inserted.id,
      customerName: inserted.customer_name,
      phone: inserted.phone,
      address: inserted.address,
      city: inserted.city,
      deliveryType: inserted.delivery_type as "dhaka" | "outside",
      items: inserted.items as unknown as CartItem[],
      subtotal: inserted.subtotal,
      deliveryCharge: inserted.delivery_charge,
      totalPrice: inserted.total_price,
      status: inserted.status as Order["status"],
      createdAt: inserted.created_at,
      userId: inserted.user_id,
    };
    setOrders(prev => [order, ...prev]);
    return order;
  }, [user]);

  const getOrdersByUser = useCallback(() => {
    if (!user) return [];
    return orders.filter(o => o.userId === user.id);
  }, [orders, user]);

  const fetchAllOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { toast.error("Failed to update"); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order marked as ${status}`);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, getOrdersByUser, fetchAllOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
