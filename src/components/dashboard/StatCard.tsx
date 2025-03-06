
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  value: string | number;
  label: string;
  className?: string;
}

const StatItem = ({ value, label, className }: StatItemProps) => (
  <div className={cn("flex flex-col items-center", className)}>
    <div className="metric-value text-casinoGreen">{value}</div>
    <div className="metric-label">{label}</div>
  </div>
);

interface StatCardProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  stats: Array<{
    value: string | number;
    label: string;
    className?: string;
  }>;
  loading?: boolean;
  className?: string;
}

const StatCard = ({ 
  title, 
  subtitle, 
  icon, 
  stats, 
  loading = false,
  className 
}: StatCardProps) => {
  return (
    <div className={cn(
      "tile-card animate-fade-in", 
      loading && "opacity-90",
      className
    )}>
      <div className="flex justify-between items-start p-4 border-b">
        {icon && (
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col items-end ml-auto">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className={cn(
        "grid grid-cols-4 gap-3 p-4",
        stats.length <= 3 && "grid-cols-3",
        stats.length <= 2 && "grid-cols-2"
      )}>
        {loading ? (
          // Skeleton loading state
          <>
            {stats.map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-12 bg-gray-100 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          // Actual data
          <>
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                className={stat.className}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
