
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CasinoOption } from '@/api/dashboardApi';
import { ChevronDown, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface FilterBarProps {
  casinos: CasinoOption[];
  currencies: string[];
  selectedCasino: string;
  selectedCurrency: string;
  onCasinoChange: (casino: string) => void;
  onCurrencyChange: (currency: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const FilterBar = ({
  casinos,
  currencies,
  selectedCasino,
  selectedCurrency,
  onCasinoChange,
  onCurrencyChange,
  onRefresh,
  isLoading = false
}: FilterBarProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedCasinoName = casinos.find(c => c.id === selectedCasino)?.name || 'All Casinos';

  return (
    <div className={cn(
      "flex items-center space-x-2 pb-4",
      mounted && "animate-fade-in"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-casinoGreen hover:bg-casinoGreen/90 text-white border-none"
            disabled={isLoading}
          >
            <Filter className="mr-2 h-4 w-4" />
            {selectedCasinoName}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {casinos.map((casino) => (
            <DropdownMenuItem
              key={casino.id}
              onClick={() => onCasinoChange(casino.id)}
              className={cn(
                "cursor-pointer",
                selectedCasino === casino.id && "bg-casinoGreen/10 font-medium"
              )}
            >
              {casino.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-casinoPurple hover:bg-casinoPurple/90 text-white border-none"
            disabled={isLoading}
          >
            {selectedCurrency}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency}
              onClick={() => onCurrencyChange(currency)}
              className={cn(
                "cursor-pointer",
                selectedCurrency === currency && "bg-casinoPurple/10 font-medium"
              )}
            >
              {currency}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        onClick={onRefresh}
        disabled={isLoading}
        className="bg-casinoBlue hover:bg-casinoBlue/90 text-white border-none"
      >
        GO
      </Button>
    </div>
  );
};

export default FilterBar;
