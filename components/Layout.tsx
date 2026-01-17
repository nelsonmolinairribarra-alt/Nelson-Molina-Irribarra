
import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  logo: string;
  notifications?: AppNotification[];
  onMarkRead?: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, logo, notifications = [], onMarkRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo Iglesia" className="w-10 h-10 rounded-full object-cover border shadow-sm" />
            <span className="font-bold text-lg hidden md:inline text-indigo-900 tracking-tight">
              Misión de la Iglesia del Señor Malalhue
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user?.role === UserRole.ADMIN_PRIMARY && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-slate-100 transition relative"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-4 border-b bg-indigo-600 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Notificaciones</h3>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">{unreadCount} nuevas</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center text-slate-400 text-sm italic">
                            No hay notificaciones aún.
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              className={`p-4 border-b last:border-0 hover:bg-slate-50 transition relative ${!n.read ? 'bg-indigo-50/50' : ''}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{n.message}</p>
                                  {n.data && (
                                    <div className="text-[11px] text-slate-500 mb-2">
                                      <p>📞 {n.data.userPhone}</p>
                                    </div>
                                  )}
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {new Date(n.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                {!n.read && onMarkRead && (
                                  <button 
                                    onClick={() => onMarkRead(n.id)}
                                    className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded-md font-bold hover:bg-indigo-600 hover:text-white transition"
                                  >
                                    Leído
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user.name || user.email}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  {user.role === UserRole.ADMIN_PRIMARY ? 'Admin Principal' : 
                   user.role === UserRole.ADMIN_SECONDARY ? 'Admin Secundario' : 'Miembro'}
                </p>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 sm:px-4 py-2 rounded-xl font-bold transition-all active:scale-95 border border-red-100 shadow-sm"
              aria-label="Cerrar Sesión"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>
      
      <footer className="bg-slate-100 border-t py-6 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Misión de la Iglesia del Señor Malalhue. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;
