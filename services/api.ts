import { Server, ServerUser, CreateUserPayload, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const text = await response.text();
    return { success: false, error: text || response.statusText };
  }
  const data = await response.json();
  return { success: true, data };
}

export const fetchServers = async (): Promise<ApiResponse<Server[]>> => {
  try {
    const res = await fetch(`${API_BASE}/servers`);
    // Backend returns array directly, wrapping it in our ApiResponse structure
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to connect to backend' };
  }
};

export const fetchUsers = async (serverId: string): Promise<ApiResponse<ServerUser[]>> => {
  try {
    const res = await fetch(`${API_BASE}/users/${serverId}`);
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch users' };
  }
};

export const createServerUser = async (payload: CreateUserPayload): Promise<ApiResponse<any>> => {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  } catch (err) {
    return { success: false, error: 'Failed to create user' };
  }
};

export const lockUser = async (serverId: string, username: string): Promise<ApiResponse<any>> => {
  try {
    const res = await fetch(`${API_BASE}/users/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, username })
    });
    return handleResponse(res);
  } catch (err) {
    return { success: false, error: 'Failed to lock user' };
  }
};

export const unlockUser = async (serverId: string, username: string): Promise<ApiResponse<any>> => {
  try {
    const res = await fetch(`${API_BASE}/users/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, username })
    });
    return handleResponse(res);
  } catch (err) {
    return { success: false, error: 'Failed to unlock user' };
  }
};

export const getExportUrl = () => `${API_BASE}/users/export`;