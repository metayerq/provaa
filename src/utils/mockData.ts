export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  producer?: string;
  year?: string;
  type?: string;
}

export interface Host {
  id: string;
  name: string;
  image?: string;
  bio: string;
  rating: number;
  events: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  location: {
    address: string;
    city: string;
    venue: string;
    coordinates?: [number, number];
  };
  price: number;
  capacity: number;
  spotsLeft: number;
  products: Product[];
  host: Host;
  image?: string;
  featured: boolean;
  // Enhanced fields
  ambianceDescription?: string;
  accessibilityInfo?: string;
  dressCode?: string;
  dietaryOptions?: string[];
  meetingPointDetails?: string;
  cancellationPolicy?: string;
  foodPairings?: string;
  languagesSpoken?: string[];
}

export const categories = [
  { id: "wine", label: "Wine", emoji: "🍷" },
  { id: "cheese", label: "Cheese", emoji: "🧀" },
  { id: "oil", label: "Olive Oil", emoji: "🫒" },
  { id: "honey", label: "Honey", emoji: "🍯" },
  { id: "beer", label: "Beer", emoji: "🍺" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "chocolate", label: "Chocolate", emoji: "🍫" },
  { id: "spirits", label: "Spirits", emoji: "🥃" },
];

export const hosts: Host[] = [
  {
    id: "h1",
    name: "Maria Rossi",
    bio: "Certified sommelier with 15 years of experience in Italian wines.",
    rating: 4.9,
    events: 42,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    id: "h2",
    name: "Jean-Claude Boulanger",
    bio: "Artisanal cheese maker from Provence with a passion for traditional methods.",
    rating: 4.8,
    events: 28,
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c"
  },
  {
    id: "h3",
    name: "Carlos Mendez",
    bio: "Third-generation coffee grower and Q-grader from Colombia.",
    rating: 4.7,
    events: 36,
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf"
  },
  {
    id: "h4",
    name: "Aisha Rahman",
    bio: "Award-winning chocolatier specializing in single-origin creations.",
    rating: 4.9,
    events: 15,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  },
  {
    id: "h5",
    name: "David Chen",
    bio: "Certified beer cicerone with experience at craft breweries across Europe.",
    rating: 4.6,
    events: 23,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  }
];

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Natural Wine Tasting with Local Producers",
    description: "Join us for an evening exploring natural wines from small local vineyards. Learn about natural winemaking processes while enjoying generous pours of unique varieties. Our sommelier will guide you through each wine's story and characteristics.",
    category: "wine",
    date: "2025-06-15",
    time: "19:00",
    duration: "2.5 hours",
    location: {
      venue: "Urban Vineyard Lounge",
      address: "123 Main Street",
      city: "Portland",
      coordinates: [45.523064, -122.676483]
    },
    price: 65,
    capacity: 20,
    spotsLeft: 8,
    products: [
      {
        id: "p1",
        name: "Willamette Valley Natural Pinot Noir",
        description: "Unfiltered pinot noir with notes of cherry and earth",
        image: "https://images.unsplash.com/photo-1553361371-9b22f78a0b98",
        producer: "Valley Vineyards",
        year: "2022",
        type: "Natural Red"
      },
      {
        id: "p2",
        name: "Oregon Pét-Nat Rosé",
        description: "Sparkling natural wine with bright fruit and floral notes",
        image: "https://images.unsplash.com/photo-1600320844656-388a9a929a2b",
        producer: "Cascade Cellars",
        year: "2023",
        type: "Natural Sparkling"
      },
      {
        id: "p3",
        name: "Columbia Valley Natural Chardonnay",
        description: "Minimal intervention chardonnay with citrus and mineral characteristics",
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
        producer: "River Stone Winery",
        year: "2023",
        type: "Natural White"
      }
    ],
    host: hosts[0],
    image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
    featured: true,
    ambianceDescription: "An intimate setting with warm lighting and rustic wine barrels, perfect for discovering natural wines in a cozy atmosphere.",
    accessibilityInfo: "Wheelchair accessible entrance and restrooms",
    dietaryOptions: ["Vegetarian", "Gluten-free crackers available"],
    meetingPointDetails: "Meet at the main entrance of Urban Vineyard Lounge. Look for the natural wine display.",
    cancellationPolicy: "Free cancellation up to 48 hours before the event",
    foodPairings: "Artisanal cheeses, charcuterie, and locally baked bread perfectly complement each wine selection.",
    languagesSpoken: ["English", "Spanish"]
  },
  {
    id: "e2",
    title: "Artisanal Cheese & Honey Pairing",
    description: "Experience the magic when fine artisanal cheeses meet local honeys. This guided tasting will take you through six carefully selected pairings that highlight the complexity of both products.",
    category: "cheese",
    date: "2025-06-18",
    time: "18:30",
    duration: "2 hours",
    location: {
      venue: "The Cheese Collective",
      address: "42 Dairy Lane",
      city: "Seattle",
      coordinates: [47.608013, -122.335167]
    },
    price: 55,
    capacity: 16,
    spotsLeft: 4,
    products: [
      {
        id: "p4",
        name: "Aged Gouda & Wildflower Honey",
        description: "24-month aged gouda paired with local wildflower honey",
        image: "https://images.unsplash.com/photo-1452195100486-9cc805987862",
        producer: "Mountain View Creamery",
        type: "Hard Cheese"
      },
      {
        id: "p5",
        name: "Blue Cheese & Lavender Honey",
        description: "Creamy blue cheese complemented by aromatic lavender-infused honey",
        image: "https://images.unsplash.com/photo-1626957341637-58de35ca905d",
        producer: "Pacific Northwest Dairy",
        type: "Blue Cheese"
      },
      {
        id: "p6",
        name: "Fresh Chèvre & Acacia Honey",
        description: "Tangy goat cheese balanced with light, delicate acacia honey",
        image: "https://images.unsplash.com/photo-1505281036624-fac2862357b0",
        producer: "Sunset Goat Farm",
        type: "Soft Cheese"
      }
    ],
    host: hosts[1],
    image: "https://images.unsplash.com/photo-1633436375153-d72e3878404d",
    featured: true,
    ambianceDescription: "Rustic charm meets modern elegance in our cheese cellar, with exposed brick walls and soft ambient lighting.",
    accessibilityInfo: "Ground floor access, wheelchair friendly",
    dietaryOptions: ["Lactose-free alternatives available"],
    meetingPointDetails: "Enter through the main shop entrance and proceed to the tasting room in the back.",
    cancellationPolicy: "24-hour cancellation policy",
    foodPairings: "Fresh crusty bread, seasonal fruits, and roasted nuts enhance the cheese and honey combinations.",
    languagesSpoken: ["English", "French"]
  },
  {
    id: "e3",
    title: "Single Origin Coffee Cupping Session",
    description: "Discover the nuanced flavors of single-origin coffees in this professional cupping session. Learn proper tasting techniques and how to identify flavor notes from regions around the world.",
    category: "coffee",
    date: "2025-06-20",
    time: "10:00",
    duration: "1.5 hours",
    location: {
      venue: "Artisan Roastery",
      address: "789 Brew Street",
      city: "Denver",
      coordinates: [39.742043, -104.991531]
    },
    price: 40,
    capacity: 12,
    spotsLeft: 7,
    products: [
      {
        id: "p7",
        name: "Ethiopian Yirgacheffe",
        description: "Delicate floral and citrus notes with a tea-like body",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        producer: "Sidama Highlands",
        type: "Single Origin"
      },
      {
        id: "p8",
        name: "Colombian Huila",
        description: "Medium body with notes of milk chocolate and caramel",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        producer: "Finca El Paraíso",
        type: "Single Origin"
      },
      {
        id: "p9",
        name: "Guatemalan Antigua",
        description: "Full body with spicy, chocolatey notes and subtle fruitiness",
        image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb",
        producer: "Volcán Azul Estate",
        type: "Single Origin"
      }
    ],
    host: hosts[2],
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
    featured: true,
    ambianceDescription: "Industrial-chic roastery with the aroma of freshly roasted beans and the gentle hum of roasting equipment.",
    accessibilityInfo: "Step-free access, hearing loop available",
    dietaryOptions: ["Oat milk", "Almond milk", "Sugar alternatives"],
    meetingPointDetails: "Enter through the roastery's main entrance. The cupping lab is on the second floor.",
    cancellationPolicy: "2-hour cancellation policy for morning sessions",
    foodPairings: "Light pastries and artisanal biscotti complement the coffee tasting experience.",
    languagesSpoken: ["English"]
  },
  {
    id: "e4",
    title: "Craft Beer Brewery Tour & Tasting",
    description: "Go behind the scenes at our award-winning brewery and taste exclusive small-batch beers. Learn about the brewing process from grain to glass.",
    category: "beer",
    date: "2025-06-22",
    time: "16:00",
    duration: "3 hours",
    location: {
      venue: "Hoptown Brewery",
      address: "101 Fermentation Way",
      city: "Austin",
      coordinates: [30.267153, -97.743057]
    },
    price: 45,
    capacity: 24,
    spotsLeft: 12,
    products: [
      {
        id: "p10",
        name: "Hoptown Hazy IPA",
        description: "Juicy IPA with tropical fruit notes and low bitterness",
        image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d",
        producer: "Hoptown Brewery",
        type: "IPA"
      },
      {
        id: "p11",
        name: "Barrel-Aged Imperial Stout",
        description: "Rich stout aged in bourbon barrels with notes of chocolate and vanilla",
        image: "https://images.unsplash.com/photo-1518099074172-2e47ee6cfdc0",
        producer: "Hoptown Brewery",
        type: "Imperial Stout"
      },
      {
        id: "p12",
        name: "Small Batch Saison",
        description: "Farmhouse ale with spicy yeast character and citrus finish",
        image: "https://images.unsplash.com/photo-1532635239-06e08db8f247",
        producer: "Hoptown Brewery",
        type: "Saison"
      }
    ],
    host: hosts[4],
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938",
    featured: false,
    ambianceDescription: "Industrial brewery setting with gleaming steel tanks and the lively atmosphere of a working brewery.",
    accessibilityInfo: "Wheelchair accessible tour route available",
    dietaryOptions: ["Gluten-free beer options", "Vegan snacks"],
    meetingPointDetails: "Meet at the brewery's main reception desk. Tours start promptly at the scheduled time.",
    cancellationPolicy: "48-hour cancellation policy",
    foodPairings: "Brewery-style pretzels, beer cheese, and smoked meats pair perfectly with our beer selection.",
    languagesSpoken: ["English"]
  },
  {
    id: "e5",
    title: "Premium Olive Oil Masterclass",
    description: "Immerse yourself in the world of premium olive oils. Learn to identify quality indicators, regional variations, and proper tasting techniques.",
    category: "oil",
    date: "2025-06-25",
    time: "18:00",
    duration: "2 hours",
    location: {
      venue: "Mediterranean Culinary Center",
      address: "56 Olive Grove Lane",
      city: "San Francisco",
      coordinates: [37.774929, -122.419416]
    },
    price: 70,
    capacity: 15,
    spotsLeft: 9,
    products: [
      {
        id: "p13",
        name: "Tuscan Extra Virgin Olive Oil",
        description: "Robust Tuscan oil with peppery finish and grassy notes",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
        producer: "Castello di Verrazzano",
        type: "Extra Virgin"
      },
      {
        id: "p14",
        name: "Spanish Arbequina",
        description: "Mild and fruity oil with buttery texture and almond notes",
        image: "https://images.unsplash.com/photo-1601628828688-632f38a5a7d0",
        producer: "Olivares del Sur",
        type: "Extra Virgin"
      },
      {
        id: "p15",
        name: "Greek Kalamata PDO",
        description: "Medium intensity oil with complex green fruit flavors",
        image: "https://images.unsplash.com/photo-1579636858271-f41a77094b15",
        producer: "Aegean Groves",
        type: "PDO Extra Virgin"
      }
    ],
    host: hosts[0],
    image: "https://images.unsplash.com/photo-1604935437372-15ff3496a5da",
    featured: false,
    ambianceDescription: "Mediterranean-inspired space with terracotta tiles, olive wood accents, and the warm glow of golden hour lighting.",
    accessibilityInfo: "Elevator access to second floor venue",
    dietaryOptions: ["Gluten-free bread", "Vegan options"],
    meetingPointDetails: "Take the elevator to the second floor and follow signs to the Mediterranean room.",
    cancellationPolicy: "24-hour cancellation policy",
    foodPairings: "Artisan breads, fresh vegetables, and aged balsamic vinegars showcase the oils' unique characteristics.",
    languagesSpoken: ["English", "Italian"]
  },
  {
    id: "e6",
    title: "Bean-to-Bar Chocolate Experience",
    description: "Follow the journey of chocolate from cocoa bean to finished bar. Taste chocolate at different stages of production and learn about origin characteristics.",
    category: "chocolate",
    date: "2025-06-28",
    time: "15:00",
    duration: "2.5 hours",
    location: {
      venue: "Cacao Workshop",
      address: "222 Sweet Street",
      city: "Chicago",
      coordinates: [41.878113, -87.629799]
    },
    price: 60,
    capacity: 18,
    spotsLeft: 5,
    products: [
      {
        id: "p16",
        name: "Madagascar 75% Dark",
        description: "Single-origin dark chocolate with bright red fruit notes",
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834",
        producer: "Bean & Bar Co.",
        type: "Dark Chocolate"
      },
      {
        id: "p17",
        name: "Ecuador 85% Dark",
        description: "Intense dark chocolate with floral aroma and earthy finish",
        image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52",
        producer: "Bean & Bar Co.",
        type: "Dark Chocolate"
      },
      {
        id: "p18",
        name: "Vietnamese 45% Milk",
        description: "Creamy milk chocolate with caramel and spice notes",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32",
        producer: "Bean & Bar Co.",
        type: "Milk Chocolate"
      }
    ],
    host: hosts[3],
    image: "https://images.unsplash.com/photo-1548907040-4bea05b6f01d",
    featured: true,
    ambianceDescription: "Artisan chocolate workshop with the rich aroma of cocoa and vintage chocolate-making equipment on display.",
    accessibilityInfo: "Ground floor workshop, wheelchair accessible",
    dietaryOptions: ["Dairy-free chocolate options", "Nut-free alternatives"],
    meetingPointDetails: "Enter through the workshop's storefront. The experience takes place in the production area behind the shop.",
    cancellationPolicy: "48-hour cancellation policy",
    foodPairings: "Fresh berries, roasted nuts, and artisanal coffee enhance the chocolate tasting journey.",
    languagesSpoken: ["English"]
  },
  {
    id: "e7",
    title: "Whiskey Appreciation & Tasting",
    description: "Expand your whiskey knowledge with this guided tasting of premium selections from around the world. Learn about different styles, production methods, and tasting notes.",
    category: "spirits",
    date: "2025-07-02",
    time: "20:00",
    duration: "2.5 hours",
    location: {
      venue: "The Barrel Room",
      address: "333 Distillery Avenue",
      city: "Nashville",
      coordinates: [36.162664, -86.781602]
    },
    price: 85,
    capacity: 20,
    spotsLeft: 3,
    products: [
      {
        id: "p19",
        name: "Kentucky Straight Bourbon",
        description: "Classic bourbon with vanilla, caramel, and oak notes",
        image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8",
        producer: "Heritage Distillery",
        type: "Bourbon"
      },
      {
        id: "p20",
        name: "Islay Single Malt Scotch",
        description: "Peaty scotch with maritime influence and complex smoke",
        image: "https://images.unsplash.com/photo-1527683040093-3a2b80ed1592",
        producer: "Highland Spirits",
        type: "Single Malt"
      },
      {
        id: "p21",
        name: "Japanese Blended Whisky",
        description: "Refined, balanced whisky with subtle fruit and spice",
        image: "https://images.unsplash.com/photo-1516997121675-4cde5a160d32",
        producer: "Sakura Distillery",
        type: "Blended Whisky"
      }
    ],
    host: hosts[4],
    image: "https://images.unsplash.com/photo-1575650772417-e6b418b0d106",
    featured: false,
    ambianceDescription: "Intimate whiskey lounge with leather seating, dim lighting, and walls lined with premium spirit bottles.",
    accessibilityInfo: "Step-free access via side entrance",
    dietaryOptions: ["Light appetizers available"],
    meetingPointDetails: "Enter through the main lounge entrance. The tasting takes place in the private barrel room.",
    cancellationPolicy: "24-hour cancellation policy",
    foodPairings: "Dark chocolate, aged cheeses, and smoked nuts complement the whiskey selection.",
    languagesSpoken: ["English"]
  },
  {
    id: "e8",
    title: "Artisanal Honey Flight & Food Pairing",
    description: "Experience the incredible diversity of artisanal honey varieties and learn how they pair with cheese, fruit, and more.",
    category: "honey",
    date: "2025-07-05",
    time: "14:00",
    duration: "2 hours",
    location: {
      venue: "The Hive",
      address: "444 Beekeeper's Way",
      city: "Minneapolis",
      coordinates: [44.977753, -93.265011]
    },
    price: 50,
    capacity: 16,
    spotsLeft: 10,
    products: [
      {
        id: "p22",
        name: "Wild Blackberry Honey",
        description: "Deeply fruity honey with rich berry notes",
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
        producer: "Wildflower Apiaries",
        type: "Raw Honey"
      },
      {
        id: "p23",
        name: "Orange Blossom Honey",
        description: "Delicate citrus-scented honey with floral undertones",
        image: "https://images.unsplash.com/photo-1586768026130-429b1adae786",
        producer: "Citrus Grove Honey",
        type: "Floral Honey"
      },
      {
        id: "p24",
        name: "Buckwheat Honey",
        description: "Robust, dark honey with molasses and malt notes",
        image: "https://images.unsplash.com/photo-1563813822992-0a392c28c9e0",
        producer: "Heritage Hives",
        type: "Dark Honey"
      }
    ],
    host: hosts[1],
    image: "https://images.unsplash.com/photo-1532635239-06e08db8f247",
    featured: false,
    ambianceDescription: "Bright, airy space with hexagonal design elements and large windows overlooking wildflower gardens.",
    accessibilityInfo: "Ground floor venue, fully accessible",
    dietaryOptions: ["Vegan cheese options", "Gluten-free crackers"],
    meetingPointDetails: "Meet at the front desk in the main lobby. The tasting room is just past the honey retail area.",
    cancellationPolicy: "24-hour cancellation policy",
    foodPairings: "Artisan cheeses, fresh fruits, and herbal teas create perfect harmony with our honey selection.",
    languagesSpoken: ["English"]
  }
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getEventsByCategory = (category: string): Event[] => {
  if (!category) return mockEvents;
  return mockEvents.filter(event => event.category === category);
};

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.featured);
};

