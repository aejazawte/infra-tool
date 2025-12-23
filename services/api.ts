import { Server, ServerStatus, UserCreationRequest, ApiResponse, UserRole } from '../types';

// Mock Data
const MOCK_SERVERS: Server[] = [
  {
    id: 'srv-001',
    name: 'Primary Web Server',
    ip: '192.168.1.10',
    os: 'Ubuntu 22.04 LTS',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Web'],
    stats: {
      cpu: 45,
      memory: 62,
      disk: 30,
      history: [
        { time: '10:00', usage: 20 },
        { time: '10:05', usage: 35 },
        { time: '10:10', usage: 45 },
        { time: '10:15', usage: 40 },
        { time: '10:20', usage: 45 },
      ]
    }
  },
  {
    id: 'srv-002',
    name: 'Database Node A',
    ip: '192.168.1.20',
    os: 'CentOS 8 Stream',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Database'],
    stats: {
      cpu: 78,
      memory: 85,
      disk: 60,
      history: [
        { time: '10:00', usage: 60 },
        { time: '10:05', usage: 70 },
        { time: '10:10', usage: 82 },
        { time: '10:15', usage: 75 },
        { time: '10:20', usage: 78 },
      ]
    }
  },
  {
    id: 'srv-003',
    name: 'Dev Environment',
    ip: '192.168.1.55',
    os: 'Debian 11',
    status: ServerStatus.MAINTENANCE,
    tags: ['Staging', 'Internal'],
    stats: {
      cpu: 10,
      memory: 15,
      disk: 12,
      history: [
        { time: '10:00', usage: 5 },
        { time: '10:05', usage: 8 },
        { time: '10:10', usage: 12 },
        { time: '10:15', usage: 10 },
        { time: '10:20', usage: 10 },
      ]
    }
  },
];

const DELAY = 800;

export const fetchServers = async (): Promise<ApiResponse<Server[]>> => {
  // In a real app, this would be: 
  // const res = await fetch('/api/servers');
  // return res.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: MOCK_SERVERS });
    }, DELAY);
  });
};

export const createServerUser = async (data: UserCreationRequest): Promise<ApiResponse<null>> => {
  // In a real app:
  // const res = await fetch('/api/users/create', { method: 'POST', body: JSON.stringify(data) ... });
  
  console.log("Submitting payload to backend:", data);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.username === 'error') {
        resolve({ success: false, error: 'Username already exists.' });
      } else {
        resolve({ success: true });
      }
    }, DELAY * 2);
  });
};