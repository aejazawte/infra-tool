import React from 'react';
import { Server, ServerStatus } from '../types';
import { Activity, HardDrive, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';

interface ServerCardProps {
  server: Server;
  onSelect: (server: Server) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({ server, onSelect }) => {
  const isOnline = server.status === ServerStatus.ONLINE;
  const isMaintenance = server.status === ServerStatus.MAINTENANCE;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-lg">{server.name}</h3>
            {isOnline && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
            {!isOnline && <AlertCircle className="w-4 h-4 text-amber-500" />}
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">{server.ip}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
          isOnline ? 'bg-emerald-100 text-emerald-700' : 
          isMaintenance ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {server.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center text-slate-400 mb-1 space-x-1">
            <Cpu className="w-3 h-3" />
            <span className="text-xs font-medium">CPU</span>
          </div>
          <span className={`text-lg font-bold ${server.stats.cpu > 80 ? 'text-red-600' : 'text-slate-700'}`}>
            {server.stats.cpu}%
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center text-slate-400 mb-1 space-x-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs font-medium">RAM</span>
          </div>
          <span className={`text-lg font-bold ${server.stats.memory > 80 ? 'text-amber-600' : 'text-slate-700'}`}>
            {server.stats.memory}%
          </span>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center text-slate-400 mb-1 space-x-1">
            <HardDrive className="w-3 h-3" />
            <span className="text-xs font-medium">DISK</span>
          </div>
          <span className="text-lg font-bold text-slate-700">
            {server.stats.disk}%
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {server.tags.map(tag => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => onSelect(server)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            Create User &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;