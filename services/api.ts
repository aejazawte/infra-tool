import { Server, ServerStatus, UserCreationRequest, ApiResponse, UserRole } from '../types';

// Mock Data - Expanded to 10 Servers
const MOCK_SERVERS: Server[] = [
  {
    id: 'srv-001',
    name: 'Web Prod 01',
    ip: '10.0.1.10',
    os: 'Ubuntu 22.04 LTS',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Web', 'Nginx'],
    stats: {
      cpu: 45,
      memory: 62,
      disk: 30,
      history: []
    }
  },
  {
    id: 'srv-002',
    name: 'Web Prod 02',
    ip: '10.0.1.11',
    os: 'Ubuntu 22.04 LTS',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Web', 'Nginx'],
    stats: {
      cpu: 38,
      memory: 55,
      disk: 28,
      history: []
    }
  },
  {
    id: 'srv-003',
    name: 'DB Master',
    ip: '10.0.2.50',
    os: 'CentOS 8 Stream',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Database', 'PostgreSQL'],
    stats: {
      cpu: 78,
      memory: 85,
      disk: 60,
      history: []
    }
  },
  {
    id: 'srv-004',
    name: 'DB Replica',
    ip: '10.0.2.51',
    os: 'CentOS 8 Stream',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Database', 'Read-Only'],
    stats: {
      cpu: 25,
      memory: 40,
      disk: 58,
      history: []
    }
  },
  {
    id: 'srv-005',
    name: 'Cache Cluster',
    ip: '10.0.3.15',
    os: 'Debian 11',
    status: ServerStatus.ONLINE,
    tags: ['Production', 'Cache', 'Redis'],
    stats: {
      cpu: 12,
      memory: 70,
      disk: 15,
      history: []
    }
  },
  {
    id: 'srv-006',
    name: 'Load Balancer',
    ip: '10.0.0.5',
    os: 'Alpine Linux',
    status: ServerStatus.ONLINE,
    tags: ['Network', 'HAProxy'],
    stats: {
      cpu: 5,
      memory: 10,
      disk: 5,
      history: []
    }
  },
  {
    id: 'srv-007',
    name: 'Dev Server',
    ip: '10.0.10.20',
    os: 'Ubuntu 22.04',
    status: ServerStatus.ONLINE,
    tags: ['Development', 'General'],
    stats: {
      cpu: 10,
      memory: 25,
      disk: 40,
      history: []
    }
  },
  {
    id: 'srv-008',
    name: 'Staging Env',
    ip: '10.0.10.21',
    os: 'Ubuntu 22.04',
    status: ServerStatus.MAINTENANCE,
    tags: ['Staging', 'Testing'],
    stats: {
      cpu: 0,
      memory: 5,
      disk: 40,
      history: []
    }
  },
  {
    id: 'srv-009',
    name: 'Backup Server',
    ip: '10.0.5.99',
    os: 'Debian 12',
    status: ServerStatus.OFFLINE,
    tags: ['Storage', 'Backup'],
    stats: {
      cpu: 0,
      memory: 0,
      disk: 0,
      history: []
    }
  },
  {
    id: 'srv-10',
    name: 'Monitoring Node',
    ip: '10.0.99.1',
    os: 'Ubuntu 22.04',
    status: ServerStatus.ONLINE,
    tags: ['Ops', 'Monitoring'],
    stats: {
      cpu: 15,
      memory: 30,
      disk: 20,
      history: []
    }
  }
];

const DELAY = 600;

export const fetchServers = async (): Promise<ApiResponse<Server[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: MOCK_SERVERS });
    }, DELAY);
  });
};

export const createServerUser = async (data: UserCreationRequest): Promise<ApiResponse<null>> => {
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