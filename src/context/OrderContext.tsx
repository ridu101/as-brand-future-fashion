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
  returnStatus?: string | null;
  returnReason?: string | null;
  returnRequestedAt?: string | null;
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
  requestReturn: (orderId: string, reason: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const mapOrder = (o: any): Order => ({
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
    returnStatus: o.return_status,
    returnReason: o.return_reason,
    returnRequestedAt: o.return_requested_at,
    createdAt: o.created_at,
    userId: o.user_id,
  });

  const fetchOrders = useCallback(async () => {
    if (!user) { setOrders([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(mapOrder));
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
    const order = mapOrder(inserted);
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

  const requestReturn = useCallback(async (orderId: string, reason: string) => {
    const { error } = await supabase.from("orders").update({
      return_status: "requested",
      return_reason: reason,
      return_requested_at: new Date().toISOString(),
    } as any).eq("id", orderId);
    if (error) { toast.error("Failed to submit return request"); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, returnStatus: "requested", returnReason: reason, returnRequestedAt: new Date().toISOString() } : o));
    toast.success("Return request submitted. Please send the product via courier. Return shipping cost is borne by the customer.");
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, getOrdersByUser, fetchAllOrders, updateOrderStatus, requestReturn }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
