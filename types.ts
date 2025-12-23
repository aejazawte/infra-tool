export interface Server {
  id: string;
  name: string;
  // Optional fields as backend only sends id and name currently
  ip?: string; 
  status?: 'ONLINE' | 'OFFLINE';
}

export interface ServerUser {
  username: string;
  uid: string;
  gid: string;
  home: string;
  shell: string;
  status: 'active' | 'locked'; 
}

export interface CreateUserPayload {
  serverId: string;
  username: string;
  expiry: string; // YYYY-MM-DD
  sudo: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}