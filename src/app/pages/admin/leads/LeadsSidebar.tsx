import { useState, useEffect } from 'react';
import { LeadStatus } from '../../../components/popups/types';
import { supabaseAPI } from '../../../data/supabase';

export function LeadsSidebar() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    in_progress: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await supabaseAPI.getAllLeads();

      const statsData = (data || []).reduce((acc: any, item: any) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, { new: 0, contacted: 0, in_progress: 0, closed: 0 } as Record<LeadStatus, number>);

      const total = (data || []).length;
      setStats({ ...statsData, total });
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Estadísticas</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total leads</span>
          <span className="font-bold text-blue-600">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Nuevos</span>
          <span className="font-bold text-blue-600">{stats.new}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Contactados</span>
          <span className="font-bold text-yellow-600">{stats.contacted}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">En progreso</span>
          <span className="font-bold text-purple-600">{stats.in_progress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Cerrados</span>
          <span className="font-bold text-green-600">{stats.closed}</span>
        </div>
      </div>
    </div>
  );
}