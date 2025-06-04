
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestResultItem } from './TestResultItem';

interface TestResultData {
  type: string;
  mode?: string;
  bookingRef?: string;
  eventTitle?: string;
  eventDate?: string;
  eventDetails?: string;
  response?: any;
  simulationNote?: string;
  error?: any;
}

interface TestResult {
  id: number;
  type: string;
  timestamp: string;
  success: boolean;
  data: TestResultData;
}

interface TestResultsProps {
  results: TestResult[];
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <TestResultItem key={result.id} result={result} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
