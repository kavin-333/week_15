-- Helper function to check if the current user is an admin, bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  category_id uuid references categories(id),
  stock integer default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- ORDERS TABLE
CREATE TABLE orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  total_amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','confirmed','shipped','delivered')),
  shipping_address jsonb,
  created_at timestamptz default now()
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  unit_price numeric(10,2) not null
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- PROFILES
-- Users can only read/update their own profile
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Admin bypasses all RLS
CREATE POLICY "Admin can perform any action on profiles" ON profiles FOR ALL USING (public.is_admin());

-- CATEGORIES (Assuming anyone can read, but only admin can write to follow logical defaults)
CREATE POLICY "Categories are viewable by anyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can perform any action on categories" ON categories FOR ALL USING (public.is_admin());

-- PRODUCTS
-- Products: Anyone can read. Only admin can insert/update/delete.
CREATE POLICY "Products are viewable by anyone" ON products FOR SELECT USING (true);
CREATE POLICY "Admin can perform any action on products" ON products FOR ALL USING (public.is_admin());

-- ORDERS
-- Orders: Users can only read/create their own orders.
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admin bypasses all RLS
CREATE POLICY "Admin can perform any action on orders" ON orders FOR ALL USING (public.is_admin());

-- ORDER ITEMS
-- Order items follow the order
CREATE POLICY "Users can read their own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
-- Admin bypasses all RLS
CREATE POLICY "Admin can perform any action on order items" ON order_items FOR ALL USING (public.is_admin());

-- FUNCTION TO HANDLE NEW USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- TRIGGER TO CALL THE FUNCTION ON NEW USER SIGNUP
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
