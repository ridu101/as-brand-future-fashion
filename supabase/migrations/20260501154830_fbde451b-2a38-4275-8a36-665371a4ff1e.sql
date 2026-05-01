
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  cost_price integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  year integer NOT NULL DEFAULT 2025,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  stock integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  trending boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  seasonal text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_seasonal ON public.products(seasonal);
