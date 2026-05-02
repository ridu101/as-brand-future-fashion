import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export type ReturnStatus =
  | "requested"
  | "parcel_received"
  | "reviewing"
  | "approved_refund"
  | "exchange_sent"
  | "rejected";

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productSize: string;
  productQuantity: number;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  // Joined data (admin view)
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  requested: "Requested",
  parcel_received: "Parcel Received",
  reviewing: "Reviewing Return",
  approved_refund: "Refund Approved",
  exchange_sent: "Exchange Sent",
  rejected: "Rejected",
};

interface ReturnPayload {
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productSize: string;
  productQuantity: number;
  reason: string;
}

interface ReturnContextType {
  returns: ReturnRequest[];
  loading: boolean;
  createReturn: (data: ReturnPayload) => Promise<boolean>;
  updateReturnStatus: (id: string, status: ReturnStatus) => Promise<void>;
  getReturnByOrderProduct: (orderId: string, productId: string) => ReturnRequest | undefined;
  refresh: () => Promise<void>;
}

const ReturnContext = createContext<ReturnContextType | undefined>(undefined);

const map = (r: any): ReturnRequest => ({
  id: r.id,
  orderId: r.order_id,
  userId: r.user_id,
  productId: r.product_id,
  productTitle: r.product_title,
  productImage: r.product_image,
  productSize: r.product_size,
  productQuantity: r.product_quantity,
  reason: r.reason,
  status: r.status as ReturnStatus,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export const ReturnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReturns = useCallback(async () => {
    if (!user) { setReturns([]); return; }
    setLoading(true);
    let query = supabase.from("return_requests" as any).select("*").order("created_at", { ascending: false });
    const { data, error } = await query;
    if (!error && data) {
      let list = (data as any[]).map(map);
      if (isAdmin) {
        // Enrich admin view with customer info from orders
        const orderIds = Array.from(new Set(list.map(r => r.orderId)));
        if (orderIds.length) {
          const { data: ordData } = await supabase
            .from("orders")
            .select("id, customer_name, phone, address, city")
            .in("id", orderIds);
          if (ordData) {
            const byId = new Map(ordData.map(o => [o.id, o]));
            list = list.map(r => {
              const o = byId.get(r.orderId);
              return o ? { ...r, customerName: o.customer_name, customerPhone: o.phone, customerAddress: `${o.address}, ${o.city}` } : r;
            });
          }
        }
      }
      setReturns(list);
    }
    setLoading(false);
  }, [user, isAdmin]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  // Realtime sync
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("return_requests_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "return_requests" },
        () => { fetchReturns(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchReturns]);

  const createReturn = useCallback(async (data: ReturnPayload): Promise<boolean> => {
    if (!user) { toast.error("Please log in"); return false; }
    const { error } = await supabase.from("return_requests" as any).insert({
      order_id: data.orderId,
      user_id: user.id,
      product_id: data.productId,
      product_title: data.productTitle,
      product_image: data.productImage,
      product_size: data.productSize,
      product_quantity: data.productQuantity,
      reason: data.reason,
      status: "requested",
    });
    if (error) { toast.error("Failed to submit return request"); return false; }
    toast.success("Return request submitted. Please send the product via courier.");
    return true;
  }, [user]);

  const updateReturnStatus = useCallback(async (id: string, status: ReturnStatus) => {
    const { error } = await supabase.from("return_requests" as any).update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status updated: ${RETURN_STATUS_LABELS[status]}`);
  }, []);

  const getReturnByOrderProduct = useCallback(
    (orderId: string, productId: string) => returns.find(r => r.orderId === orderId && r.productId === productId),
    [returns]
  );

  return (
    <ReturnContext.Provider value={{ returns, loading, createReturn, updateReturnStatus, getReturnByOrderProduct, refresh: fetchReturns }}>
      {children}
    </ReturnContext.Provider>
  );
};

export const useReturns = () => {
  const ctx = useContext(ReturnContext);
  if (!ctx) throw new Error("useReturns must be used within ReturnProvider");
  return ctx;
};
