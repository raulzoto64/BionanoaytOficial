import { supabaseAPI } from "../../../data/supabase";
import { CreditCard, User, Mail, Phone, MapPin, Search, Loader2, Calendar, Eye, Trash2, Filter, ShoppingBag } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export function CheckoutLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await supabaseAPI.getAllLeads();
      // Filtrar por tipos de checkout en el cliente
      const checkoutTypes = ['Checkout Lead', 'Cart Checkout Progress', 'Cart Progress'];
      const filtered = (data || []).filter((l: any) => checkoutTypes.includes(l.lead_type));
      setLeads(filtered);
    } catch (err) {
      toast.error("Error al cargar leads de pago");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(l => 
    (l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     l.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 min-h-screen bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads de Pago</h1>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Buscar por cliente/email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white border-none shadow-sm rounded-xl w-64 font-bold text-xs h-10"
              />
           </div>
           <Button onClick={loadLeads} disabled={loading} className="rounded-xl h-10 px-6 bg-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] font-black uppercase tracking-widest text-[9px]">
             {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Sincronizar"}
           </Button>
        </div>
      </div>

      {/* Tabla Pro */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Intención</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <ShoppingBag size={48} className="mb-4" />
                      <p className="font-black uppercase tracking-tighter text-2xl italic">Sin prospectos registrados</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1C5D15] rounded-xl flex items-center justify-center text-[#19FF00] shadow-sm">
                        <User size={16} />
                      </div>
                      <span className="text-xs font-black text-[#1C5D15] uppercase tracking-tight">{lead.name || 'Sin Nombre'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#629960]">
                        <Mail size={12} className="text-[#19FF00]" /> {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                          <Phone size={12} /> {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#1C5D15]/60 italic">
                      <MapPin size={12} /> {lead.country ? `${lead.city}, ${lead.country}` : 'Pendiente'}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-black text-[#1C5D15] italic relative group/tooltip">
                    <span className="cursor-help transition-all group-hover/tooltip:text-[#19FF00]">
                      ${lead.metadata?.cart_total?.toLocaleString() || '0'} <small className="text-[8px] opacity-40 uppercase not-italic">COP</small>
                    </span>

                    {/* Tooltip Pro */}
                    {lead.metadata?.items_list && (
                      <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#1C5D15] text-white p-4 rounded-2xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none not-italic">
                         <h4 className="text-[9px] font-black uppercase tracking-widest text-[#19FF00] mb-3 border-b border-white/10 pb-2">Artículos en Proceso</h4>
                         <ul className="space-y-2">
                            {lead.metadata.items_list.map((item: any, idx: number) => (
                               <li key={idx} className="text-[10px] flex justify-between gap-4">
                                  <span className="font-bold truncate opacity-80">{item.name}</span>
                                  <span className="font-black text-[#19FF00] whitespace-nowrap">{item.quantity} un.</span>
                               </li>
                            ))}
                         </ul>
                         <div className="absolute top-full left-4 w-2 h-2 bg-[#1C5D15] rotate-45 -mt-1"></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(lead.created_at), "eeee", { locale: es })}</span>
                      <span className="text-xs font-bold text-[#1C5D15]">{format(new Date(lead.created_at), "d 'de' MMMM", { locale: es })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button 
                      onClick={() => setSelectedLead(lead)}
                      className="bg-transparent text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white rounded-xl h-9 w-9 p-0 transition-all border border-[#1C5D15]/10"
                    >
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lateral Detalle Checkout */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
           <div className="w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <header className="p-8 border-b bg-[#1C5D15] text-white flex items-center justify-between sticky top-0 z-20">
                 <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Detalle de Lead</h2>
                    <p className="text-[10px] font-bold text-[#19FF00] uppercase tracking-widest">Checkout ID: {selectedLead.id}</p>
                 </div>
                 <button onClick={() => setSelectedLead(null)} className="text-white/40 hover:text-white transition-colors text-2xl">×</button>
              </header>

              <div className="p-8 space-y-10">
                 <section>
                    <h3 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-[#19FF00] rounded-full"></div> Perfil del Prospecto
                    </h3>
                    <div className="space-y-6">
                       <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1C5D15] shadow-sm"><User size={20}/></div>
                          <div>
                             <p className="text-sm font-black text-[#1C5D15] uppercase tracking-tight">{selectedLead.name || 'Sin Nombre Registrado'}</p>
                             <p className="text-xs font-bold text-[#629960]">{selectedLead.email}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Teléfono</p>
                             <p className="text-xs font-bold text-[#1C5D15]">{selectedLead.phone || '-'}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Ubicación</p>
                             <p className="text-xs font-bold text-[#1C5D15]">{selectedLead.country || '-'}</p>
                          </div>
                       </div>
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Dirección / Distrito</p>
                          <p className="text-xs font-bold text-[#1C5D15]">{selectedLead.district || 'No especificada'}</p>
                       </div>
                    </div>
                 </section>

                 <section className="bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100">
                     <div className="flex justify-between items-center mb-6">
                       <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Intención de Negocio</h3>
                       <span className="text-[9px] font-black bg-orange-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Pago Iniciado</span>
                     </div>
                     <div className="flex justify-between items-end mb-6 border-b border-orange-200/50 pb-6">
                        <div>
                           <p className="text-3xl font-black text-[#1C5D15] tracking-tighter italic">${selectedLead.metadata?.cart_total?.toLocaleString() || '0'}</p>
                           <p className="text-[10px] font-black text-[#629960] uppercase mt-1">Total estimado en carrito</p>
                        </div>
                        <CreditCard size={32} className="text-orange-200" />
                     </div>

                     {/* Agregado: Lista de productos seleccionados en el modal */}
                     {selectedLead.metadata?.items_list && selectedLead.metadata.items_list.length > 0 && (
                        <div className="space-y-3">
                           <h4 className="text-[9px] font-black uppercase tracking-widest text-[#1C5D15] mb-2 opacity-60">Productos Seleccionados:</h4>
                           {selectedLead.metadata.items_list.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                 <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-gray-50 flex flex-col items-center justify-center rounded-lg text-orange-400">
                                      <ShoppingBag size={14} />
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-[#1C5D15] uppercase tracking-tight">{item.name}</p>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase">{item.packaging}</p>
                                   </div>
                                 </div>
                                 <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-lg">x{item.quantity}</span>
                              </div>
                           ))}
                        </div>
                     )}
                  </section>

                 <section>
                    <h3 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest mb-6">Metadatos de Seguimiento</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                          <span className="text-gray-400 italic">Origen:</span>
                          <span className="font-bold text-[#1C5D15] uppercase">{selectedLead.lead_type || 'Checkout'}</span>
                       </div>
                       <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                          <span className="text-gray-400 italic">URL de Salida:</span>
                          <span className="font-bold text-[#629960] truncate max-w-[200px]" title={selectedLead.page_url}>{selectedLead.page_url || 'No registrada'}</span>
                       </div>
                       <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                          <span className="text-gray-400 italic">Fecha de Inicio:</span>
                          <span className="font-bold text-[#1C5D15]">{format(new Date(selectedLead.created_at), "yyyy-MM-dd HH:mm")}</span>
                       </div>
                    </div>
                 </section>

                 <Button className="w-full bg-[#1C5D15] text-[#19FF00] hover:bg-[#19FF00] hover:text-[#1C5D15] py-7 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#1C5D15]/20">
                    Sincronizar con CRM Externo
                 </Button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
