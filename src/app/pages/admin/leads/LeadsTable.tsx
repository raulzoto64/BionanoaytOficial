import { useState, useEffect } from 'react';
import { LeadStatus } from '../../../components/popups/types';
import { supabase } from '../../../data/supabase';

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
  is_anonymous: boolean;
  user_id?: string;
  visitor_id?: string;
}

export function LeadsTable() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ DEBOUNCE: Esperar 500ms despues de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const fetchLeads = async () => {
    console.log('🔄 [DEBUG] Fetching leads...');
    try {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        console.log('✅ [DEBUG] Datos recibidos de Supabase en fetchLeads:', data);
        setLeads(data as LeadItem[]);
      }
    } catch (err) {
      setError("Error al cargar los leads");
    }
  };

  const updateLeadStatus = async (id: number, newStatus: LeadStatus) => {
    console.log('🔵 [DEBUG] Iniciando actualizacion estado - Lead ID:', id, 'Nuevo estado:', newStatus);
    const { data: { user, session } } = await supabase.auth.getSession();
    console.log('🔵 [DEBUG] Sesión Supabase antes de UPDATE:', { user, session });

    try {
      setUpdatingId(id);
      
      const { data, error, status, statusText } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      console.log('🟢 [DEBUG] Respuesta Supabase: status', status, statusText);
      console.log('🟢 [DEBUG] Datos devueltos:', data);

      if (error) {
        console.log('🔴 [DEBUG] ERROR SUPABASE:', error.code, error.message, error.details);
        throw error;
      }
      
      console.log('✅ [DEBUG] Actualizado exitosamente en BD');
      
      setLeads(prev => {
        const nuevos = prev.map(lead => 
          lead.id === id ? { ...lead, status: newStatus } : lead
        );
        console.log('✅ [DEBUG] Estado local actualizado:', nuevos.find(l => l.id === id));
        return nuevos;
      });
      
    } catch (err: any) {
      console.error('❌ [DEBUG] Error general actualizando:', err);
      alert('Error: ' + err.message);
    } finally {
      setUpdatingId(null);
      console.log('⏹️ [DEBUG] Proceso actualizacion terminado');
    }
  };

  const deleteLead = async (id: number) => {
    console.log('🔴 [DEBUG] Iniciando eliminacion - Lead ID:', id);
    const { data: { user, session } } = await supabase.auth.getSession();
    console.log('🔴 [DEBUG] Sesión Supabase antes de DELETE:', { user, session });

    if (!confirm('¿Estas seguro de eliminar este lead? Esta accion no se puede deshacer.')) {
      console.log('⚠️ [DEBUG] Eliminacion cancelada por usuario');
      return;
    }

    try {
      const { data, error, status, statusText } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .select();

      console.log('🟢 [DEBUG] Respuesta Supabase DELETE: status', status, statusText);
      console.log('🟢 [DEBUG] Elemento eliminado:', data);

      if (error) {
        console.log('🔴 [DEBUG] ERROR SUPABASE DELETE:', error.code, error.message, error.details);
        throw error;
      }
      
      console.log('✅ [DEBUG] Eliminado exitosamente en BD');
      
      setLeads(prev => {
        const nuevos = prev.filter(lead => lead.id !== id);
        console.log('✅ [DEBUG] Eliminado de estado local, quedan:', nuevos.length);
        return nuevos;
      });
      
      setShowModal(false);
      
    } catch (err: any) {
      console.error('❌ [DEBUG] Error general eliminando:', err);
      alert('Error: ' + err.message);
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

  const getLeadTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'exit-intent': 'Salida',
      'quote': 'Cotización',
      'contact': 'Contacto',
      'popup': 'Popup',
      'form': 'Formulario'
    };
    return labels[type] || type;
  };

  // Calcular estadisticas
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    inProgress: leads.filter(l => l.status === 'in_progress').length,
    closed: leads.filter(l => l.status === 'closed').length,
  };

  if (loading) return <div className="p-6 text-center">Cargando leads...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Leads</h1>
      </div>

      {/* Panel Estadisticas Horizontal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Nuevos</div>
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Contactados</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">En Progreso</div>
          <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Cerrados</div>
          <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="contacted">Contactados</option>
              <option value="in_progress">En progreso</option>
              <option value="closed">Cerrados</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-500">{lead.id}</td>
                <td className="px-3 py-3">
                  <div className="font-medium text-gray-900">{lead.name} {lead.last_name}</div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{lead.email}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-900">{lead.phone || '-'}</td>
                <td className="px-3 py-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{getLeadTypeLabel(lead.lead_type)}</span>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    disabled={updatingId === lead.id}
                    className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer ${getStatusColor(lead.status)}`}
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  {lead.is_anonymous ? (
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">Visitante</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Registrado</span>
                  )}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500 font-mono text-xs">{lead.ip_address || '-'}</td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()} <br/>
                  <span className="text-xs">{new Date(lead.created_at).toLocaleTimeString()}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                     <button 
                       onClick={() => {
                         setSelectedLead(lead);
                         setShowModal(true);
                       }}
                       className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                     >Ver</button>
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron leads con los filtros seleccionados
        </div>
      )}

      {/* Modal Detalle Lead */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-green-900/30 flex items-center justify-center z-50 p-4 backdrop-blur-[4px]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Detalle del Lead #{selectedLead.id}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >×</button>
            </div>

            {/* Contenido Scrollable */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Información del contacto</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{selectedLead.name} {selectedLead.last_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedLead.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium">{selectedLead.phone || 'No proporcionado'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{getLeadTypeLabel(selectedLead.lead_type)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Estado:</span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => {
                          updateLeadStatus(selectedLead.id, e.target.value as LeadStatus);
                          setSelectedLead({...selectedLead, status: e.target.value as LeadStatus});
                        }}
                        className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer ${getStatusColor(selectedLead.status)}`}
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="closed">Cerrado</option>
                      </select>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Usuario:</span>
                      <span className="font-medium">
                        {selectedLead.is_anonymous ? (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">Visitante</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Registrado</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Información Técnica</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">IP:</span>
                      <span className="font-mono text-xs">{selectedLead.ip_address || '-'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Página:</span>
                      <span className="font-medium text-xs truncate max-w-[200px]">{selectedLead.page_url}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{new Date(selectedLead.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Referrer:</span>
                      <span className="font-medium text-xs">{selectedLead.referrer || 'Directo'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Visitor ID:</span>
                      <span className="font-mono text-xs">{selectedLead.visitor_id || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLead.message && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Mensaje</h3>
                  <div className="bg-gray-50 rounded p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                </div>
              )}

              {selectedLead.user_agent && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Navegador</h3>
                  <div className="bg-gray-50 rounded p-4">
                    <p className="text-gray-700 text-xs break-all">{selectedLead.user_agent}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-between">
              <button 
                onClick={() => {
                  deleteLead(selectedLead.id);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Eliminar Lead
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
