// Reliable curated fallback mockups by category
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Android App': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
  'Desktop Software': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'Web Platform': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'Full Stack System': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
  'API & Backend': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'Utility Tool': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'default': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
};

export function getSafeProductImage(images?: string[] | null, category?: string): string {
  if (images && Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (first && typeof first === 'string' && first.trim() !== '' && first !== 'null' && first !== 'undefined') {
      return first.trim();
    }
  }
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }
  return CATEGORY_FALLBACK_IMAGES['default'];
}

export function getSafeProjectImage(image?: string | null, category?: string): string {
  if (image && typeof image === 'string' && image.trim() !== '' && image !== 'null' && image !== 'undefined') {
    return image.trim();
  }
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }
  return CATEGORY_FALLBACK_IMAGES['default'];
}
