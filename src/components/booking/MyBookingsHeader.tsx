
import { MyBookingsSearch } from './MyBookingsSearch';

interface MyBookingsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const MyBookingsHeader: React.FC<MyBookingsHeaderProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <MyBookingsSearch 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
    </div>
  );
};
