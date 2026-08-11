import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to map database product model to frontend expected model
const mapProduct = (p) => {
  const categoryName = p.category ? p.category.name : 'Other';
  
  // Dynamic brand extraction
  let brand = 'SalesBasket';
  if (p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('apple')) {
    brand = 'Apple';
  } else if (p.name.toLowerCase().includes('samsung')) {
    brand = 'Samsung';
  } else if (categoryName === 'Fashion') {
    brand = 'SalesBasket Classy';
  } else if (categoryName === 'Electronics') {
    brand = 'SalesBasket Tech';
  }

  // Map image list
  let images = p.images && p.images.length > 0 
    ? p.images.map(img => img.imageUrl) 
    : ['https://ik.imagekit.io/StringStackAnand/4K%20Ultra%20HD%20TVs/images%2018.jpg?updatedAt=1785305777272'];
  
  if (images.length === 1) {
    images = [
      images[0],
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&w=600&q=80'
    ];
  }
  const image = images[0];

  // Dynamic specifications based on category
  let specifications = [{ key: 'Quality', value: 'Premium Grade' }];
  if (categoryName === 'Electronics') {
    specifications = [
      { key: 'Warranty', value: '1 Year Manufacturer Warranty' },
      { key: 'Condition', value: 'Brand New' }
    ];
  } else if (categoryName === 'Fashion') {
    specifications = [
      { key: 'Material', value: '100% Premium Quality' },
      { key: 'Fit', value: 'Regular Comfort Fit' }
    ];
  }

  return {
    id: p.id ? String(p.id) : '',
    name: p.name,
    description: p.description || 'Premium e-commerce product.',
    price: p.price,
    originalPrice: parseFloat((p.price * 1.25).toFixed(2)),
    discount: 20,
    rating: parseFloat((4.2 + (p.id ? (p.id % 5) * 0.2 : 0)).toFixed(1)),
    reviewCount: 45 + (p.id ? (p.id * 17) % 300 : 0),
    brand,
    category: categoryName,
    image,
    images,
    stock: p.stock,
    stockStatus: p.stock > 0 ? 'In Stock' : 'Out of Stock',
    isFeatured: p.id ? (p.id % 2 === 1) : false,
    isTrending: p.id ? (p.id % 3 === 1) : false,
    isBestSeller: p.id ? (p.id % 4 === 1) : false,
    isNewArrival: p.id ? (p.id % 2 === 0) : false,
    isFlashSale: p.id ? (p.id % 5 === 0) : false,
    isRecommended: p.id ? (p.id % 3 === 0) : false,
    specifications
  };
};

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'SalesBasket has revolutionized how I shop online. The customer service was top-notch, and the delivery was incredibly fast. Highly recommended!',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The quality of the product is outstanding! Excellent stitching and the fabric is extremely soft. I am definitely buying more.',
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Aisha Rahman',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    comment: 'Great deals on electronics! The Phone is spectacular and the noise-cancelling earbuds are perfect for my daily commutes.',
    date: '3 weeks ago'
  }
];

export const productService = {
  getProducts: async () => {
    try {
      const response = await apiClient.get('/api/products');
      return response.data.map(mapProduct);
    } catch (error) {
      console.error('Failed to fetch products from backend', error);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      return mapProduct(response.data);
    } catch (error) {
      console.error(`Failed to fetch product with id ${id} from backend`, error);
      return null;
    }
  },

  getFeaturedProducts: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isFeatured);
  },

  getTrendingProducts: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isTrending);
  },

  getBestSellers: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isBestSeller);
  },

  getFlashSales: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isFlashSale);
  },

  getNewArrivals: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isNewArrival);
  },

  getRecommendedProducts: async () => {
    const products = await productService.getProducts();
    return products.filter(p => p.isRecommended);
  },

  getCustomerReviews: async () => CUSTOMER_REVIEWS,

  searchAndFilterProducts: async (searchQuery, category, priceRange, rating, availability, sortBy) => {
    const allProducts = await productService.getProducts();
    let products = [...allProducts];

    // Search query filter (search by name, brand, category)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    // Price range filter
    if (priceRange) {
      const { min, max } = priceRange;
      if (min !== undefined) products = products.filter(p => p.price >= min);
      if (max !== undefined) products = products.filter(p => p.price <= max);
    }

    // Rating filter
    if (rating) {
      products = products.filter(p => p.rating >= rating);
    }

    // Availability filter
    if (availability) {
      if (availability === 'instock') {
        products = products.filter(p => p.stock > 0);
      } else if (availability === 'outofstock') {
        products = products.filter(p => p.stock === 0);
      }
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating-high':
          products.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }

    return products;
  }
};
