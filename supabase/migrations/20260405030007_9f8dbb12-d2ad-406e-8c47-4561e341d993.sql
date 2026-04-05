
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_status text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS return_reason text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS return_requested_at timestamptz DEFAULT NULL;
