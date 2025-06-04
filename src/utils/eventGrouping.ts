
import { Event } from '@/utils/mockData';
import { resolveCategoryName } from '@/utils/categoryResolver';

export interface GroupedData {
  [key: string]: {
    items: Event[];
    count: number;
    metadata?: any;
  };
}

export const groupEventsByCity = (events: Event[]): GroupedData => {
  const grouped: GroupedData = {};
  
  events.forEach(event => {
    // Clean up city name by trimming whitespace
    const city = event.location.city.trim();
    if (!grouped[city]) {
      grouped[city] = {
        items: [],
        count: 0,
        metadata: {
          venues: new Set(),
          avgPrice: 0
        }
      };
    }
    grouped[city].items.push(event);
    grouped[city].count++;
    grouped[city].metadata.venues.add(event.location.venue);
  });

  // Calculate average prices
  Object.keys(grouped).forEach(city => {
    const totalPrice = grouped[city].items.reduce((sum, event) => sum + event.price, 0);
    grouped[city].metadata.avgPrice = Math.round(totalPrice / grouped[city].count);
    grouped[city].metadata.venues = grouped[city].metadata.venues.size;
  });

  return grouped;
};

export const groupEventsByHost = (events: Event[]): GroupedData => {
  const grouped: GroupedData = {};
  
  events.forEach(event => {
    const hostId = event.host.id;
    const hostName = event.host.name;
    
    if (!grouped[hostId]) {
      grouped[hostId] = {
        items: [],
        count: 0,
        metadata: {
          hostName,
          rating: event.host.rating,
          totalEvents: event.host.events,
          bio: event.host.bio,
          avgPrice: 0
        }
      };
    }
    grouped[hostId].items.push(event);
    grouped[hostId].count++;
  });

  // Calculate average prices for each host
  Object.keys(grouped).forEach(hostId => {
    const totalPrice = grouped[hostId].items.reduce((sum, event) => sum + event.price, 0);
    grouped[hostId].metadata.avgPrice = Math.round(totalPrice / grouped[hostId].count);
  });

  return grouped;
};

export const groupEventsByVenue = (events: Event[]): GroupedData => {
  const grouped: GroupedData = {};
  
  events.forEach(event => {
    const venue = event.location.venue.trim();
    if (!grouped[venue]) {
      grouped[venue] = {
        items: [],
        count: 0,
        metadata: {
          city: event.location.city.trim(),
          address: event.location.address,
          avgPrice: 0
        }
      };
    }
    grouped[venue].items.push(event);
    grouped[venue].count++;
  });

  // Calculate average prices
  Object.keys(grouped).forEach(venue => {
    const totalPrice = grouped[venue].items.reduce((sum, event) => sum + event.price, 0);
    grouped[venue].metadata.avgPrice = Math.round(totalPrice / grouped[venue].count);
  });

  return grouped;
};

export const groupEventsByType = async (events: Event[]): Promise<GroupedData> => {
  const grouped: GroupedData = {};
  
  // First, group events by category ID
  const categoryGroups: { [key: string]: Event[] } = {};
  events.forEach(event => {
    const category = event.category || 'custom';
    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push(event);
  });

  // Resolve category names and create grouped data
  for (const [categoryId, categoryEvents] of Object.entries(categoryGroups)) {
    const resolvedName = await resolveCategoryName(categoryId);
    
    if (!grouped[resolvedName]) {
      grouped[resolvedName] = {
        items: [],
        count: 0,
        metadata: {
          categoryId,
          avgPrice: 0,
          cities: new Set()
        }
      };
    }
    
    categoryEvents.forEach(event => {
      grouped[resolvedName].items.push(event);
      grouped[resolvedName].count++;
      grouped[resolvedName].metadata.cities.add(event.location.city);
    });
  }

  // Calculate metadata for each resolved group
  Object.keys(grouped).forEach(typeName => {
    const totalPrice = grouped[typeName].items.reduce((sum, event) => sum + event.price, 0);
    grouped[typeName].metadata.avgPrice = Math.round(totalPrice / grouped[typeName].count);
    grouped[typeName].metadata.cities = grouped[typeName].metadata.cities.size;
  });

  return grouped;
};
