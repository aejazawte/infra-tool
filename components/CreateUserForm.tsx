import React, { useState } from 'react';
import { Server, CreateUserPayload } from '../types';
import { createServerUser } from '../services/api';
import { Loader2, ArrowLeft, User, Calendar, Shield, Save } from 'lucide-react';

interface CreateUserFormProps {
  server: Server | null;
  servers: Server[];
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ server: initialServer, servers, onCancel, onSuccess }) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(initialServer?.id || '');
  const [username, setUsername] = useState('');
  const [expiry, setExpiry] = useState('');
  const [sudo, setSudo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServerId) return;

    setIsSubmitting(true);
    const payload: CreateUserPayload = {
      serverId: selectedServerId,
      username,
      expiry,
      sudo
    };

    const response = await createServerUser(payload);
    setIsSubmitting(false);

    if (response.success) {
      alert("User created successfully! The password has been generated on the server.");
      onSuccess();
    } else {
      alert(response.error || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
            <User className="w-5 h-5" /> 
          </div>
          Create New Server User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Server</label>
            <select
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled>Select a server</option>
              {servers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                placeholder="jdoe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Date when the account will automatically lock.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sudo"
                checked={sudo}
                onChange={(e) => setSudo(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 bg-white"
              />
              <label htmlFor="sudo" className="ml-3 flex items-center text-sm font-medium text-slate-700">
                <Shield className="w-4 h-4 mr-2 text-slate-500" />
                Grant Sudo Privileges
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-8">
              User will be added to the sudoers group.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-900/20 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating User...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;