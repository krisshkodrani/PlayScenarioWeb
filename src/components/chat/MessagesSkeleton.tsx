import React from 'react';

interface MessagesSkeletonProps {
  rows?: number;
}

const MessagesSkeleton: React.FC<MessagesSkeletonProps> = ({ rows = 6 }) => {
  return (
    <div className="p-4 space-y-6">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg h-6 rounded-lg ${idx % 2 === 0 ? 'bg-slate-700' : 'bg-cyan-400/30'} animate-pulse w-[70%]`} />
        </div>
      ))}
    </div>
  );
};

export default MessagesSkeleton;
