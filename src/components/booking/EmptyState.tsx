
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'upcoming' | 'past' | 'cancelled';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const messages = {
    upcoming: {
      title: "No upcoming bookings yet",
      description: "Discover authentic culinary experiences and join our passionate community!",
      buttonText: "Browse Experiences"
    },
    past: {
      title: "You haven't attended any experiences yet",
      description: "Book your first culinary adventure and create memorable moments!",
      buttonText: "Find Your First Experience"
    },
    cancelled: {
      title: "No cancelled bookings",
      description: "All your bookings are active!",
      buttonText: null
    }
  };

  const message = messages[type];

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">{message.title}</h2>
      <p className="text-gray-600 mb-6">{message.description}</p>
      {message.buttonText && (
        <Link to="/events">
          <Button className="bg-emerald-700 hover:bg-emerald-800">
            {message.buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};
