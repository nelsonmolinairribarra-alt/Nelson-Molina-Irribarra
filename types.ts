
export enum UserRole {
  USER = 'USER',
  ADMIN_SECONDARY = 'ADMIN_SECONDARY',
  ADMIN_PRIMARY = 'ADMIN_PRIMARY'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  isRegistered: boolean;
  authorizedByPrimary?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'NEW_USER';
  message: string;
  timestamp: number;
  read: boolean;
  data?: {
    userName: string;
    userPhone: string;
  };
}

export interface SectionField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'time' | 'number' | 'select';
  options?: string[]; // Para tipos 'select'
  required: boolean;
}

export interface CustomSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  isVisible: boolean;
  isSystem: boolean;
  fields: SectionField[];
  description?: string;
}

export interface Official {
  id: string;
  name: string;
  phone: string;
  address: string;
  birthDate?: string;
  photo?: string;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  requesterName: string;
  request: string;
  timestamp: number;
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  fileName: string;
  fileType: string;
  fileData: string;
}

export type TransactionType = 'ENTRADA' | 'DIEZMO' | 'GASTO';

export interface TreasuryTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
}

export type CalendarType = 
  | 'jueves' 
  | 'domingo' 
  | 'estudios' 
  | 'visitas_hermanos' 
  | 'visitas_purulon' 
  | 'pastoral_zonal' 
  | 'local' 
  | 'nacional' 
  | 'santa_cena';

export interface CalendarItem {
  id: string;
  type: CalendarType;
  date: string;
  time?: string;
  preacher?: string;
  coordinator?: string;
  event?: string;
  speaker?: string;
  topic?: string;
  responsibleOfficer?: string;
  brotherToVisit?: string;
  place?: string;
  observation?: string;
  churchToVisit?: string;
  pastoralAttendance?: string;
  dynamicData?: Record<string, any>;
}
