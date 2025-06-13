import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    parent?: string;
  };
}

const BREADCRUMB_CONFIG: BreadcrumbConfig = {
  '/': { label: 'Home' },
  '/dashboard': { label: 'Dashboard' },
  '/my-scenarios': { label: 'My Scenarios', parent: '/dashboard' },
  '/my-characters': { label: 'My Characters', parent: '/dashboard' },
  '/create-scenario': { label: 'Create Scenario', parent: '/my-scenarios' },
  '/create-character': { label: 'Create Character', parent: '/my-characters' },
  '/credits/purchase': { label: 'Purchase Credits', parent: '/dashboard' },
  '/browse': { label: 'Browse Scenarios' },
  '/profile': { label: 'Profile', parent: '/dashboard' },
};

interface AppBreadcrumbProps {
  showBackButton?: boolean;
  customBreadcrumbs?: Array<{ label: string; href?: string }>;
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ 
  showBackButton = false,
  customBreadcrumbs 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const buildBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const breadcrumbs = [];
    let currentPath = location.pathname;
    
    // Handle dynamic routes (e.g., /results/:id)
    if (currentPath.startsWith('/results/')) {
      breadcrumbs.unshift({ label: 'Results', href: undefined });
      currentPath = '/dashboard';
    } else if (currentPath.startsWith('/scenario/')) {
      breadcrumbs.unshift({ label: 'Scenario Preview', href: undefined });
      currentPath = '/browse';
    }

    // Build breadcrumb trail
    while (currentPath && BREADCRUMB_CONFIG[currentPath]) {
      const config = BREADCRUMB_CONFIG[currentPath];
      breadcrumbs.unshift({ 
        label: config.label, 
        href: currentPath === location.pathname ? undefined : currentPath 
      });
      currentPath = config.parent || '';
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  const handleBack = () => {
    navigate(-1);
  };

  if (breadcrumbs.length <= 1 && !showBackButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}
      
      {breadcrumbs.length > 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink 
                      onClick={() => navigate(crumb.href!)}
                      className="cursor-pointer text-slate-400 hover:text-cyan-400"
                    >
                      {index === 0 && <Home className="w-4 h-4 mr-1" />}
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-white font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
};

export default AppBreadcrumb;
