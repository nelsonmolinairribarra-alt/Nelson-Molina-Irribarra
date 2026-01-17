
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
  getCurrentUser: () => getInitialData().currentUser,
  
  loginWithGoogle: () => {
    const data = getInitialData();
    // Simulate Google Login result
    const mockGoogleEmail = 'usuario@gmail.com';
    let user = data.users.find(u => u.email === mockGoogleEmail);
    
    if (!user) {
      user = {
        id: Math.random().toString(36).substr(2, 9),
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

  adminRegister: (password: string) => {
    const data = getInitialData();
    const admin: User = {
      id: 'admin_primary_id',
      email: 'admin@iglesia.com',
      name: 'Administrador Principal',
      role: UserRole.ADMIN_PRIMARY,
      isRegistered: true
    };
    data.users.push(admin);
    data.currentUser = admin;
    // Password storage is mocked for this UI demo
    localStorage.setItem('admin_pass', password);
    saveAppData(data);
    return admin;
  },

  logout: () => {
    const data = getInitialData();
    data.currentUser = null;
    saveAppData(data);
  }
};
