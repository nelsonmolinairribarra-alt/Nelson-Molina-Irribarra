
import { User, UserRole } from '../types';

const STORAGE_KEY = 'iglesia_malalhue_data';

interface AppData {
  users: User[];
  currentUser: User | null;
  churchLogo: string | null;
}

const getInitialData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    users: [],
    currentUser: null,
    churchLogo: 'https://picsum.photos/200/200'
  };
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const authService = {
  // Validación estricta del usuario actual
  getCurrentUser: () => {
    const data = getInitialData();
    const user = data.currentUser;
    if (!user) return null;
    
    // Verificamos que el usuario realmente exista en la base de datos "mock"
    return data.users.find(u => u.id === user.id && u.email === user.email) || null;
  },
  
  loginWithGoogle: () => {
    const data = getInitialData();
    const mockGoogleEmail = 'usuario@gmail.com';
    let user = data.users.find(u => u.email === mockGoogleEmail);
    
    if (!user) {
      user = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email: mockGoogleEmail,
        role: UserRole.USER,
        isRegistered: false
      };
      data.users.push(user);
    }
    
    data.currentUser = user;
    saveAppData(data);
    return user;
  },

  adminRegister: (name: string, email: string, password: string) => {
    const data = getInitialData();
    
    // Evitar duplicados por email
    if (data.users.some(u => u.email === email)) {
      throw new Error("El correo ya está registrado.");
    }

    const admin: User = {
      id: `admin_${Date.now()}`,
      email: email,
      name: name,
      role: UserRole.ADMIN_PRIMARY,
      isRegistered: true
    };
    
    data.users.push(admin);
    data.currentUser = admin;
    localStorage.setItem('admin_pass', password);
    saveAppData(data);
    return admin;
  },

  logout: () => {
    const data = getInitialData();
    data.currentUser = null;
    saveAppData(data);
    // Limpiar rastro de sesión para evitar persistencia insegura
    sessionStorage.removeItem('active_session_token');
  }
};
