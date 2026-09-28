import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  User as UserIcon,
  Bell,
  Stethoscope,
  Building2,
  FileText,
  Video,
  BarChart3,
  LogOut,
  ChevronDown,
  PhoneCall,
  CheckCircle2,
  Mail,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    setIsBookingModalOpen,
    setIsLoginModalOpen,
    notifications,
    loginAsDemo
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency / institutional bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              PROJETO PRÓ-VIDA
            </span>
            <span className="hidden sm:inline text-slate-400">
              Rede de Saúde Comunitária • Centros: Mamã Muxima, Santo André & Santa Ana
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-teal-300">
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              Linha Urgências: <strong className="text-white">+244 912 000 111</strong>
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lembretes SMS & Email 100% Ativos
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-cyan-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Firestore Sincronizado
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <div className="relative">
                <Stethoscope className="w-6 h-6 text-white stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-teal-800 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  PRÓ-VIDA
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 uppercase tracking-wider">
                  Saúde
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Mamã Muxima • Santo André • Santa Ana
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => setActiveTab('centers')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'centers'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              3 Centros Médicos
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'services'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Especialidades & Exames
            </button>

            <button
              onClick={() => setActiveTab('telemedicine')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'telemedicine'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4 text-teal-600" />
              <span>Telemedicina</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Em Breve
              </span>
            </button>

            {/* Portal Tab based on role */}
            <button
              onClick={() => setActiveTab('patient-portal')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'patient-portal'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-teal-600" />
              Portal do Paciente
            </button>

            {(currentUser.role === 'doctor' || currentUser.role === 'admin') && (
              <button
                onClick={() => setActiveTab('doctor-portal')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'doctor-portal'
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Área Médica & Prontuários
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-portal')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'admin-portal'
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Relatórios Mensais & Gestão
              </button>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Notification logs bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Lembretes e Notificações (SMS & E-mail)"
                className="relative p-2.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800 text-sm">
                        Lembretes SMS & E-mail
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {notifications.length} enviados
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto px-3 py-2 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-sm text-slate-400">
                        Nenhum lembrete enviado ainda.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-xs"
                        >
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              {n.type === 'sms' ? (
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                              )}
                              {n.type === 'sms' ? 'SMS Enviado' : 'E-mail Enviado'}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-700 leading-snug line-clamp-2">
                            {n.message}
                          </p>
                          <div className="mt-1 text-[10px] text-teal-700 font-medium flex items-center gap-1">
                            <span>Destino: {n.recipientContact}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-600">Entregue com sucesso</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-3 pt-2 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500">
                      Disparo automático 24h e 2h antes de cada consulta
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-teal-500/20"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-teal-600 leading-tight capitalize mt-0.5">
                    {currentUser.role === 'patient'
                      ? 'Paciente'
                      : currentUser.role === 'doctor'
                      ? 'Médico'
                      : 'Administrador'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
                  <div className="p-3 bg-slate-50 rounded-xl mb-2">
                    <p className="text-xs text-slate-500 font-medium">Sessão Iniciada Como</p>
                    <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                      Perfil: {currentUser.role}
                    </div>
                  </div>

                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Alternar Perfil Rápido (Demonstração)
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        loginAsDemo('patient', 'user-patient');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                        Ana Silva (Paciente)
                      </span>
                      {currentUser.role === 'patient' && (
                        <span className="text-[10px] text-teal-600 font-bold">Ativo</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        loginAsDemo('doctor', 'doc-1');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        Dr. Manuel Domingos (Médico)
                      </span>
                      {currentUser.id === 'doc-1' && (
                        <span className="text-[10px] text-emerald-600 font-bold">Ativo</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        loginAsDemo('doctor', 'doc-2');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                        Dra. Rosa Kiala (Pediatra)
                      </span>
                      {currentUser.id === 'doc-2' && (
                        <span className="text-[10px] text-rose-600 font-bold">Ativo</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        loginAsDemo('admin', 'user-admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 flex items-center justify-between text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                        Administrador Central
                      </span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[10px] text-blue-600 font-bold">Ativo</span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-teal-50 text-teal-700 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Login com Outro E-mail / Criar Conta
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Terminar Sessão
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Marcar Consulta */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-teal-700/25 flex items-center gap-2 transition-all hover:shadow-lg active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Marcar Consulta</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'home' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('centers')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'centers' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            3 Centros
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'services' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Especialidades
          </button>
          <button
            onClick={() => setActiveTab('patient-portal')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'patient-portal' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Meu Portal
          </button>
          {(currentUser.role === 'doctor' || currentUser.role === 'admin') && (
            <button
              onClick={() => setActiveTab('doctor-portal')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                activeTab === 'doctor-portal' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Área Médica
            </button>
          )}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-portal')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                activeTab === 'admin-portal' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Relatórios
            </button>
          )}
          <button
            onClick={() => setActiveTab('telemedicine')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'telemedicine' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Telemedicina
          </button>
        </div>
      </div>
    </header>
  );
};
