
import React, { useState, useRef } from 'react';
import { Official, UserRole } from '../types';

interface OfficialNotebookProps {
  officials: Official[];
  onAdd: (official: Omit<Official, 'id'>) => void;
  onDelete: (id: string) => void;
  userRole: UserRole;
}

const OfficialNotebook: React.FC<OfficialNotebookProps> = ({ officials, onAdd, onDelete, userRole }) => {
  const [showForm, setShowForm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = userRole === UserRole.ADMIN_PRIMARY || userRole === UserRole.ADMIN_SECONDARY;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAdd({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      birthDate: formData.get('birthDate') as string,
      photo: photoPreview || undefined
    });
    setShowForm(false);
    setPhotoPreview(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No registrada';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Libreta de Oficiales</h2>
          <p className="text-slate-500 text-sm">Directorio de contacto y perfiles de los oficiales.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition"
          >
            {showForm ? 'Cerrar' : '+ Nuevo Oficial'}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-dashed border-indigo-200 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 flex flex-col items-center justify-center border-r md:pr-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-200 transition"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400">
                    <span className="text-2xl">📸</span>
                    <p className="text-[10px] font-bold">FOTO ROSTRO</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handlePhotoChange} 
              />
            </div>
            
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
                <input required name="name" type="text" placeholder="Nombre completo" className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Teléfono</label>
                <input required name="phone" type="tel" placeholder="+56 9..." className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Dirección</label>
                <input required name="address" type="text" placeholder="Calle, Número, Ciudad" className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fecha de Nacimiento</label>
                <input required name="birthDate" type="date" className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg">Registrar Oficial</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officials.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white border rounded-2xl border-dashed">
            No hay oficiales registrados en la libreta.
          </div>
        ) : (
          officials.sort((a,b) => a.name.localeCompare(b.name)).map(off => (
            <div key={off.id} className="bg-white rounded-3xl border shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative">
              <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              
              <div className="px-6 pb-6 text-center -mt-10">
                <div className="inline-block relative">
                  <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md">
                    <img 
                      src={off.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(off.name)}&background=random&size=128`} 
                      alt={off.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{off.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">Oficial Registrado</p>
                </div>

                <div className="mt-6 space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-sm">📞</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Teléfono</p>
                      <a href={`tel:${off.phone}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition">{off.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-sm">🏠</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Dirección</p>
                      <p className="text-sm font-medium text-slate-700">{off.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-sm">🎂</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Cumpleaños</p>
                      <p className="text-sm font-medium text-slate-700">{formatDate(off.birthDate)}</p>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <button 
                    onClick={() => onDelete(off.id)} 
                    className="absolute top-2 right-2 w-8 h-8 bg-black/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar de la libreta"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfficialNotebook;
