import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ServerCard from './components/ServerCard';
import CreateUserForm from './components/CreateUserForm';
import { fetchServers } from './services/api';
import { Server } from './types';
import { PlusCircle, RefreshCw, Settings } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

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

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'create-user' && !selectedServer) {
      // If navigating to create user directly without a server, reset selected
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
    // Show toast or alert
    alert("User successfully created! Email sent (simulated).");
  };

  return (
    <Layout activeView={activeView} onNavigate={handleNavigate}>
      
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Server Fleet</h1>
              <p className="text-slate-500">Manage access and monitor performance of your local infrastructure.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={loadServers} 
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => handleNavigate('create-user')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-900/20 transition-all"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Provision User
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3].map(i => (
                 <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map(server => (
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