
import React from 'react';
import AppBreadcrumb from './AppBreadcrumb';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  customBreadcrumbs?: Array<{ label: string; href?: string }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  showBackButton = false,
  customBreadcrumbs
}) => {
  return (
    <div className="mb-8">
      <AppBreadcrumb 
        showBackButton={showBackButton}
        customBreadcrumbs={customBreadcrumbs}
      />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-slate-400 text-lg">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex-shrink-0 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
