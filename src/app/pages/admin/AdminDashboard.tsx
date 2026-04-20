import { useState, useEffect } from 'react';
import { Package, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { supabaseAPI } from '../../data/supabase';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    totalCategories: 4,
  });

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    const products = await supabaseAPI.getProducts();
    setStats({
      totalProducts: products.length,
      activeProducts: products.filter((p: { status: string; }) => p.status === 'active').length,
      draftProducts: products.filter((p: { status: string; }) => p.status === 'draft').length,
      totalCategories: 4,
    });
  };

  const statCards = [
    { title: 'Total Productos', value: stats.totalProducts, icon: Package, color: 'bg-[#1C5D15]' },
    { title: 'Productos Activos', value: stats.activeProducts, icon: TrendingUp, color: 'bg-[#629960]' },
    { title: 'Borradores', value: stats.draftProducts, icon: FileText, color: 'bg-[#19FF00]' },
    { title: 'Categorías', value: stats.totalCategories, icon: DollarSign, color: 'bg-[#1C5D15]' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1C5D15] mb-2">Dashboard</h2>
        <p className="text-[#629960]">Resumen general del sistema</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white border-2 border-[#629960]/20">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#1C5D15] mb-1">{stat.value}</h3>
              <p className="text-[#629960]">{stat.title}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-white border-2 border-[#629960]/20">
        <h3 className="text-xl text-[#1C5D15] mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-[#629960]/10">
            <div className="w-10 h-10 bg-[#19FF00]/20 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-[#1C5D15]" />
            </div>
            <div className="flex-1">
              <p className="text-[#1C5D15]">Producto actualizado: <strong>Bionanoaxus (BNX)</strong></p>
              <p className="text-sm text-[#629960]">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-[#629960]/10">
            <div className="w-10 h-10 bg-[#19FF00]/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#1C5D15]" />
            </div>
            <div className="flex-1">
              <p className="text-[#1C5D15]">Precios actualizados para <strong>Z-Klean</strong></p>
              <p className="text-sm text-[#629960]">Hace 5 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#19FF00]/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#1C5D15]" />
            </div>
            <div className="flex-1">
              <p className="text-[#1C5D15]">Contenido de Home actualizado</p>
              <p className="text-sm text-[#629960]">Ayer</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
