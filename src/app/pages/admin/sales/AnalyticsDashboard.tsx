import { useEffect, useState } from 'react';
import { supabaseAPI } from '../../../data/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Loader2, Users, ShoppingCart, CreditCard, CheckCircle, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function AnalyticsDashboard() {
  const [funnelData, setFunnelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const end = new Date();
      let start = new Date();
      if (timeRange === '7') start = subDays(end, 7);
      if (timeRange === '30') start = subDays(end, 30);
      if (timeRange === '90') start = subDays(end, 90);
      if (timeRange === 'all') start = new Date(2020, 0, 1);

      const stats = await supabaseAPI.getFunnelStats(start.toISOString(), end.toISOString());
      console.log('📊 [Analytics] Funnel Stats received:', stats);
      setFunnelData(stats);
    } catch (error) {
      console.error('Error loading analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversionRate = (step: number, initial: number) => {
    if (!initial || initial === 0) return 0;
    return ((step / initial) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C5D15]" />
      </div>
    );
  }

  const chartData = [
    { name: 'Visitantes', count: Number(funnelData?.total_unique_visitors || 0), fill: '#3b82f6' },
    { name: 'Añaden al Carrito', count: Number(funnelData?.total_cart_additions || 0), fill: '#eab308' },
    { name: 'Inician Checkout', count: Number(funnelData?.total_checkouts_started || 0), fill: '#f97316' },
    { name: 'Cierran Venta', count: Number(funnelData?.total_sales_closed || 0), fill: '#22c55e' }
  ];

  return (
    <div className="p-8 min-h-screen bg-transparent">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1C5D15] mb-2 uppercase italic tracking-tighter">
            Motor de Crecimiento
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Trazabilidad Inquebrantable de Embudos Comerciales
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <Calendar size={14} className="text-gray-400 ml-2" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-transparent border-none text-xs font-bold focus:ring-0 focus:outline-none pr-4 text-[#1C5D15] cursor-pointer"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
            <option value="all">Histórico completo</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-blue-500 relative overflow-hidden group">
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Visitantes Únicos</p>
          <h3 className="text-4xl font-black text-blue-600 relative z-10">{funnelData?.total_unique_visitors || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2 font-bold relative z-10">Sesiones duran {funnelData?.avg_session_duration || 0}s promedio</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-yellow-500 relative overflow-hidden group">
          <ShoppingCart className="absolute -right-4 -bottom-4 w-24 h-24 text-yellow-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Add to Carts</p>
          <h3 className="text-4xl font-black text-yellow-600 relative z-10">{funnelData?.total_cart_additions || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2 font-bold relative z-10">
            {calculateConversionRate(funnelData?.total_cart_additions, funnelData?.total_unique_visitors)}% conversión
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-orange-500 relative overflow-hidden group">
          <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-orange-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Checkouts Iniciados</p>
          <h3 className="text-4xl font-black text-orange-600 relative z-10">{funnelData?.total_checkouts_started || 0}</h3>
          <p className="text-[10px] text-gray-400 mt-2 font-bold relative z-10">
            {calculateConversionRate(funnelData?.total_checkouts_started, funnelData?.total_cart_additions)}% conversión de carrito
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-b-4 border-green-500 relative overflow-hidden group">
          <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-green-50 opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Ventas Cerradas</p>
          <h3 className="text-4xl font-black text-green-600 relative z-10">{funnelData?.total_sales_closed || 0}</h3>
          <p className="text-[10px] text-green-600 mt-2 font-black uppercase tracking-widest relative z-10">
            {calculateConversionRate(funnelData?.total_sales_closed, funnelData?.total_unique_visitors)}% End To End
          </p>
        </div>
      </div>

      {/* Funnel Graph */}
      <div className="bg-white p-8 rounded-[2rem] shadow-xl">
        <h2 className="text-xl font-bold text-[#1C5D15] mb-8">Comportamiento del Embudo</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                barSize={60}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
