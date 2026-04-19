import { useState, useEffect } from 'react';
import { LeadData, LeadStatus } from '../../../components/popups/types';
import { supabaseAPI } from '../../../data/supabase';

interface LeadItem {
  id: number;
  name: string;
  last_name?: string;
  email: string;
  phone?: string;
  message?: string;
  lead_type: string;
  page_url: string;
  referrer?: string;
  user_agent?: string;
  status: LeadStatus;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function LeadsList() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await supabaseAPI.getAllLeads();
      setLeads(data as LeadItem[]);
    } catch (err) {
      console.error('Error al cargar leads:', err);
      setError('Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando leads...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Leads</h1>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Página</th>
              <th className="px-4 py-2 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{lead.name} {lead.last_name}</td>
                <td className="px-4 py-2">{lead.email}</td>
                <td className="px-4 py-2">{lead.lead_type}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{lead.page_url}</td>
                <td className="px-4 py-2 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusColor(status: LeadStatus) {
  const colors: Record<LeadStatus, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-purple-100 text-purple-800',
    closed: 'bg-green-100 text-green-800'
  };
  return colors[status];
}