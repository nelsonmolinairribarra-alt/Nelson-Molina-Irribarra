
import React, { useState } from 'react';
import { CalendarType, CalendarItem, UserRole, Official } from '../types';

interface CalendarManagerProps {
  items: CalendarItem[];
  officials: Official[];
  userRole: UserRole;
  onAddItem: (item: Omit<CalendarItem, 'id'>) => void;
}

const CalendarManager: React.FC<CalendarManagerProps> = ({ items, officials, userRole, onAddItem }) => {
  const [activeTab, setActiveTab] = useState<CalendarType>('jueves');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    person: '',
    place: ''
  });

  const tabs: { id: CalendarType; label: string }[] = [
    { id: 'jueves', label: 'Predicas Jueves' },
    { id: 'domingo', label: 'Predicas Domingo' },
    { id: 'estudios', label: 'Estudios Bíblicos' },
    { id: 'visitas_hermanos', label: 'Visitas Hermanos' },
    { id: 'visitas_purulon', label: 'Visitas Purulón' },
    { id: 'pastoral_zonal', label: 'Pastoral Zonal' },
    { id: 'local', label: 'Eventos Local' },
    { id: 'nacional', label: 'Nacional' },
    { id: 'santa_cena', label: 'Santa Cena' }
  ];

  const filteredItems = items.filter(item => {
    if (item.type !== activeTab) return false;
    const personMatch = filters.person === '' || 
      (item.preacher === filters.person) ||
      (item.coordinator === filters.person) ||
      (item.speaker === filters.person) ||
      (item.responsibleOfficer === filters.person);
    
    const placeMatch = filters.place === '' || 
      (item.place?.toLowerCase().includes(filters.place.toLowerCase())) ||
      (item.churchToVisit?.toLowerCase().includes(filters.place.toLowerCase()));

    return personMatch && placeMatch;
  });

  const canEdit = userRole === UserRole.ADMIN_PRIMARY || userRole === UserRole.ADMIN_SECONDARY;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: any = { type: activeTab };
    formData.forEach((value, key) => {
      newItem[key] = value;
    });
    onAddItem(newItem);
    setShowForm(false);
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatNotificationDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border min-h-[600px] flex flex-col">
      <div className="flex overflow-x-auto border-b bg-slate-50/50 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <select 
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-800 text-white min-w-[180px]"
              value={filters.person}
              onChange={(e) => setFilters({ ...filters, person: e.target.value })}
            >
              <option value="">Filtrar por Oficial...</option>
              {officials.map(off => (
                <option key={off.id} value={off.name}>{off.name}</option>
              ))}
            </select>
             <input 
              type="text" 
              placeholder="Filtrar por lugar..." 
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-800 text-white placeholder-slate-400"
              value={filters.place}
              onChange={(e) => setFilters({ ...filters, place: e.target.value })}
            />
          </div>
          
          {canEdit && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              {showForm ? 'Cancelar' : 'Agregar Registro'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 rounded-xl border border-dashed border-indigo-200 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Fecha del Evento</label>
                <input required name="date" type="date" className="w-full border rounded-lg p-2 text-sm" />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Hora</label>
                <input name="time" type="time" className="w-full border rounded-lg p-2 text-sm" />
              </div>

              {(activeTab === 'jueves' || activeTab === 'domingo') && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Predicador</label>
                    <select required name="preacher" className="w-full border rounded-lg p-2 text-sm bg-white">
                      <option value="">Seleccione...</option>
                      {officials.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Coordinador</label>
                    <select required name="coordinator" className="w-full border rounded-lg p-2 text-sm bg-white">
                      <option value="">Seleccione...</option>
                      {officials.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {(activeTab === 'visitas_hermanos' || activeTab === 'visitas_purulon' || activeTab === 'pastoral_zonal') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Oficial Responsable</label>
                  <select required name="responsibleOfficer" className="w-full border rounded-lg p-2 text-sm bg-white">
                    <option value="">Seleccione...</option>
                    {officials.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>
              )}

              {activeTab === 'visitas_hermanos' && (
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-slate-500">Hermano a visitar</label>
                   <input required name="brotherToVisit" type="text" className="w-full border rounded-lg p-2 text-sm" />
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Lugar / Observación / Tema</label>
                <input name="place" type="text" className="w-full border rounded-lg p-2 text-sm" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Guardar Registro</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">No se encontraron registros.</p>
            </div>
          ) : filteredItems.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(item => (
            <div key={item.id} className="p-6 border rounded-2xl hover:shadow-md transition-all bg-white border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-bold capitalize">
                  {formatShortDate(item.date)}
                </div>
                {item.time && (
                  <div className="text-slate-600 text-sm font-medium">
                    {item.time} hrs
                  </div>
                )}
              </div>
              
              <div className="space-y-2 py-2">
                {item.preacher && (
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-400">Predicador:</span> <span className="font-semibold">{item.preacher}</span>
                  </p>
                )}
                {item.coordinator && (
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-400">Coordinador:</span> <span className="font-semibold">{item.coordinator}</span>
                  </p>
                )}
                {item.responsibleOfficer && (
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-400">Responsable:</span> <span className="font-semibold">{item.responsibleOfficer}</span>
                  </p>
                )}
                {item.brotherToVisit && (
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-400">Hermano:</span> <span className="font-semibold">{item.brotherToVisit}</span>
                  </p>
                )}
                {item.place && (
                  <p className="text-sm text-slate-700">
                    <span className="text-slate-400">Detalle:</span> <span className="font-semibold">{item.place}</span>
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => alert(`Notificación programada para el: ${formatNotificationDate(item.date)}`)}
                    className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-tight hover:text-indigo-800 transition"
                  >
                    🔔 <span className="opacity-90">Activar Notificación</span>
                  </button>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Aviso Programado</p>
                    <p className="text-[12px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 mt-0.5">
                      {formatNotificationDate(item.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarManager;
