import { useState, useEffect } from 'react';
import { LeadStatus } from '../../../components/popups/types';
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
  ip_address?: string;
}

export function LeadDetail({ leadId }: { leadId: number }) {
  const [lead, setLead] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LeadStatus>('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await supabaseAPI.getLeadById(String(leadId));
      setLead(data as LeadItem);
      setStatus(data.status);
      setNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message || 'Error al cargar el lead');
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async () => {
    try {
      await supabaseAPI.updateLead(String(leadId), {
        status,
        notes: notes || null
      });
      // Recargar el lead actualizado
      fetchLead();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el lead');
    }
  };

  if (loading) return <div>Cargando lead...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lead) return <div>Lead no encontrado</div>;

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      checkout_started: 'bg-orange-100 text-orange-800',
      closed: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Detalle del Lead</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Información del contacto</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Nombre:</span> {lead.name} {lead.last_name}
              </div>
              <div>
                <span className="text-gray-600">Email:</span> {lead.email}
              </div>
              <div>
                <span className="text-gray-600">Teléfono:</span> {lead.phone || 'No proporcionado'}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Detalles del lead</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Tipo:</span> {lead.lead_type}
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Página:</span> {lead.page_url}
              </div>
              <div>
                <span className="text-gray-600">Fecha:</span> {new Date(lead.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {lead.message && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Mensaje</h3>
            <p className="text-gray-700">{lead.message}</p>
          </div>
        )}
      </div>

      {/* Actualizar estado */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Actualizar estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="new">Nuevo</option>
            <option value="contacted">Contactado</option>
            <option value="in_progress">En progreso</option>
            <option value="closed">Cerrado</option>
          </select>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar notas sobre este lead..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={updateLead}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Actualizar lead
        </button>
      </div>

      {/* Información técnica */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Información técnica</h3>
        <div className="space-y-2">
          <div>
            <span className="text-gray-600">IP:</span> {lead.ip_address}
          </div>
          <div>
            <span className="text-gray-600">Navegador:</span> {lead.user_agent}
          </div>
          <div>
            <span className="text-gray-600">Referrer:</span> {lead.referrer || 'Directo'}
          </div>
        </div>
      </div>
    </div>
  );
}
