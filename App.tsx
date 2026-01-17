
import React, { useState, useEffect } from 'react';
import { User, UserRole, CalendarItem, PrayerRequest, MeetingMinute, Official, TreasuryTransaction, AppNotification, CustomSection } from './types';
import { authService, saveAppData } from './services/mockAuth';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import CalendarManager from './components/CalendarManager';
import PrayerWall from './components/PrayerWall';
import MinutesSection from './components/MinutesSection';
import OfficialNotebook from './components/OfficialNotebook';
import TreasurySection from './components/TreasurySection';
import BibleVerseModal from './components/BibleVerseModal';

const DEFAULT_SECTIONS: CustomSection[] = [
  { 
    id: 'calendars', 
    label: 'Calendarios', 
    icon: '📅', 
    color: '#4f46e5',
    isVisible: true, 
    isSystem: true,
    fields: [
      { id: 'f1', label: 'Fecha', type: 'date', required: true },
      { id: 'f2', label: 'Hora', type: 'time', required: false },
      { id: 'f3', label: 'Predicador', type: 'text', required: false },
      { id: 'f4', label: 'Coordinador', type: 'text', required: false },
      { id: 'f5', label: 'Lugar', type: 'text', required: false }
    ]
  },
  { 
    id: 'prayers', 
    label: 'Oraciones', 
    icon: '🙏', 
    color: '#ef4444',
    isVisible: true, 
    isSystem: true,
    fields: [
      { id: 'p1', label: 'Solicitante', type: 'text', required: true },
      { id: 'p2', label: 'Motivo', type: 'text', required: true }
    ]
  },
  { id: 'minutes', label: 'Actas', icon: '📄', color: '#6366f1', isVisible: true, isSystem: true, fields: [] },
  { id: 'officials', label: 'Oficiales', icon: '👔', color: '#1e293b', isVisible: true, isSystem: true, fields: [] },
  { id: 'treasury', label: 'Tesorería', icon: '💰', color: '#10b981', isVisible: true, isSystem: true, fields: [] },
];

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [treasury, setTreasury] = useState<TreasuryTransaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [churchLogo, setChurchLogo] = useState('https://picsum.photos/200/200');
  const [sections, setSections] = useState<CustomSection[]>(DEFAULT_SECTIONS);
  
  const [view, setView] = useState<'login' | 'register-admin' | 'forgot-password' | 'complete-profile' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState<string>('calendars');
  const [showWelcomeVerse, setShowWelcomeVerse] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('iglesia_malalhue_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUsers(data.users || []);
        setCurrentUser(data.currentUser || null);
        setCalendars(data.calendars || []);
        setPrayers(data.prayers || []);
        setMinutes(data.minutes || []);
        setOfficials(data.officials || []);
        setTreasury(data.treasury || []);
        setNotifications(data.notifications || []);
        setChurchLogo(data.churchLogo || 'https://picsum.photos/200/200');
        setSections(data.sections || DEFAULT_SECTIONS);
        if (data.currentUser) setView('dashboard');
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const data = { users, currentUser, calendars, prayers, minutes, officials, treasury, notifications, churchLogo, sections };
    localStorage.setItem('iglesia_malalhue_data', JSON.stringify(data));
  }, [users, currentUser, calendars, prayers, minutes, officials, treasury, notifications, churchLogo, sections]);

  const handleAuthorize = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newRole = u.role === UserRole.ADMIN_SECONDARY ? UserRole.USER : UserRole.ADMIN_SECONDARY;
        return { ...u, role: newRole, authorizedByPrimary: newRole === UserRole.ADMIN_SECONDARY };
      }
      return u;
    }));
  };

  const isPrimaryAdmin = currentUser?.role === UserRole.ADMIN_PRIMARY;
  const isAdmin = isPrimaryAdmin || currentUser?.role === UserRole.ADMIN_SECONDARY;

  const currentSection = sections.find(s => s.id === activeTab);
  const themeColor = currentSection?.color || '#4f46e5';

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <div className="mb-6">
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-4">
               <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Palabra de Unidad</p>
               <p className="text-xs italic text-slate-600 font-medium leading-relaxed">"¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!" - Salmo 133:1</p>
            </div>
            <img src={churchLogo} alt="Logo" className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-slate-50 object-cover shadow-xl" />
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Misión de la Iglesia del Señor Malalhue</h1>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-tighter text-[10px]">Unidad • Trabajo • Fe</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => {
                const user = authService.loginWithGoogle();
                setCurrentUser(user);
                setUsers(prev => [...prev.filter(u => u.email !== user.email), user]);
                setView('dashboard');
              }} 
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 p-4 rounded-2xl font-bold hover:bg-slate-50 transition active:scale-95 text-slate-700"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-6 h-6" />
              Ingresar con Google
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-300 font-bold">O ACCESO ADMINISTRATIVO</span></div>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                const pass = formData.get('password') as string;
                const savedPass = localStorage.getItem('admin_pass');
                const admin = users.find(u => u.email === email && u.role === UserRole.ADMIN_PRIMARY);
                if (admin && pass === savedPass) {
                  setCurrentUser(admin);
                  setView('dashboard');
                } else {
                  alert("Credenciales incorrectas.");
                }
              }} 
              className="space-y-3"
            >
              <input required name="email" type="email" placeholder="Correo Administrador" className="w-full p-4 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              <input required name="password" type="password" placeholder="Contraseña" className="w-full p-4 border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              <button type="submit" className="w-full bg-slate-800 text-white p-4 rounded-2xl font-bold hover:bg-black shadow-lg transition active:scale-95">Entrar al Panel</button>
            </form>
            <button onClick={() => setView('register-admin')} className="text-indigo-600 text-[10px] font-bold uppercase tracking-tighter hover:underline">Registrar Nuevo Administrador</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'register-admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Nuevo Administrador</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const admin: User = { id: 'admin_'+Date.now(), email: f.get('email') as string, name: f.get('name') as string, role: UserRole.ADMIN_PRIMARY, isRegistered: true };
            localStorage.setItem('admin_pass', f.get('password') as string);
            setCurrentUser(admin);
            setUsers(prev => [...prev, admin]);
            setView('dashboard');
          }} className="space-y-4">
            <input required name="name" type="text" placeholder="Nombre completo" className="w-full p-4 border rounded-2xl outline-none" />
            <input required name="email" type="email" placeholder="Correo electrónico" className="w-full p-4 border rounded-2xl outline-none" />
            <input required name="password" type="password" placeholder="Crear Contraseña" className="w-full p-4 border rounded-2xl outline-none" />
            <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg">Crear Administrador</button>
            <button type="button" onClick={() => setView('login')} className="w-full text-slate-400 font-bold">Cancelar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={() => { setCurrentUser(null); setView('login'); }} 
      logo={churchLogo} 
      notifications={notifications}
      onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
    >
      <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-fit mb-8 mx-auto overflow-x-auto max-w-full shadow-inner scrollbar-hide">
        {sections.filter(s => s.isVisible || isPrimaryAdmin).map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); }} 
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap relative ${activeTab === tab.id ? 'bg-white shadow-sm' : 'text-slate-600 hover:bg-white/50'}`}
            style={{ color: activeTab === tab.id ? tab.color : undefined }}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        {isPrimaryAdmin && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${activeTab === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:bg-white/50'}`}
          >
            ⚙️ Ajustes
          </button>
        )}
      </div>

      <div className="mt-4 pb-20">
        <div style={{ borderColor: themeColor }} className="border-t-4 rounded-t-xl"></div>
        
        {activeTab === 'calendars' && (
          <CalendarManager items={calendars} officials={officials} userRole={currentUser?.role || UserRole.USER} onAddItem={(item) => setCalendars(prev => [...prev, { ...item, id: Date.now().toString(36) }])} />
        )}
        {activeTab === 'prayers' && currentUser && (
          <PrayerWall requests={prayers} user={currentUser} officials={officials} onPost={(name, text) => setPrayers(prev => [{ id: Date.now().toString(36), userId: currentUser.id, userName: currentUser.name || '', requesterName: name, request: text, timestamp: Date.now() }, ...prev])} />
        )}
        {activeTab === 'minutes' && (
          <MinutesSection minutes={minutes} userRole={currentUser?.role || UserRole.USER} onUpload={(min) => setMinutes(prev => [{ ...min, id: Date.now().toString(36) }, ...prev])} onDelete={(id) => setMinutes(prev => prev.filter(m => m.id !== id))} />
        )}
        {activeTab === 'treasury' && isAdmin && (
          <TreasurySection transactions={treasury} onAddTransaction={(t) => setTreasury(prev => [{ ...t, id: Date.now().toString(36) }, ...prev])} userName={currentUser?.name || 'Admin'} />
        )}
        {activeTab === 'officials' && (
          <OfficialNotebook officials={officials} onAdd={(off) => setOfficials(prev => [...prev, { ...off, id: Date.now().toString(36) }])} onDelete={(id) => setOfficials(prev => prev.filter(o => o.id !== id))} userRole={currentUser?.role || UserRole.USER} />
        )}
        {activeTab === 'admin' && isPrimaryAdmin && (
          <AdminPanel users={users} sections={sections} onAuthorize={handleAuthorize} onUpdateLogo={setChurchLogo} onUpdateSections={setSections} />
        )}
        {!DEFAULT_SECTIONS.some(s => s.id === activeTab) && activeTab !== 'admin' && (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
             <div className="text-6xl mb-4">{currentSection?.icon}</div>
             <h2 className="text-2xl font-bold" style={{ color: themeColor }}>{currentSection?.label}</h2>
             <div className="mt-8 max-w-md mx-auto">
                <p className="text-slate-500 mb-6">Sección administrable con {currentSection?.fields.length} campos configurados.</p>
                <div className="grid grid-cols-1 gap-4 text-left">
                  {currentSection?.fields.map(f => (
                    <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{f.label}</p>
                      <p className="text-sm text-slate-800 italic">Entrada de {f.type}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
