
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  helpful?: boolean;
}

export const faqData: FAQ[] = [
  // Getting Started
  {
    id: 'gs-1',
    question: 'What is Provaa and how does it work?',
    answer: 'Provaa is a platform that connects food lovers with unique culinary experiences hosted by passionate local experts. You can discover and book intimate tastings, cooking classes, and dining experiences, or become a host and share your culinary knowledge with others.',
    category: 'getting-started',
    tags: ['platform', 'overview']
  },
  {
    id: 'gs-2',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking "Sign Up" in the top right corner of our website. Choose whether you want to join as an attendee, host, or both. Fill in your details, verify your email, and you\'re ready to start exploring amazing culinary experiences.',
    category: 'getting-started',
    tags: ['account', 'registration']
  },
  {
    id: 'gs-3',
    question: 'Is Provaa free to use?',
    answer: 'Yes, creating an account and browsing events is completely free. You only pay when you book an experience, and hosts set their own pricing. There are no hidden fees for attendees.',
    category: 'getting-started',
    tags: ['pricing', 'free']
  },

  // For Attendees
  {
    id: 'att-1',
    question: 'How do I book an experience?',
    answer: 'Browse our events page, select an experience that interests you, choose your preferred date and number of tickets, then complete the booking process with your payment information. You\'ll receive a confirmation email with all the details.',
    category: 'attendees',
    tags: ['booking', 'process']
  },
  {
    id: 'att-2',
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking according to the host\'s cancellation policy, which is displayed on each event page. Most hosts offer full refunds for cancellations made 48 hours in advance.',
    category: 'attendees',
    tags: ['cancellation', 'refund']
  },
  {
    id: 'att-3',
    question: 'What should I bring to an experience?',
    answer: 'Each host will provide specific instructions in your booking confirmation. Generally, just bring yourself and an appetite for learning! Some experiences may require you to bring an apron or notebook.',
    category: 'attendees',
    tags: ['preparation', 'what to bring']
  },
  {
    id: 'att-4',
    question: 'Can I attend if I have dietary restrictions?',
    answer: 'Absolutely! When booking, you can specify your dietary restrictions in the special requests section. Hosts are very accommodating and will do their best to provide suitable alternatives.',
    category: 'attendees',
    tags: ['dietary', 'allergies', 'vegetarian']
  },

  // For Hosts
  {
    id: 'host-1',
    question: 'How do I become a host on Provaa?',
    answer: 'To become a host, sign up for an account and select "Host" as your user type. Complete your profile with your culinary background, then create your first experience. Our team will review and approve your listing.',
    category: 'hosts',
    tags: ['becoming host', 'approval']
  },
  {
    id: 'host-2',
    question: 'What fees do hosts pay?',
    answer: 'Provaa charges a small service fee on each booking to cover payment processing and platform maintenance. You keep the majority of your earnings. Detailed fee information is available in your host dashboard.',
    category: 'hosts',
    tags: ['fees', 'earnings']
  },
  {
    id: 'host-3',
    question: 'How do I manage my bookings?',
    answer: 'Use your host dashboard to view all bookings, manage attendee information, communicate with guests, and track your earnings. You can also update event details and manage your calendar.',
    category: 'hosts',
    tags: ['dashboard', 'management']
  },
  {
    id: 'host-4',
    question: 'What if I need to cancel an event?',
    answer: 'If you must cancel an event, do so as early as possible through your host dashboard. All attendees will be automatically notified and receive full refunds. Frequent cancellations may affect your host rating.',
    category: 'hosts',
    tags: ['cancellation', 'host cancellation']
  },

  // Events & Experiences
  {
    id: 'ev-1',
    question: 'What types of experiences are available?',
    answer: 'We offer a wide variety of culinary experiences including wine tastings, cheese pairings, cooking classes, chef\'s table dinners, chocolate workshops, coffee cuppings, and much more. Each experience is unique and crafted by passionate hosts.',
    category: 'events',
    tags: ['types', 'variety']
  },
  {
    id: 'ev-2',
    question: 'How long do experiences typically last?',
    answer: 'Experience duration varies by type and host, typically ranging from 1.5 to 4 hours. The duration is clearly stated on each event listing so you can plan accordingly.',
    category: 'events',
    tags: ['duration', 'timing']
  },
  {
    id: 'ev-3',
    question: 'Are experiences suitable for beginners?',
    answer: 'Yes! Most of our experiences welcome all skill levels. Hosts are excellent teachers who love sharing their knowledge with both beginners and experienced food enthusiasts.',
    category: 'events',
    tags: ['beginners', 'skill level']
  },

  // Payments & Refunds
  {
    id: 'pay-1',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and digital payment methods. Payments are processed securely through our encrypted payment system.',
    category: 'payments',
    tags: ['payment methods', 'credit cards']
  },
  {
    id: 'pay-2',
    question: 'When am I charged for my booking?',
    answer: 'You\'re charged immediately when you complete your booking. This secures your spot and allows the host to prepare for your attendance.',
    category: 'payments',
    tags: ['charging', 'when charged']
  },
  {
    id: 'pay-3',
    question: 'How do refunds work?',
    answer: 'Refunds are processed according to the host\'s cancellation policy. Approved refunds are typically processed within 3-5 business days back to your original payment method.',
    category: 'payments',
    tags: ['refunds', 'processing time']
  },

  // Account & Profile
  {
    id: 'acc-1',
    question: 'How do I update my profile information?',
    answer: 'Go to your account settings by clicking on your profile picture, then select "Profile Settings." You can update your personal information, preferences, and notification settings.',
    category: 'account',
    tags: ['profile', 'settings']
  },
  {
    id: 'acc-2',
    question: 'Can I change my password?',
    answer: 'Yes, you can change your password in your account settings under the "Security" section. We recommend using a strong, unique password for your account security.',
    category: 'account',
    tags: ['password', 'security']
  },

  // Technical Support
  {
    id: 'sup-1',
    question: 'I\'m having trouble with the website. What should I do?',
    answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, contact our support team with details about the problem and your browser information.',
    category: 'support',
    tags: ['website issues', 'troubleshooting']
  },
  {
    id: 'sup-2',
    question: 'How do I contact customer support?',
    answer: 'You can reach our support team through the "Contact Support" button on this page, email us at support@provaa.com, or use the live chat feature available during business hours.',
    category: 'support',
    tags: ['contact', 'support']
  }
];
