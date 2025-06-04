
import { Json } from '@/integrations/supabase/types';

// Raw event data from Supabase database
export interface RawEventData {
  id: string;
  title: string;
  description: string;
  ambiance_description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  capacity: number;
  spots_left: number;
  location: Json;
  products: Json[] | null;
  food_pairings: string;
  accessibility_info: string;
  dress_code: string;
  dietary_options: string[] | null;
  meeting_point_details: string;
  cancellation_policy: string;
  host_id: string;
  created_at: string;
  updated_at: string;
  image: string | null;
}

// Application-ready event data with proper types
export interface EventData {
  id: string;
  title: string;
  description: string;
  ambiance_description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  capacity: number;
  spots_left: number;
  location: LocationData;
  products: ProductData[];
  food_pairings: string;
  accessibility_info: string;
  dress_code: string;
  dietary_options: string[];
  meeting_point_details: string;
  cancellation_policy: string;
  host_id: string;
  image: string | null;
}

export interface LocationData {
  type: string;
  isOnline?: boolean;
  venueName?: string;
  address?: string;
  city?: string;
}

export interface ProductData {
  name: string;
  producer: string;
  description: string;
  year?: string;
  type?: string;
}

// Helper function to safely parse JSON
const safeJsonParse = (jsonData: any, fallback: any = null) => {
  try {
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData);
    }
    return jsonData;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Helper function to validate location data
const parseLocationData = (locationJson: Json): LocationData => {
  const parsed = safeJsonParse(locationJson, {});
  
  // Ensure we have a valid location object
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      type: parsed.type || 'physical',
      isOnline: parsed.isOnline || false,
      venueName: parsed.venueName || parsed.venue,
      address: parsed.address,
      city: parsed.city
    };
  }
  
  // Fallback to default location
  return { type: 'physical', isOnline: false };
};

// Helper function to validate product data
const parseProductsData = (productsJson: Json[] | null): ProductData[] => {
  if (!productsJson || !Array.isArray(productsJson)) {
    return [];
  }

  return productsJson.map((product, index) => {
    const parsed = safeJsonParse(product, {});
    
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        name: parsed.name || `Product ${index + 1}`,
        producer: parsed.producer || 'Unknown Producer',
        description: parsed.description || '',
        year: parsed.year,
        type: parsed.type
      };
    }
    
    // Fallback for invalid product data
    return {
      name: `Product ${index + 1}`,
      producer: 'Unknown Producer',
      description: ''
    };
  });
};

// Transform raw database data to application-ready data
export const transformEventData = (rawData: RawEventData): EventData => {
  // Parse location JSON with proper validation
  const location = parseLocationData(rawData.location);

  // Parse products JSON with proper validation
  const products = parseProductsData(rawData.products);

  // Handle dietary options
  const dietary_options = rawData.dietary_options || [];

  console.log('Transforming event data:', {
    id: rawData.id,
    hasImage: !!rawData.image,
    imageUrl: rawData.image
  });

  return {
    id: rawData.id,
    title: rawData.title,
    description: rawData.description,
    ambiance_description: rawData.ambiance_description,
    category: rawData.category,
    date: rawData.date,
    time: rawData.time,
    duration: rawData.duration,
    price: rawData.price,
    capacity: rawData.capacity,
    spots_left: rawData.spots_left,
    location,
    products,
    food_pairings: rawData.food_pairings,
    accessibility_info: rawData.accessibility_info,
    dress_code: rawData.dress_code,
    dietary_options,
    meeting_point_details: rawData.meeting_point_details,
    cancellation_policy: rawData.cancellation_policy,
    host_id: rawData.host_id,
    image: rawData.image
  };
};
