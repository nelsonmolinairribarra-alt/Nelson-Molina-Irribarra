
import React, { useState } from 'react';
import { PrayerRequest, User, Official } from '../types';

interface PrayerWallProps {
  requests: PrayerRequest[];
  user: User;
  officials: Official[];
  onPost: (requesterName: string, text: string) => void;
}

const PrayerWall: React.FC<PrayerWallProps> = ({ requests, user, officials, onPost }) => {
  const [text, setText] = useState('');
  const [requester, setRequester] = useState(user.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !requester.trim()) {
      alert("Por favor complete el nombre del solicitante y el motivo.");
      return;
    }

    onPost(requester, text);
    
    // Simulación de notificación a oficiales
    const officialsCount = officials.length;
    const msg = officialsCount > 0 
      ? `¡Petición enviada! Se ha notificado a los ${officialsCount} oficiales registrados en la libreta.`
      : "¡Petición enviada! (No hay oficiales registrados para notificar aún).";
    
    alert(msg);
    
    setText('');
    // Mantenemos el nombre del solicitante si es el mismo usuario, o lo reseteamos según preferencia
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-500">🙏</span> Peticiones de Oración
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-1 block ml-1">Nombre del Hermano que solicita</label>
            <input
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="Nombre del hermano..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 mb-1 block ml-1">Motivo de Oración</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe el motivo aquí..."
              className="w-full border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 text-sm md:text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Enviar y Notificar a Oficiales</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">({officials.length})</span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Muro de Oración</h3>
        {requests.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl border text-slate-400">
            No hay peticiones aún. Sé el primero en pedir oración.
          </div>
        ) : (
          requests.sort((a,b) => b.timestamp - a.timestamp).map(req => (
            <div key={req.id} className="bg-white p-5 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                    {req.requesterName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-none">
                      Petición de: <span className="text-indigo-600">{req.requesterName}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {new Date(req.timestamp).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
                {req.userName !== req.requesterName && (
                  <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium italic">
                    Publicado por: {req.userName}
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {req.request}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerWall;
