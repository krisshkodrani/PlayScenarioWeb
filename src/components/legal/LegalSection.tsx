
import React from 'react';

interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  level?: 1 | 2 | 3;
}

const LegalSection: React.FC<LegalSectionProps> = ({
  id,
  title,
  children,
  level = 1
}) => {
  const HeadingTag = `h${level + 1}` as keyof JSX.IntrinsicElements;
  
  const headingClasses = {
    1: "text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-700",
    2: "text-xl font-semibold text-cyan-400 mt-6 mb-3",
    3: "text-lg font-medium text-violet-400 mt-4 mb-2"
  };

  return (
    <section id={id} className="scroll-mt-6">
      <HeadingTag className={headingClasses[level]}>
        {title}
      </HeadingTag>
      <div className="text-slate-300 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
};

export default LegalSection;
