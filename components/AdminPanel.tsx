
import React, { useState } from 'react';
import { User, UserRole, CustomSection, SectionField } from '../types';

interface AdminPanelProps {
  users: User[];
  sections: CustomSection[];
  onAuthorize: (userId: string) => void;
  onUpdateLogo: (newUrl: string) => void;
  onUpdateSections: (sections: CustomSection[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, sections, onAuthorize, onUpdateLogo, onUpdateSections }) => {
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<SectionField['type']>('text');

  const handleUpdateLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSection = () => {
    const newSection: CustomSection = {
      id: `custom_${Date.now()}`,
      label: 'Nueva Sección',
      icon: '📁',
      color: '#4f46e5',
      isVisible: true,
      isSystem: false,
      fields: [{ id: 'f1', label: 'Descripción', type: 'text', required: true }]
    };
    onUpdateSections([...sections, newSection]);
    setEditingSection(newSection);
  };

  const saveSectionChanges = () => {
    if (!editingSection) return;
    onUpdateSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
    setEditingSection(null);
  };

  const addFieldToEditing = () => {
    if (!newFieldName.trim() || !editingSection) return;
    const newField: SectionField = {
      id: `field_${Date.now()}`,
      label: newFieldName,
      type: newFieldType,
      required: false
    };
    setEditingSection({
      ...editingSection,
      fields: [...editingSection.fields, newField]
    });
    setNewFieldName('');
  };

  const removeFieldFromEditing = (fieldId: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      fields: editingSection.fields.filter(f => f.id !== fieldId)
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Configuración de Logo */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>🎨</span> Identidad de la Iglesia
        </h2>
        <div className="flex items-center gap-6">
          <label className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-indigo-200 bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition">
            <span className="text-2xl">📸</span>
            <p className="text-[10px] font-bold uppercase text-indigo-400 mt-2">Cambiar Logo</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpdateLogo} />
          </label>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">Este logo aparecerá en la cabecera y en la pantalla de inicio de todos los miembros.</p>
          </div>
        </div>
      </section>

      {/* Editor de Secciones */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚙️</span> Personalizar Módulos y Casillas
          </h2>
          <button 
            onClick={handleAddSection}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition"
          >
            + Nueva Sección
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(section => (
            <div key={section.id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-300 transition-all group bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">{section.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">{section.label}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }}></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{section.fields.length} campos</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSection(section)}
                  className="flex-1 bg-white text-slate-700 text-xs font-bold py-2 rounded-lg border hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Editar Casillas y Color
                </button>
                <button 
                  onClick={() => onUpdateSections(sections.map(s => s.id === section.id ? { ...s, isVisible: !s.isVisible } : s))}
                  className={`p-2 rounded-lg border transition ${section.isVisible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}
                >
                  {section.isVisible ? '👁️' : '🚫'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Edición de Sección */}
      {editingSection && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Editando Sección: {editingSection.label}</h3>
              <button onClick={() => setEditingSection(null)} className="text-slate-400 hover:text-red-500 text-xl">✕</button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Ajustes Básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nombre de la Sección</label>
                  <input 
                    type="text" 
                    value={editingSection.label} 
                    onChange={(e) => setEditingSection({...editingSection, label: e.target.value})}
                    className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Color de Énfasis</label>
                  <input 
                    type="color" 
                    value={editingSection.color} 
                    onChange={(e) => setEditingSection({...editingSection, color: e.target.value})}
                    className="w-full h-11 p-1 border rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              {/* Ajuste de Campos (Casillas) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-700 uppercase">Casillas de Información (Campos)</h4>
                </div>
                
                <div className="space-y-2">
                  {editingSection.fields.map(field => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-indigo-100 text-indigo-600 font-bold px-2 py-1 rounded capitalize">{field.type}</span>
                        <span className="text-sm font-medium text-slate-700">{field.label}</span>
                      </div>
                      <button onClick={() => removeFieldFromEditing(field.id)} className="text-red-400 hover:text-red-600 text-sm">Eliminar</button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-3">
                  <p className="text-xs font-bold text-indigo-600 uppercase">Agregar Nueva Casilla</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nombre de la casilla (ej: Tema)" 
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      className="flex-1 p-2 border rounded-lg text-sm outline-none"
                    />
                    <select 
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="p-2 border rounded-lg text-sm bg-white outline-none"
                    >
                      <option value="text">Texto</option>
                      <option value="date">Fecha</option>
                      <option value="time">Hora</option>
                      <option value="number">Número</option>
                    </select>
                    <button 
                      onClick={addFieldToEditing}
                      className="bg-indigo-600 text-white px-4 rounded-lg font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={() => setEditingSection(null)} className="px-6 py-2 text-slate-500 font-bold">Cancelar</button>
              <button onClick={saveSectionChanges} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* Gestión de Usuarios Autorizados */}
      <section className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Autorización de Miembros</h2>
          <p className="text-sm text-slate-500">Autoriza a miembros registrados para ser administradores secundarios.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Miembro</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Estado</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.filter(u => u.isRegistered && u.role !== UserRole.ADMIN_PRIMARY).map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${user.role === UserRole.ADMIN_SECONDARY ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {user.role === UserRole.ADMIN_SECONDARY ? 'Administrador' : 'Miembro'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onAuthorize(user.id)}
                      className={`text-xs font-bold px-4 py-2 rounded-lg transition ${user.role === UserRole.ADMIN_SECONDARY ? 'bg-red-50 text-red-500' : 'bg-indigo-600 text-white shadow-md'}`}
                    >
                      {user.role === UserRole.ADMIN_SECONDARY ? 'Quitar Permiso' : 'Dar Permiso Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
