import React, { useEffect, useState } from 'react';
import { Server, ServerUser } from '../types';
import { fetchUsers, lockUser, unlockUser } from '../services/api';
import { ArrowLeft, Lock, Unlock, Loader2, User, RefreshCw, AlertCircle } from 'lucide-react';

interface UserListProps {
  server: Server;
  onBack: () => void;
}

const UserList: React.FC<UserListProps> = ({ server, onBack }) => {
  const [users, setUsers] = useState<ServerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetchUsers(server.id);
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [server.id]);

  const handleToggleLock = async (username: string, currentStatus: 'active' | 'locked') => {
    setActionLoading(username);
    const isLocked = currentStatus === 'locked';
    const action = isLocked ? unlockUser : lockUser;
    
    const res = await action(server.id, username);
    
    if (res.success) {
      // Optimistic update or reload
      await loadUsers();
    } else {
      alert("Action failed: " + res.error);
    }
    setActionLoading(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <button 
          onClick={loadUsers} 
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Refresh List"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Users on {server.name}</h2>
            <p className="text-sm text-slate-500">Manage existing accounts and access.</p>
          </div>
          <div className="bg-white px-3 py-1 rounded border border-slate-200 text-xs font-mono text-slate-500">
            {users.length} Users
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            No users found on this server.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">UID / GID</th>
                  <th className="px-6 py-4">Home Directory</th>
                  <th className="px-6 py-4">Shell</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.username} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                      {user.uid} / {user.gid}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      {user.home}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                      {user.shell}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'locked' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Lock className="w-3 h-3 mr-1" /> Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleLock(user.username, user.status)}
                        disabled={actionLoading === user.username}
                        className={`inline-flex items-center px-3 py-1.5 border rounded text-xs font-medium transition-colors ${
                          user.status === 'locked'
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {actionLoading === user.username ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : user.status === 'locked' ? (
                          <>
                            <Unlock className="w-3 h-3 mr-1" /> Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" /> Lock
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;