
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  monthlyStats?: Array<{
    value: string | number;
    label: string;
    className?: string;
  }>;
  loading?: boolean;
  className?: string;
  onRequestMonthlyData?: () => void;
}

const StatCard = ({ 
  title, 
  subtitle, 
  icon, 
  stats, 
  monthlyStats,
  loading = false,
  className,
  onRequestMonthlyData 
}: StatCardProps) => {
  const [showMonthly, setShowMonthly] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggleView = () => {
    if (!monthlyStats && onRequestMonthlyData) {
      onRequestMonthlyData();
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMonthly(!showMonthly);
      setIsTransitioning(false);
    }, 300);
  };

  const currentStats = showMonthly && monthlyStats ? monthlyStats : stats;
  const currentSubtitle = showMonthly ? subtitle.replace('Day', 'Month') : subtitle;

  return (
    <div 
      className={cn(
        "tile-card animate-fade-in cursor-pointer", 
        loading && "opacity-90",
        isTransitioning && "animate-scale-out",
        !isTransitioning && showMonthly && "animate-scale-in",
        className
      )}
      onClick={!isTransitioning ? handleToggleView : undefined}
    >
      <div className="flex justify-between items-start p-4 border-b">
        {showMonthly && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 mr-2" 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleView();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        
        {icon && (
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div className={cn("flex flex-col items-end ml-auto", showMonthly && "pr-2")}>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{currentSubtitle}</p>
        </div>
      </div>
      
      <div className={cn(
        "grid grid-cols-4 gap-3 p-4",
        currentStats.length <= 3 && "grid-cols-3",
        currentStats.length <= 2 && "grid-cols-2"
      )}>
        {loading ? (
          // Skeleton loading state
          <>
            {currentStats.map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-pulse">
                <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-12 bg-gray-100 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          // Actual data
          <>
            {currentStats.map((stat, index) => (
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
