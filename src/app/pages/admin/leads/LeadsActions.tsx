import { useState } from 'react';
import { LeadStatus } from '../../components/popups/types';
import { supabase } from '../../data/supabase';

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

interface LeadsActionsProps {
  lead: LeadItem;
  onUpdate: () => void;
}

export function LeadsActions({ lead, onUpdate }: LeadsActionsProps) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLead = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          status,
          notes: notes || null
        })
        .eq('id', lead.id);

      if (error) {
        setError(error.message);
      } else {
        onUpdate();
      }
    } catch (err) {
      setError('Error al actualizar el lead');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Acciones</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar notas sobre este lead..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={updateLead}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Actualizar'}
          </button>
          <button
            onClick={() => {
              // Aquí podrías agregar acciones como enviar email, etc.
              alert('Función no implementada aún');
            }}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Enviar email
          </button>
        </div>

        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}