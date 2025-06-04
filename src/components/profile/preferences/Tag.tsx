interface TagProps {
  id: string;
  label: string;
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Tag = ({ id, label, emoji, isSelected, onClick }: TagProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mint/20 focus:ring-offset-2
        min-h-[2.5rem] flex-shrink-0
        ${isSelected 
          ? 'bg-mint text-white shadow-sm' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      style={{ 
        willChange: 'background-color, color',
        transform: 'translateZ(0)'
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
};