export const getSimilarEvents = (currentEventId: string, category: string, limit = 3): Event[] => {
  return mockEvents
    .filter(event => event.id !== currentEventId && event.category === category)
    .slice(0, limit);
};

export const searchEvents = (query: string): Event[] => {
  query = query.toLowerCase();
  return mockEvents.filter(
    event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.location.city.toLowerCase().includes(query)
  );
};

export const filterEvents = (
  filters: {
    categories?: string[];
    date?: Date;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }
): Event[] => {
  return mockEvents.filter(event => {
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(event.category)) return false;
    }
    
    // Filter by date
    if (filters.date) {
      const eventDate = new Date(event.date);
      const filterDate = filters.date;
      if (
        eventDate.getFullYear() !== filterDate.getFullYear() ||
        eventDate.getMonth() !== filterDate.getMonth() ||
        eventDate.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }
    
    // Filter by price range
    if (filters.minPrice !== undefined && event.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && event.price > filters.maxPrice) return false;
    
    // Filter by location
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      const cityMatch = event.location.city.toLowerCase().includes(locationLower);
      const venueMatch = event.location.venue.toLowerCase().includes(locationLower);
      const addressMatch = event.location.address.toLowerCase().includes(locationLower);
      if (!(cityMatch || venueMatch || addressMatch)) return false;
    }
    
    return true;
  });
};
