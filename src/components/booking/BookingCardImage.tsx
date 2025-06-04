
interface BookingCardImageProps {
  image?: string;
  title?: string;
}

export const BookingCardImage: React.FC<BookingCardImageProps> = ({
  image,
  title
}) => {
  // Add cache busting for updated images
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return imageUrl;
    
    // Add timestamp to bust cache for Supabase storage URLs
    if (imageUrl.includes('supabase')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}t=${Date.now()}`;
    }
    
    return imageUrl;
  };

  return (
    <div className="w-full md:w-64 h-48 bg-gray-100">
      {image ? (
        <img 
          src={getImageUrl(image)} 
          alt={title} 
          className="w-full h-full object-cover"
          key={image} // Force re-render when image URL changes
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
          🍽️
        </div>
      )}
    </div>
  );
};
