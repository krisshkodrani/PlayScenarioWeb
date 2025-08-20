import React from 'react';
import { Message } from '../../types/chat';

interface StreamingDebugInfoProps {
  messages: Message[];
  show?: boolean;
}

const StreamingDebugInfo: React.FC<StreamingDebugInfoProps> = ({ messages, show = false }) => {
  if (!show || !messages.length) return null;

  const streamableMessages = messages.filter(msg => 
    msg.message_type === 'ai_response' || msg.message_type === 'narration'
  );

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="font-semibold mb-2">Streaming Debug Info</div>
      {streamableMessages.map(msg => (
        <div key={msg.id} className="mb-1 pb-1 border-b border-gray-600 last:border-b-0">
          <div className="text-yellow-400">{msg.message_type}</div>
          <div className="text-gray-300">ID: {msg.id.slice(-8)}</div>
          <div className={`font-semibold ${msg.streamed ? 'text-green-400' : 'text-red-400'}`}>
            Streamed: {msg.streamed ? 'Yes' : 'No'}
          </div>
          <div className="text-gray-400 truncate">
            {typeof msg.message === 'string' ? msg.message.slice(0, 30) : 'JSON'}...
          </div>
        </div>
      ))}
    </div>
  );
};

export default StreamingDebugInfo;