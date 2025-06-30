
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
    </div>
  );
};

export default PageHeader;
