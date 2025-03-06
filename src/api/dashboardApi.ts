
import { toast } from "sonner";

// Types for our dashboard data
export interface DashboardSummary {
  deposits: {
    total: number;
    psp: number;
    cashCrypto: number;
    depositors: number;
    activeUsers: number;
    signups: number;
    fd: number;
  };
  revenue: {
    ggrRm: number;
    ggr: number;
    ggrRb: number;
    ggrPb: number;
    ggrTot: number;
  };
  payouts: {
    rmApproved: number;
    rbApproved: number;
    totApproved: number;
    pendingRm: number;
    pendingRb: number;
    pendingTot: number;
  };
  bonus: {
    depositedBonus: number;
    users: number;
    count: number;
    averageValue: number;
  };
  players: Player[];
}

export interface Player {
  email: string;
  brand: string;
  deposits: number;
  status: 'online' | 'offline';
}

export interface CasinoOption {
  id: string;
  name: string;
}

// Simulate API call delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Casino options
export async function fetchCasinoOptions(): Promise<CasinoOption[]> {
  try {
    // Simulate API call
    await sleep(600);
    return [
      { id: 'all', name: 'All Casinos' },
      { id: 'vac', name: 'VAC' },
      { id: 'spinz', name: 'Spinz' },
      { id: 'lucky', name: 'Lucky Days' }
    ];
  } catch (error) {
    console.error('Failed to fetch casino options:', error);
    toast.error('Failed to load casino options');
    return [{ id: 'all', name: 'All Casinos' }];
  }
}

// Currencies
export async function fetchCurrencies(): Promise<string[]> {
  try {
    // Simulate API call
    await sleep(500);
    return ['USD', 'EUR', 'GBP', 'CAD'];
  } catch (error) {
    console.error('Failed to fetch currencies:', error);
    toast.error('Failed to load currencies');
    return ['USD'];
  }
}

// Dashboard data
export async function fetchDashboardData(
  casino: string = 'all',
  currency: string = 'USD',
  timeframe: string = 'day'
): Promise<DashboardSummary> {
  try {
    // Simulate API call
    await sleep(800);
    
    // Mock data adjusted based on filters
    const multiplier = casino === 'all' ? 1 : Math.random() * 0.5 + 0.2;
    const currencyFactor = currency === 'USD' ? 1 : currency === 'EUR' ? 0.9 : 1.2;
    
    // Generate realistic mock data
    return {
      deposits: {
        total: Math.floor(10685 * multiplier * currencyFactor),
        psp: Math.floor(8690 * multiplier * currencyFactor),
        cashCrypto: Math.floor(1995 * multiplier * currencyFactor),
        depositors: Math.floor(31 * multiplier),
        activeUsers: Math.floor(261 * multiplier),
        signups: Math.floor(58 * multiplier),
        fd: casino === 'all' ? 0 : Math.floor(5 * multiplier)
      },
      revenue: {
        ggrRm: Math.floor(7028 * multiplier * currencyFactor),
        ggr: Math.floor(22406 * multiplier * currencyFactor),
        ggrRb: Math.floor(1288 * multiplier * currencyFactor),
        ggrPb: Math.floor(3666 * multiplier * currencyFactor),
        ggrTot: Math.floor(11982 * multiplier * currencyFactor)
      },
      payouts: {
        rmApproved: 0,
        rbApproved: 0,
        totApproved: 0,
        pendingRm: Math.floor(10375 * multiplier * currencyFactor),
        pendingRb: Math.floor(3620 * multiplier * currencyFactor),
        pendingTot: Math.floor(13995 * multiplier * currencyFactor)
      },
      bonus: {
        depositedBonus: Math.floor(7006 * multiplier * currencyFactor),
        users: Math.floor(100 * multiplier),
        count: Math.floor(156 * multiplier),
        averageValue: Math.floor(45 * currencyFactor)
      },
      players: generateMockPlayers(casino, 10)
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    toast.error('Failed to load dashboard data');
    throw error;
  }
}

// Helper to generate random player data
function generateMockPlayers(casinoFilter: string, count: number): Player[] {
  const brands = casinoFilter === 'all' 
    ? ['VAC', 'Spinz', 'Lucky Days'] 
    : [casinoFilter.toUpperCase()];
  
  const mockEmails = [
    'alwasil@gmail.com', 'fahad123@mail.com', 'salarkw89@outlook.com',
    'mbaizat35@yahoo.com', 'zeus7715@gmail.com', 'naser79q8@hotmail.com',
    'mrcrazy_h77@gmail.com', 'amina1980@mail.com', 'jason2k@outlook.com',
    'danielle444@gmail.com', 'sameh_89@yahoo.com', 'khalidalr@mail.com'
  ];
  
  return Array.from({ length: count }).map((_, index) => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    return {
      email: mockEmails[index % mockEmails.length],
      brand,
      deposits: Math.floor(Math.random() * 2000) + 50,
      status: Math.random() > 0.3 ? 'online' : 'offline'
    };
  });
}
