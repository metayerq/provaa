
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Search } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  helpful?: boolean;
}

interface FAQContentProps {
  faqs: FAQ[];
  searchQuery: string;
  selectedCategory: string;
}

export const FAQContent: React.FC<FAQContentProps> = ({
  faqs,
  searchQuery,
  selectedCategory,
}) => {
  const getCategoryName = (categoryId: string) => {
    const categories = {
      'getting-started': 'Getting Started',
      'attendees': 'For Attendees',
      'hosts': 'For Hosts',
      'events': 'Events & Experiences',
      'payments': 'Payments & Refunds',
      'account': 'Account & Profile',
      'support': 'Technical Support',
    };
    return categories[categoryId as keyof typeof categories] || categoryId;
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600">
          {searchQuery 
            ? `No FAQs match your search for "${searchQuery}"`
            : "No FAQs available for this category"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === 'all' ? 'All Questions' : getCategoryName(selectedCategory)}
            </h2>
            <p className="text-sm text-gray-600">
              {faqs.length} question{faqs.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-lg border">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b last:border-b-0">
              <AccordionTrigger className="text-left px-6 py-4 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-base">
                        {highlightText(faq.question, searchQuery)}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(faq.category)}
                        </Badge>
                        {faq.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-700 leading-relaxed">
                    {highlightText(faq.answer, searchQuery)}
                  </div>
                </div>
                
                {/* Helpful feedback */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Was this helpful?</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Yes
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
