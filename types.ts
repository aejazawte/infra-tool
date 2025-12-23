export enum ServerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE'
}

export enum UserRole {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  VIEWER = 'viewer'
}

export interface ServerStats {
  cpu: number;
  memory: number;
  disk: number;
  history: { time: string; usage: number }[];
}

export interface Server {
  id: string;
  name: string;
  ip: string;
  os: string;
  status: ServerStatus;
  tags: string[];
  stats: ServerStats;
}

export interface UserCreationRequest {
  serverId: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  sshKey?: string;
  sudo: boolean;
  welcomeMessage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}