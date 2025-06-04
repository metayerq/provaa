
export interface SearchSuggestion {
  id: string;
  type: 'guest' | 'host' | 'experience' | 'location';
  title: string;
  subtitle?: string;
  icon: string;
  url: string;
}

export interface SearchResults {
  guests: SearchSuggestion[];
  hosts: SearchSuggestion[];
  experiences: SearchSuggestion[];
  locations: SearchSuggestion[];
}

export interface SearchResponse {
  suggestions: SearchSuggestion[];
  totalCount: number;
}
