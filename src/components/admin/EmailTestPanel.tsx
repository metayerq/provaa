
import React from 'react';
import { TestControls } from './email-test/TestControls';
import { TestResults } from './email-test/TestResults';
import { useEmailTesting } from './email-test/useEmailTesting';

export const EmailTestPanel: React.FC = () => {
  const { isLoading, testResults, runEmailTest } = useEmailTesting();

  return (
    <div className="space-y-6">
      <TestControls isLoading={isLoading} onTest={runEmailTest} />
      <TestResults results={testResults} />
    </div>
  );
};
