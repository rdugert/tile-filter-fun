
import { Player } from '@/api/dashboardApi';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PlayersListProps {
  players: Player[];
  title: string;
  loading?: boolean;
  onRefresh?: () => void;
}

const PlayersList = ({ 
  players, 
  title, 
  loading = false, 
  onRefresh 
}: PlayersListProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="tile-card animate-fade-in">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw size={16} className={cn("text-gray-500", loading && "animate-spin")} />
        </button>
      </div>
      
      <div className="overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deposits
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : (
              // Actual data
              players.map((player, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "transition-colors hover:bg-gray-50",
                    mounted && "animate-slide-up",
                    { "animate-delay-[200ms]": index === 1 },
                    { "animate-delay-[300ms]": index === 2 },
                    { "animate-delay-[400ms]": index === 3 },
                    { "animate-delay-[500ms]": index === 4 }
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-3 font-medium">
                    <div className="flex items-center">
                      <span className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        player.status === 'online' ? "bg-casinoGreen" : "bg-gray-300"
                      )}></span>
                      {player.email}
                    </div>
                  </td>
                  <td className="p-3">{player.brand}</td>
                  <td className="p-3 text-right">{player.deposits.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersList;
