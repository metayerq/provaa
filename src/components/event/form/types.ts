
export interface ProductForm {
  name: string;
  producer: string;
  year: string;
  type: string;
}

export interface EventForm {
  title: string;
  description: string;
  category: string;
  date: Date | null;
  time: string;
  duration: string;
  capacity: number;
  price: number;
  image: File | null;
  isOnline: boolean;
  venueName: string;
  address: string;
  city: string;
  ambianceDescription: string;
  products: ProductForm[];
  // Additional practical details fields
  accessibilityInfo: string;
  dressCode: string;
  dietaryOptions: string[];
  meetingPointDetails: string;
  cancellationPolicy: string;
  // SEO fields
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  // Add this for handling existing images in edit mode
  existingImageUrl?: string;
}

export interface CreateEventFormProps {
  initialData?: Partial<EventForm>;
  onSave: (data: EventForm, isDraft?: boolean) => Promise<void>;
  isEditing?: boolean;
}
