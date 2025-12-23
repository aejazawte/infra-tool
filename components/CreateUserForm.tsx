import React, { useState } from 'react';
import { Server, UserRole, UserCreationRequest } from '../types';
import { suggestUsername, generateWelcomeEmail } from '../services/geminiService';
import { createServerUser } from '../services/api';
import { Sparkles, Loader2, Send, Wand2, ArrowLeft, User } from 'lucide-react';

interface CreateUserFormProps {
  server: Server | null;
  servers: Server[];
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ server: initialServer, servers, onCancel, onSuccess }) => {
  const [selectedServerId, setSelectedServerId] = useState<string>(initialServer?.id || '');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [sudo, setSudo] = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState('');
  
  const [isSuggestingUser, setIsSuggestingUser] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to find server object from ID
  const selectedServer = servers.find(s => s.id === selectedServerId);

  const handleSuggestUsername = async () => {
    if (!fullName) return;
    setIsSuggestingUser(true);
    const suggested = await suggestUsername(fullName);
    setUsername(suggested);
    setIsSuggestingUser(false);
  };

  const handleGenerateEmail = async () => {
    if (!fullName || !username || !selectedServer) return;
    setIsGeneratingEmail(true);
    const emailContent = await generateWelcomeEmail(fullName, username, selectedServer.name);
    setWelcomeEmail(emailContent);
    setIsGeneratingEmail(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServerId) return;

    setIsSubmitting(true);
    const payload: UserCreationRequest = {
      serverId: selectedServerId,
      fullName,
      username,
      email,
      role,
      sudo,
      welcomeMessage: welcomeEmail
    };

    const response = await createServerUser(payload);
    setIsSubmitting(false);

    if (response.success) {
      onSuccess();
    } else {
      alert(response.error || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onCancel}
        className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
                <User className="w-5 h-5" /> 
              </span>
              User Account Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Server</label>
                <select
                  value={selectedServerId}
                  onChange={(e) => setSelectedServerId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="" disabled>Select a server</option>
                  {servers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.ip})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="jane@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">System Username</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    placeholder="j.doe"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSuggestUsername}
                    disabled={!fullName || isSuggestingUser}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200 font-medium text-sm flex items-center transition-colors disabled:opacity-50"
                  >
                    {isSuggestingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Suggest
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={UserRole.VIEWER}>Viewer (Read Only)</option>
                    <option value={UserRole.DEVELOPER}>Developer (Limited)</option>
                    <option value={UserRole.ADMIN}>Administrator (Full)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="sudo"
                    checked={sudo}
                    onChange={(e) => setSudo(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="sudo" className="text-sm font-medium text-slate-700">Enable Sudo Privileges</label>
                </div>
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
                      Provisioning User...
                    </>
                  ) : (
                    <>
                      Create User Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Email Gen */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center">
              <Wand2 className="w-5 h-5 mr-2 text-indigo-600" />
              Welcome Email
            </h3>
            <p className="text-sm text-indigo-700/80 mb-4">
              Automatically generate a secure welcome email with login instructions.
            </p>

            {selectedServer && fullName && username ? (
              <>
                <div className="mb-4">
                   <textarea
                    value={welcomeEmail}
                    onChange={(e) => setWelcomeEmail(e.target.value)}
                    className="w-full h-64 p-3 text-sm border border-indigo-200 rounded-lg bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-slate-700"
                    placeholder="Generate email content..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  disabled={isGeneratingEmail}
                  className="w-full bg-white text-indigo-700 border border-indigo-200 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm flex justify-center items-center"
                >
                  {isGeneratingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {welcomeEmail ? 'Regenerate Email' : 'Generate with AI'}
                </button>
              </>
            ) : (
              <div className="bg-white/50 rounded-lg p-4 text-center text-indigo-400 text-sm border border-indigo-100 border-dashed">
                Fill in the user details and select a server to unlock AI email generation.
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-xs font-mono">
            <div className="flex items-center text-slate-300 mb-2 font-bold uppercase tracking-wider">
              <Send className="w-3 h-3 mr-2" />
              Action Plan
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">1.</span>
                <span>Connect to {selectedServer ? selectedServer.ip : 'server'} via SSH</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">2.</span>
                <span>Create user '{username || '...'}'</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">3.</span>
                <span>Set temporary password</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-500">4.</span>
                <span>Grant {sudo ? 'sudo' : 'standard'} permissions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;