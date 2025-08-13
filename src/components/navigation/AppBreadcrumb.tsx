import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    parent?: string;
  };
}
const BREADCRUMB_CONFIG: BreadcrumbConfig = {
  '/': {
    label: 'Home'
  },
  '/dashboard': {
    label: 'Dashboard'
  },
  '/my-scenarios': {
    label: 'My Scenarios',
    parent: '/dashboard'
  },
  '/my-characters': {
    label: 'My Characters',
    parent: '/dashboard'
  },
  '/create-scenario': {
    label: 'Create Scenario',
    parent: '/my-scenarios'
  },
  '/create-character': {
    label: 'Create Character',
    parent: '/my-characters'
  },
  '/credits/purchase': {
    label: 'Purchase Credits',
    parent: '/dashboard'
  },
  '/browse': {
    label: 'Browse Scenarios'
  },
  '/profile': {
    label: 'Profile',
    parent: '/dashboard'
  },
  '/core-chat': {
    label: 'Scenario Play',
    parent: '/browse'
  },
  '/login': {
    label: 'Login'
  },
  '/register': {
    label: 'Register'
  },
  '/admin': {
    label: 'Admin Dashboard'
  },
  '/admin/users': {
    label: 'User Management',
    parent: '/admin'
  },
  '/admin/scenarios': {
    label: 'Scenario Moderation',
    parent: '/admin'
  },
  '/admin/characters': {
    label: 'Character Moderation',
    parent: '/admin'
  },
  '/admin/audit': {
    label: 'Audit Trail',
    parent: '/admin'
  }
};
interface AppBreadcrumbProps {
  showBackButton?: boolean;
  customBreadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  showBackButton = false,
  customBreadcrumbs
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get authentication-aware breadcrumb configuration
  const getBreadcrumbConfig = (): BreadcrumbConfig => {
    const config = { ...BREADCRUMB_CONFIG };
    
    // For authenticated users, browse should go to dashboard
    if (user) {
      config['/browse'] = {
        label: 'Browse Scenarios',
        parent: '/dashboard'
      };
    } else {
      config['/browse'] = {
        label: 'Browse Scenarios',
        parent: '/'
      };
    }
    
    return config;
  };
  const buildBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }
    const breadcrumbs = [];
    let currentPath = location.pathname;

    // Handle dynamic routes (e.g., /results/:id)
    if (currentPath.startsWith('/results/')) {
      breadcrumbs.unshift({
        label: 'Results',
        href: undefined
      });
      currentPath = '/dashboard';
    } else if (currentPath.startsWith('/scenario/')) {
      breadcrumbs.unshift({
        label: 'Scenario Preview',
        href: undefined
      });
      currentPath = '/browse';
    }

    // Build breadcrumb trail
    const breadcrumbConfig = getBreadcrumbConfig();
    while (currentPath && breadcrumbConfig[currentPath]) {
      const config = breadcrumbConfig[currentPath];
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
  return <div className="flex items-center gap-4 mb-6">
      {showBackButton}
      
      {breadcrumbs.length > 1 && <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => <div key={index} className="contents">
                <BreadcrumbItem>
                  {crumb.href ? <BreadcrumbLink onClick={() => navigate(crumb.href!)} className="cursor-pointer text-slate-400 hover:text-cyan-400">
                      {crumb.label}
                    </BreadcrumbLink> : <BreadcrumbPage className="text-white font-medium">
                      {crumb.label}
                    </BreadcrumbPage>}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>)}
          </BreadcrumbList>
        </Breadcrumb>}
    </div>;
};
export default AppBreadcrumb;