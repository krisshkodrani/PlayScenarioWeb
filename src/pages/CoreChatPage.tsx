
import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import CoreChat from '@/components/CoreChat';

const CoreChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get('instance');
  const scenarioId = searchParams.get('scenario');

  // Redirect to browse scenarios if required parameters are missing
  if (!instanceId || !scenarioId) {
    return <Navigate to="/browse" replace />;
  }

  return <CoreChat instanceId={instanceId} scenarioId={scenarioId} />;
};

export default CoreChatPage;
