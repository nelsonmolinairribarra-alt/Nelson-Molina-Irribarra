
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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !requester.trim()) {
      alert("Por favor complete el nombre del solicitante y el motivo.");
      return;
    }

    onPost(requester, text);
    
    // Alerta de notificación
    const msg = officials.length > 0 
      ? `¡Petición enviada! Se ha notificado a los ${officials.length} oficiales registrados.`
      : "¡Petición enviada correctamente!";
    
    alert(msg);
    
    // Feedback visual
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    
    setText('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden">
        {showSuccess && (
          <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 animate-in fade-in duration-300">
            <span className="text-5xl mb-3">✅</span>
            <p className="text-xl font-bold">¡Petición Recibida!</p>
            <p className="text-sm opacity-90 mt-1">Tu petición ha sido publicada y notificada.</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="mt-6 bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm shadow-xl"
            >
              Cerrar
            </button>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-500">🙏</span> Solicitar Oración
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block ml-1">Nombre del Hermano que solicita</label>
            <input
              type="text"
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="Nombre del hermano..."
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium bg-slate-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block ml-1">Motivo de Oración</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe el motivo aquí..."
              className="w-full border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 text-sm md:text-base bg-slate-50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Enviar Petición</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Notificar a {officials.length} Oficiales</span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Muro de Oración de la Iglesia</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">{requests.length} PETICIONES</span>
        </div>
        
        {requests.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 italic">
            Aún no hay peticiones publicadas.
          </div>
        ) : (
          requests.sort((a,b) => b.timestamp - a.timestamp).map(req => (
            <div key={req.id} className="bg-white p-5 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                    {req.requesterName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-none">
                      Petición de: <span className="text-indigo-600">{req.requesterName}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold mt-1 inline-block">
                      {new Date(req.timestamp).toLocaleDateString('es-CL')} • {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                "{req.request}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerWall;
