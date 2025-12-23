import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import ServerCard from './components/ServerCard';
import CreateUserForm from './components/CreateUserForm';
import { fetchServers } from './services/api';
import { Server, ServerStatus } from './types';
import { 
  PlusCircle, 
  RefreshCw, 
  Settings, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Server as ServerIcon
} from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ServerStatus>('ALL');

  const loadServers = async () => {
    setIsLoading(true);
    const response = await fetchServers();
    if (response.success && response.data) {
      setServers(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadServers();
  }, []);

  // Filter Logic
  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const matchesSearch = 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.ip.includes(searchQuery) ||
        server.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'ALL' || server.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [servers, searchQuery, statusFilter]);

  // Stats for Dashboard Header
  const stats = useMemo(() => {
    return {
      total: servers.length,
      online: servers.filter(s => s.status === ServerStatus.ONLINE).length,
      offline: servers.filter(s => s.status === ServerStatus.OFFLINE).length,
      maintenance: servers.filter(s => s.status === ServerStatus.MAINTENANCE).length
    };
  }, [servers]);

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'create-user' && !selectedServer) {
      setSelectedServer(null);
    }
  };

  const handleSelectServer = (server: Server) => {
    setSelectedServer(server);
    setActiveView('create-user');
  };

  const handleUserCreationSuccess = () => {
    setActiveView('dashboard');
    setSelectedServer(null);
    alert("User successfully created! Email sent (simulated).");
  };

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate}>
      
      {activeView === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Infrastructure Overview</h1>
              <p className="text-slate-500">Real-time monitoring and access management.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={loadServers} 
                className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => handleNavigate('create-user')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-blue-900/20 transition-all active:scale-95"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Provision User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Servers</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <ServerIcon className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Online Systems</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.online}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Offline Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Maintenance</p>
                <p className="text-2xl font-bold text-amber-600">{stats.maintenance}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search servers by name, IP, or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-4 h-4 text-slate-400 mr-1 hidden md:block" />
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter(ServerStatus.ONLINE)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === ServerStatus.ONLINE ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
              >
                Online
              </button>
              <button 
                onClick={() => setStatusFilter(ServerStatus.OFFLINE)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === ServerStatus.OFFLINE ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'}`}
              >
                Offline
              </button>
              <button 
                onClick={() => setStatusFilter(ServerStatus.MAINTENANCE)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === ServerStatus.MAINTENANCE ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
              >
                Maintenance
              </button>
            </div>
          </div>

          {/* Server Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
               ))}
            </div>
          ) : filteredServers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
              <ServerIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No servers found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServers.map(server => (
                <ServerCard 
                  key={server.id} 
                  server={server} 
                  onSelect={handleSelectServer} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'create-user' && (
        <CreateUserForm 
          server={selectedServer}
          servers={servers}
          onCancel={() => handleNavigate('dashboard')}
          onSuccess={handleUserCreationSuccess}
        />
      )}

      {activeView === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Portal Settings</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Configure backend API endpoints, default email templates, and SSH key management preferences here.
          </p>
        </div>
      )}

    </Layout>
  );
}

export default App;