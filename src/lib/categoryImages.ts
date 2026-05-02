import catPanjabi from "@/assets/cat-panjabi.jpg";
import catShirt from "@/assets/cat-shirt.jpg";
import catPant from "@/assets/cat-pant.jpg";
import catKatua from "@/assets/cat-katua.jpg";
import catTshirt from "@/assets/cat-tshirt.jpg";
import catPolo from "@/assets/cat-polo.jpg";
import catHoodie from "@/assets/cat-hoodie.jpg";
import catJacket from "@/assets/cat-jacket.jpg";

// Default fallback image per category — guarantees visual consistency
export const defaultCategoryImages: Record<string, string> = {
  panjabi: catPanjabi,
  shirt: catShirt,
  pant: catPant,
  katua: catKatua,
  tshirt: catTshirt,
  polo: catPolo,
  hoodie: catHoodie,
  jacket: catJacket,
};

// Keywords used for basic image-URL validation per category
const categoryKeywords: Record<string, string[]> = {
  panjabi: ["panjabi", "punjabi", "kurta-long", "kurtalong"],
  shirt: ["shirt", "button-down", "buttondown", "oxford", "formal-shirt"],
  pant: ["pant", "trouser", "chino", "jean", "denim-pant", "jogger"],
  katua: ["katua", "kurti", "short-kurta"],
  tshirt: ["tshirt", "t-shirt", "tee", "round-neck", "roundneck"],
  polo: ["polo", "pique"],
  hoodie: ["hoodie", "hood", "pullover", "sweatshirt"],
  jacket: ["jacket", "puffer", "parka", "bomber", "windbreaker", "coat"],
};

/**
 * Validate that an image URL/filename plausibly matches the category.
 * Returns { valid: boolean, message?: string }.
 *
 * - Empty URL = valid (caller will use the fallback).
 * - Newly uploaded files (UUID-style names from Supabase storage) cannot be
 *   keyword-validated, so we accept them but the admin can still preview.
 */
export function validateCategoryImage(category: string, imageUrl: string): { valid: boolean; message?: string } {
  if (!imageUrl) return { valid: true };
  const url = imageUrl.toLowerCase();

  const keywords = categoryKeywords[category] || [];
  const ownMatch = keywords.some(k => url.includes(k));
  if (ownMatch) return { valid: true };

  // Check whether the URL clearly belongs to ANOTHER category
  for (const [cat, words] of Object.entries(categoryKeywords)) {
    if (cat === category) continue;
    if (words.some(w => url.includes(w))) {
      return {
        valid: false,
        message: `Image does not match selected category. The image looks like a "${cat}" but the category is "${category}".`,
      };
    }
  }

  // No keyword info — neutral (e.g. uploaded file with random name)
  return { valid: true };
}

export function getCategoryFallbackImage(category: string): string {
  return defaultCategoryImages[category] || defaultCategoryImages.shirt;
}
