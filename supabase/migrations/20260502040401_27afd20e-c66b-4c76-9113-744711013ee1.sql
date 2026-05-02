CREATE TABLE public.return_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL DEFAULT '',
  product_image TEXT NOT NULL DEFAULT '',
  product_size TEXT NOT NULL DEFAULT '',
  product_quantity INTEGER NOT NULL DEFAULT 1,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own return requests"
ON public.return_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own return requests"
ON public.return_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all return requests"
ON public.return_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update return requests"
ON public.return_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_return_requests_updated_at
BEFORE UPDATE ON public.return_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.return_requests;
ALTER TABLE public.return_requests REPLICA IDENTITY FULL;

CREATE INDEX idx_return_requests_user_id ON public.return_requests(user_id);
CREATE INDEX idx_return_requests_order_id ON public.return_requests(order_id);
CREATE INDEX idx_return_requests_status ON public.return_requests(status);