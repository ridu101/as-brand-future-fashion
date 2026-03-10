export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  year: number;
  sizes: string[];
  stock: number;
  description: string;
  image: string;
  trending?: boolean;
  featured?: boolean;
  seasonal?: string;
}

export type Category = {
  slug: string;
  name: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "panjabi", name: "Panjabi", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop" },
  { slug: "shirt", name: "Shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop" },
  { slug: "pant", name: "Pant", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop" },
  { slug: "katua", name: "Katua", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop" },
  { slug: "tshirt", name: "T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop" },
  { slug: "polo", name: "Polo Shirt", image: "https://images.unsplash.com/photo-1625910513413-5fc42f006596?w=400&h=500&fit=crop" },
  { slug: "hoodie", name: "Hoodie", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop" },
  { slug: "jacket", name: "Winter Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop" },
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const sizeSets = [["S", "M", "L", "XL"], ["M", "L", "XL", "XXL"], ["S", "M", "L"]];
  
  const namesByCategory: Record<string, string[]> = {
    panjabi: ["Royal Silk Panjabi", "Premium Cotton Panjabi", "Embroidered Panjabi", "Classic White Panjabi", "Navy Blue Panjabi", "Festive Gold Panjabi", "Slim Fit Panjabi", "Designer Panjabi", "Traditional Panjabi", "Modern Cut Panjabi"],
    shirt: ["Oxford Button Down", "Slim Fit Formal", "Linen Casual Shirt", "Denim Shirt", "Printed Casual Shirt", "White Classic Shirt", "Striped Office Shirt", "Mandarin Collar Shirt", "Flannel Check Shirt", "Satin Evening Shirt"],
    pant: ["Slim Fit Chinos", "Classic Formal Trouser", "Jogger Pants", "Cargo Pants", "Skinny Jeans", "Straight Cut Denim", "Linen Trousers", "Track Pants", "Pleated Pants", "Tapered Fit Pants"],
    katua: ["Premium Katua Set", "Casual Katua", "Festive Katua", "Embroidered Katua", "Cotton Katua", "Designer Katua", "Traditional Katua", "Modern Katua", "Silk Blend Katua", "Printed Katua"],
    tshirt: ["Graphic Tee", "Plain Round Neck", "V-Neck Essential", "Oversized Tee", "Striped T-Shirt", "Vintage Wash Tee", "Athletic Fit Tee", "Pocket T-Shirt", "Henley T-Shirt", "Longline Tee"],
    polo: ["Classic Polo", "Sporty Polo", "Premium Pique Polo", "Contrast Collar Polo", "Slim Fit Polo", "Striped Polo", "Textured Polo", "Performance Polo", "Tipped Polo", "Jersey Polo"],
    hoodie: ["Pullover Hoodie", "Zip-Up Hoodie", "Oversized Hoodie", "Fleece Hoodie", "Graphic Hoodie", "Tech Hoodie", "Cropped Hoodie", "Essential Hoodie", "Acid Wash Hoodie", "Embroidered Hoodie"],
    jacket: ["Puffer Jacket", "Bomber Jacket", "Windbreaker", "Quilted Jacket", "Leather Jacket", "Denim Jacket", "Parka Coat", "Fleece Jacket", "Down Jacket", "Utility Jacket"],
  };

  const priceRanges: Record<string, [number, number]> = {
    panjabi: [1200, 4500],
    shirt: [800, 2500],
    pant: [900, 3000],
    katua: [1000, 3500],
    tshirt: [450, 1500],
    polo: [600, 1800],
    hoodie: [1200, 3500],
    jacket: [2000, 6000],
  };

  const images: Record<string, string[]> = {
    panjabi: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    ],
    shirt: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&h=500&fit=crop",
    ],
    pant: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    ],
    katua: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop",
    ],
    tshirt: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    ],
    polo: [
      "https://images.unsplash.com/photo-1625910513413-5fc42f006596?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400&h=500&fit=crop",
    ],
    hoodie: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&h=500&fit=crop",
    ],
    jacket: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544923246-77307dd270b5?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&h=500&fit=crop",
    ],
  };

  let id = 1;
  for (const cat of categories) {
    const names = namesByCategory[cat.slug] || [];
    const [minP, maxP] = priceRanges[cat.slug] || [500, 2000];
    const catImages = images[cat.slug] || [cat.image];

    for (let i = 0; i < 10; i++) {
      const price = Math.round((minP + Math.random() * (maxP - minP)) / 10) * 10;
      const seasonal = i < 2 ? "eid" : i < 4 ? "winter" : i < 6 ? "summer" : undefined;
      products.push({
        id: `p${id++}`,
        title: names[i] || `${cat.name} Item ${i + 1}`,
        price,
        category: cat.slug,
        year: 2024 + (i % 2),
        sizes: sizeSets[i % sizeSets.length],
        stock: Math.floor(Math.random() * 50) + 5,
        description: `Premium quality ${cat.name.toLowerCase()} crafted with the finest materials. Perfect for any occasion with a modern fit and contemporary design.`,
        image: catImages[i % catImages.length],
        trending: i < 3,
        featured: i < 2,
        seasonal,
      });
    }
  }
  return products;
};

export const products = generateProducts();

export const getProductsByCategory = (slug: string) => products.filter(p => p.category === slug);
export const getTrendingProducts = () => products.filter(p => p.trending);
export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getSeasonalProducts = (season: string) => products.filter(p => p.seasonal === season);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();
  return products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
};
