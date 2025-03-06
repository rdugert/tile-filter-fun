
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterBar from "@/components/dashboard/FilterBar";
import StatCard from "@/components/dashboard/StatCard";
import PlayersList from "@/components/dashboard/PlayersList";
import { 
  CasinoOption, 
  DashboardSummary, 
  Player, 
  fetchCasinoOptions, 
  fetchCurrencies, 
  fetchDashboardData 
} from "@/api/dashboardApi";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [casinos, setCasinos] = useState<CasinoOption[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCasino, setSelectedCasino] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<{
    deposits?: DashboardSummary['deposits'],
    revenue?: DashboardSummary['revenue'],
    payouts?: DashboardSummary['payouts'],
    bonus?: DashboardSummary['bonus']
  }>({});
  const [loadingMonthly, setLoadingMonthly] = useState<{
    deposits: boolean,
    revenue: boolean,
    payouts: boolean,
    bonus: boolean
  }>({
    deposits: false,
    revenue: false,
    payouts: false,
    bonus: false
  });

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch filter options
        const [casinoOptions, currencyOptions] = await Promise.all([
          fetchCasinoOptions(),
          fetchCurrencies()
        ]);
        
        setCasinos(casinoOptions);
        setCurrencies(currencyOptions);
        
        // Fetch dashboard data with default filters
        const data = await fetchDashboardData('all', 'USD', 'day');
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load initial dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Refresh dashboard data
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData(selectedCasino, selectedCurrency, 'day');
      setDashboardData(data);
      // Reset monthly data when filters change
      setMonthlyData({});
      toast.success("Dashboard data refreshed");
    } catch (error) {
      console.error("Failed to refresh dashboard data", error);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Handle casino filter change
  const handleCasinoChange = (casino: string) => {
    setSelectedCasino(casino);
    refreshData();
  };

  // Handle currency filter change
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    refreshData();
  };

  // Fetch monthly data for a specific card
  const fetchMonthlyDataForCard = async (cardType: 'deposits' | 'revenue' | 'payouts' | 'bonus') => {
    try {
      setLoadingMonthly(prev => ({ ...prev, [cardType]: true }));
      const data = await fetchDashboardData(selectedCasino, selectedCurrency, 'month');
      
      setMonthlyData(prev => ({
        ...prev,
        [cardType]: data[cardType]
      }));
    } catch (error) {
      console.error(`Failed to fetch monthly ${cardType} data:`, error);
      toast.error(`Failed to load monthly ${cardType} data`);
    } finally {
      setLoadingMonthly(prev => ({ ...prev, [cardType]: false }));
    }
  };

  // Get subtitle text based on filters
  const getSubtitleText = (base: string) => {
    const casino = casinos.find(c => c.id === selectedCasino)?.name || 'All Casinos';
    return `${casino}/${selectedCurrency}/Day`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Dashboard" 
      />
      
      <div className="dashboard-content">
        <FilterBar 
          casinos={casinos}
          currencies={currencies}
          selectedCasino={selectedCasino}
          selectedCurrency={selectedCurrency}
          onCasinoChange={handleCasinoChange}
          onCurrencyChange={handleCurrencyChange}
          onRefresh={refreshData}
          isLoading={loading}
        />
        
        <div className={`stat-grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'} gap-6`}>
          {/* Deposits Card */}
          <StatCard
            title="DEPOSITS"
            subtitle={getSubtitleText("Deposits")}
            loading={loading || loadingMonthly.deposits}
            icon={
              <img 
                src="/lovable-uploads/8be8d1a4-992a-4150-8d4b-ca76a352c53b.png" 
                alt="Deposits" 
                className="w-full h-full object-cover"
              />
            }
            stats={[
              { 
                value: dashboardData?.deposits.total.toLocaleString() || '0', 
                label: 'Total Deposits' 
              },
              { 
                value: dashboardData?.deposits.psp.toLocaleString() || '0', 
                label: 'PSP Deposits' 
              },
              { 
                value: dashboardData?.deposits.cashCrypto.toLocaleString() || '0', 
                label: 'Cash & Crypto' 
              },
              { 
                value: dashboardData?.deposits.depositors.toString() || '0', 
                label: 'Depositors' 
              },
              { 
                value: dashboardData?.deposits.activeUsers.toString() || '0', 
                label: 'Active Users' 
              },
              { 
                value: dashboardData?.deposits.signups.toString() || '0', 
                label: 'Signups' 
              },
              { 
                value: dashboardData?.deposits.fd.toString() || '0', 
                label: 'FD' 
              }
            ]}
            monthlyStats={monthlyData.deposits ? [
              { 
                value: monthlyData.deposits.total.toLocaleString() || '0', 
                label: 'Total Deposits' 
              },
              { 
                value: monthlyData.deposits.psp.toLocaleString() || '0', 
                label: 'PSP Deposits' 
              },
              { 
                value: monthlyData.deposits.cashCrypto.toLocaleString() || '0', 
                label: 'Cash & Crypto' 
              },
              { 
                value: monthlyData.deposits.depositors.toString() || '0', 
                label: 'Depositors' 
              },
              { 
                value: monthlyData.deposits.activeUsers.toString() || '0', 
                label: 'Active Users' 
              },
              { 
                value: monthlyData.deposits.signups.toString() || '0', 
                label: 'Signups' 
              },
              { 
                value: monthlyData.deposits.fd.toString() || '0', 
                label: 'FD' 
              }
            ] : undefined}
            onRequestMonthlyData={() => fetchMonthlyDataForCard('deposits')}
          />
          
          {/* Revenue Card */}
          <StatCard
            title="REVENUE"
            subtitle={getSubtitleText("Revenue")}
            loading={loading || loadingMonthly.revenue}
            icon={
              <img 
                src="/lovable-uploads/8be8d1a4-992a-4150-8d4b-ca76a352c53b.png" 
                alt="Revenue" 
                className="w-full h-full object-cover"
              />
            }
            stats={[
              { 
                value: dashboardData?.revenue.ggrRm.toLocaleString() || '0', 
                label: 'GGR RM' 
              },
              { 
                value: dashboardData?.revenue.ggr.toLocaleString() || '0', 
                label: 'GGR (RM-1)' 
              },
              { 
                value: dashboardData?.revenue.ggrRb.toLocaleString() || '0', 
                label: 'GGR RB' 
              },
              { 
                value: dashboardData?.revenue.ggrPb.toLocaleString() || '0', 
                label: 'GGR PB' 
              },
              { 
                value: dashboardData?.revenue.ggrTot.toLocaleString() || '0', 
                label: 'GGR TOT' 
              }
            ]}
            monthlyStats={monthlyData.revenue ? [
              { 
                value: monthlyData.revenue.ggrRm.toLocaleString() || '0', 
                label: 'GGR RM' 
              },
              { 
                value: monthlyData.revenue.ggr.toLocaleString() || '0', 
                label: 'GGR (RM-1)' 
              },
              { 
                value: monthlyData.revenue.ggrRb.toLocaleString() || '0', 
                label: 'GGR RB' 
              },
              { 
                value: monthlyData.revenue.ggrPb.toLocaleString() || '0', 
                label: 'GGR PB' 
              },
              { 
                value: monthlyData.revenue.ggrTot.toLocaleString() || '0', 
                label: 'GGR TOT' 
              }
            ] : undefined}
            onRequestMonthlyData={() => fetchMonthlyDataForCard('revenue')}
          />
          
          {/* Payouts Card */}
          <StatCard
            title="PAYOUTS"
            subtitle={getSubtitleText("Payouts")}
            loading={loading || loadingMonthly.payouts}
            icon={
              <img 
                src="/lovable-uploads/8be8d1a4-992a-4150-8d4b-ca76a352c53b.png" 
                alt="Payouts" 
                className="w-full h-full object-cover"
              />
            }
            stats={[
              { 
                value: dashboardData?.payouts.rmApproved.toString() || '0', 
                label: 'RM Approved' 
              },
              { 
                value: dashboardData?.payouts.rbApproved.toString() || '0', 
                label: 'RB Approved' 
              },
              { 
                value: dashboardData?.payouts.totApproved.toString() || '0', 
                label: 'Tot. Approved' 
              },
              { 
                value: dashboardData?.payouts.pendingRm.toLocaleString() || '0', 
                label: 'Pending RM' 
              },
              { 
                value: dashboardData?.payouts.pendingRb.toLocaleString() || '0', 
                label: 'Pending RB' 
              },
              { 
                value: dashboardData?.payouts.pendingTot.toLocaleString() || '0', 
                label: 'Pending Tot.' 
              }
            ]}
            monthlyStats={monthlyData.payouts ? [
              { 
                value: monthlyData.payouts.rmApproved.toString() || '0', 
                label: 'RM Approved' 
              },
              { 
                value: monthlyData.payouts.rbApproved.toString() || '0', 
                label: 'RB Approved' 
              },
              { 
                value: monthlyData.payouts.totApproved.toString() || '0', 
                label: 'Tot. Approved' 
              },
              { 
                value: monthlyData.payouts.pendingRm.toLocaleString() || '0', 
                label: 'Pending RM' 
              },
              { 
                value: monthlyData.payouts.pendingRb.toLocaleString() || '0', 
                label: 'Pending RB' 
              },
              { 
                value: monthlyData.payouts.pendingTot.toLocaleString() || '0', 
                label: 'Pending Tot.' 
              }
            ] : undefined}
            onRequestMonthlyData={() => fetchMonthlyDataForCard('payouts')}
          />
          
          {/* Bonus Card */}
          <StatCard
            title="BONUS"
            subtitle={getSubtitleText("Bonus")}
            loading={loading || loadingMonthly.bonus}
            icon={
              <img 
                src="/lovable-uploads/8be8d1a4-992a-4150-8d4b-ca76a352c53b.png" 
                alt="Bonus" 
                className="w-full h-full object-cover"
              />
            }
            stats={[
              { 
                value: dashboardData?.bonus.depositedBonus.toLocaleString() || '0', 
                label: 'Deposited Bonus', 
                className: "col-span-2 md:col-span-1" 
              },
              { 
                value: dashboardData?.bonus.users.toString() || '0', 
                label: 'Users' 
              },
              { 
                value: dashboardData?.bonus.count.toString() || '0', 
                label: 'B. Count' 
              },
              { 
                value: dashboardData?.bonus.averageValue.toString() || '0', 
                label: 'Average Val.' 
              }
            ]}
            monthlyStats={monthlyData.bonus ? [
              { 
                value: monthlyData.bonus.depositedBonus.toLocaleString() || '0', 
                label: 'Deposited Bonus', 
                className: "col-span-2 md:col-span-1" 
              },
              { 
                value: monthlyData.bonus.users.toString() || '0', 
                label: 'Users' 
              },
              { 
                value: monthlyData.bonus.count.toString() || '0', 
                label: 'B. Count' 
              },
              { 
                value: monthlyData.bonus.averageValue.toString() || '0', 
                label: 'Average Val.' 
              }
            ] : undefined}
            onRequestMonthlyData={() => fetchMonthlyDataForCard('bonus')}
          />
          
          {/* Players List Card - Full Width */}
          <div className={`${isMobile ? '' : 'col-span-1 md:col-span-2'}`}>
            <PlayersList
              title={`Players Live Results (${casinos.find(c => c.id === selectedCasino)?.name || 'All Casinos'})`}
              players={dashboardData?.players || []}
              loading={loading}
              onRefresh={refreshData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
