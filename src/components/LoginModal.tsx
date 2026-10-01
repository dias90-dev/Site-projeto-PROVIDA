import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  User,
  Stethoscope,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginAsDemo,
    loginWithCredentials
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Informe o e-mail para acesso.');
      return;
    }
    loginWithCredentials(email, selectedRole, name || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              <img
                src="/caritas_logo.png"
                alt="Logo Oficial Cáritas"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300">
                  PROJETO PRÓ-VIDA
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 uppercase">
                  CÁRITAS
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                {mode === 'login' ? 'Acesso ao Sistema Clínico' : 'Cadastro de Novo Paciente'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Login Preset Boxes */}
        <div className="bg-teal-50/70 border-b border-teal-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Acesso Rápido de Demonstração (1 Clique)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => loginAsDemo('patient', 'user-patient')}
              className="p-2.5 rounded-xl bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-left transition-all shadow-xs flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-800">Ana Paula Silva</div>
                <div className="text-[10px] text-teal-600 font-medium">Perfil: Paciente</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => loginAsDemo('doctor', 'doc-1')}
              className="p-2.5 rounded-xl bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-left transition-all shadow-xs flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-800">Dr. Manuel Domingos</div>
                <div className="text-[10px] text-emerald-600 font-medium">Perfil: Médico (Geral/Uro)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => loginAsDemo('doctor', 'doc-2')}
              className="p-2.5 rounded-xl bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-left transition-all shadow-xs flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-800">Dra. Rosa Kiala</div>
                <div className="text-[10px] text-rose-600 font-medium">Perfil: Médica (Pediatria)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => loginAsDemo('admin', 'user-admin')}
              className="p-2.5 rounded-xl bg-white border border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-left transition-all shadow-xs flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-800">Irmã Ventura</div>
                <div className="text-[10px] text-blue-600 font-medium">Administradora do Projeto</div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Login / Register Form */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`pb-2 transition-all ${
                mode === 'login'
                  ? 'border-b-2 border-teal-600 text-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Entrar com E-mail
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`pb-2 transition-all ${
                mode === 'register'
                  ? 'border-b-2 border-teal-600 text-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Criar Nova Conta de Paciente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Endereço de E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Telefone para Lembretes SMS
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nº do BI / Cédula
                  </label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={e => setDocumentId(e.target.value)}
                    placeholder="006892341LA042"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Palavra-passe (Senha)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {mode === 'login' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Acesso / Perfil
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('patient')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'patient'
                        ? 'border-teal-600 bg-teal-50 text-teal-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Paciente
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('doctor')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'doctor'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Médico(a)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'admin'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
            >
              <span>{mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta de Paciente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
