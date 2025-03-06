
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="dashboard-header">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className={cn(
              "font-semibold tracking-tight",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex mt-2">
          <nav className="text-sm breadcrumbs">
            <ul className="flex space-x-2">
              <li className="text-blue-500 font-medium">Home</li>
              <li className="text-muted-foreground before:content-['/'] before:mx-2 before:text-muted-foreground">
                Dashboard
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
