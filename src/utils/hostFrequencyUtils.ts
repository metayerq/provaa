
export const formatHostingFrequency = (averageFrequencyDays: number | null): string => {
  if (!averageFrequencyDays) return "occasionally";
  
  if (averageFrequencyDays <= 30) {
    return "monthly";
  } else if (averageFrequencyDays <= 60) {
    return "every 2 months";
  } else if (averageFrequencyDays <= 90) {
    return "every 2-3 months";
  } else if (averageFrequencyDays <= 120) {
    return "quarterly";
  } else if (averageFrequencyDays <= 180) {
    return "every 4-6 months";
  } else {
    return "rarely";
  }
};

export const getFrequencyBadge = (averageFrequencyDays: number | null) => {
  if (!averageFrequencyDays) {
    return { emoji: "⚡", label: "OCCASIONAL", color: "blue" };
  }
  
  if (averageFrequencyDays >= 90) {
    return { emoji: "⚡", label: "RARE", color: "amber" };
  } else if (averageFrequencyDays >= 60) {
    return { emoji: "⏰", label: "OCCASIONAL", color: "orange" };
  } else {
    return { emoji: "📅", label: "REGULAR", color: "green" };
  }
};

export const getUrgencyMessage = (
  averageFrequencyDays: number | null,
  lastEventDate: string | null
): string | null => {
  if (!averageFrequencyDays || !lastEventDate) return null;
  
  const daysSinceLastEvent = Math.floor(
    (new Date().getTime() - new Date(lastEventDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (averageFrequencyDays >= 90) {
    if (daysSinceLastEvent >= averageFrequencyDays * 0.8) {
      return `🔥 First event in ${Math.floor(daysSinceLastEvent / 30)} months!`;
    }
  }
  
  return null;
};

export const formatLastEventDate = (lastEventDate: string | null): string => {
  if (!lastEventDate) return "No previous events";
  
  const date = new Date(lastEventDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return "last week";
  } else if (diffDays <= 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else if (diffDays <= 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  } else {
    return `over a year ago`;
  }
};
