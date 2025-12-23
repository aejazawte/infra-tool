import React from 'react';
import { Server } from '../types';
import { Server as ServerIcon, Users, Plus } from 'lucide-react';

interface ServerCardProps {
  server: Server;
  onManageUsers: (server: Server) => void;
  onCreateUser: (server: Server) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({ server, onManageUsers, onCreateUser }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <ServerIcon className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{server.name}</h3>
          <p className="text-sm text-slate-500 font-mono">ID: {server.id}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button 
          onClick={() => onManageUsers(server)}
          className="flex items-center justify-center px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors border border-slate-200"
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Users
        </button>
        <button 
          onClick={() => onCreateUser(server)}
          className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
    </div>
  );
};

export default ServerCard;