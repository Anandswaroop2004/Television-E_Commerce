import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const CATEGORY_IMAGES = {
  '4K Ultra HD TVs': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80',
  'Gaming TVs': 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=400&q=80',
  'QLED TVs': 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&w=400&q=80',
  'OLED TVs': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
  'Curved TVs': 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=400&q=80'
};

const CATEGORY_TAGLINES = {
  '4K Ultra HD TVs': 'Premium Experience',
  'Gaming TVs': 'Low Input Log',
  'QLED TVs': 'Quantum Dot Display',
  'OLED TVs': 'Perfect Blocks',
  'Curved TVs': 'Immersive View'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80';

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/categories');
      const mapped = response.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        image: CATEGORY_IMAGES[cat.name] || DEFAULT_IMAGE,
        tagline: CATEGORY_TAGLINES[cat.name] || 'Explore Collection'
      }));
      
      // Sort categories to match the user's reference order:
      const order = ['4K Ultra HD TVs', 'Gaming TVs', 'QLED TVs', 'OLED TVs', 'Curved TVs'];
      mapped.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
      
      return mapped;
    } catch (error) {
      console.error('Failed to fetch categories from backend, using fallback', error);
      const fallback = Object.keys(CATEGORY_IMAGES).map((name, index) => ({
        id: index + 1,
        name: name,
        image: CATEGORY_IMAGES[name],
        tagline: CATEGORY_TAGLINES[name] || 'Explore Collection'
      }));
      
      const order = ['4K Ultra HD TVs', 'Gaming TVs', 'QLED TVs', 'OLED TVs', 'Curved TVs'];
      fallback.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
      
      return fallback;
    }
  }
};
