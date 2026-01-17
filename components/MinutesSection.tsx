
import React, { useState, useEffect } from 'react';
import { MeetingMinute, UserRole } from '../types';

declare const mammoth: any;

interface MinutesSectionProps {
  minutes: MeetingMinute[];
  userRole: UserRole;
  onUpload: (minute: Omit<MeetingMinute, 'id'>) => void;
  onDelete: (id: string) => void;
}

const MinutesSection: React.FC<MinutesSectionProps> = ({ minutes, userRole, onUpload, onDelete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [viewingMinute, setViewingMinute] = useState<MeetingMinute | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const canEdit = userRole === UserRole.ADMIN_PRIMARY || userRole === UserRole.ADMIN_SECONDARY;

  useEffect(() => {
    if (!viewingMinute) {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
      setDocxHtml(null);
      return;
    }

    const processContent = async () => {
      setIsLoadingContent(true);
      try {
        const base64Content = viewingMinute.fileData.split(',')[1];
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        if (viewingMinute.fileType.includes('pdf')) {
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        } 
        else if (viewingMinute.fileType.includes('wordprocessingml') || viewingMinute.fileName.endsWith('.docx')) {
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer: byteArray.buffer });
            setDocxHtml(result.value);
          } catch (err) {
            setDocxHtml("<p class='text-red-500 p-4'>Error al procesar el archivo Word.</p>");
          }
        }
      } catch (err) {
        console.error("Error procesando archivo:", err);
      } finally {
        setIsLoadingContent(false);
      }
    };

    processContent();
  }, [viewingMinute]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          title: file.name.split('.')[0],
          date: new Date().toISOString(),
          fileName: file.name,
          fileType: file.type,
          fileData: reader.result as string
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openInNewTab = () => {
    if (blobUrl) window.open(blobUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Actas de Reuniones</h2>
        {canEdit && (
          <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-indigo-700 transition flex items-center gap-2 shadow-md">
            <span>{isUploading ? 'Subiendo...' : 'Subir Nueva Acta'}</span>
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {minutes.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
            No hay actas disponibles para visualizar.
          </div>
        ) : minutes.map(min => (
          <div key={min.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl">
                  {min.fileType.includes('pdf') ? '📄' : '📝'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 truncate max-w-[150px]">{min.title}</h3>
                  <p className="text-xs text-slate-400">{new Date(min.date).toLocaleDateString()}</p>
                </div>
              </div>
              {canEdit && (
                <button onClick={() => onDelete(min.id)} className="text-slate-300 hover:text-red-500 p-1">
                  ✕
                </button>
              )}
            </div>
            
            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => setViewingMinute(min)}
                className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs transition hover:bg-indigo-700"
              >
                Visualizar
              </button>
              <a 
                href={min.fileData} 
                download={min.fileName}
                className="flex-1 bg-slate-100 hover:bg-green-50 hover:text-green-600 text-slate-600 font-bold py-2 rounded-lg text-xs text-center transition"
              >
                Descargar
              </a>
            </div>
          </div>
        ))}
      </div>

      {viewingMinute && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">
                  {viewingMinute.fileName}
                </h3>
              </div>
              <button 
                onClick={() => setViewingMinute(null)} 
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 bg-slate-100 relative overflow-hidden">
              {isLoadingContent ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                  <p className="text-slate-500 text-sm font-medium">Cargando...</p>
                </div>
              ) : viewingMinute.fileType.includes('pdf') ? (
                blobUrl && (
                  <iframe 
                    src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none"
                    title="PDF Viewer"
                  />
                )
              ) : docxHtml ? (
                <div className="w-full h-full overflow-y-auto p-6 sm:p-10 bg-white">
                  <div 
                    className="docx-content max-w-3xl mx-auto text-slate-800"
                    dangerouslySetInnerHTML={{ __html: docxHtml }} 
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white">
                  <h4 className="text-xl font-bold mb-4">Vista previa no disponible</h4>
                  <a href={viewingMinute.fileData} download={viewingMinute.fileName} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Descargar</a>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
              {viewingMinute.fileType.includes('pdf') && (
                <button 
                  onClick={openInNewTab}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition"
                >
                  Ver Pantalla Completa
                </button>
              )}
              <button 
                onClick={() => setViewingMinute(null)} 
                className="text-xs bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinutesSection;
