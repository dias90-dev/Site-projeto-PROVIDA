import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAppointmentPDF, generateMedicalRecordPDF, generateTriagePDF } from '../utils/pdfGenerator';
import { QuickTriageForm } from './QuickTriageForm';
import {
  Calendar,
  Download,
  BellRing,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building,
  Phone,
  Mail,
  Activity,
  Pill,
  FileCheck,
  Stethoscope,
  Video,
  Scale,
  Thermometer,
  Gauge,
  Heart,
  Facebook,
  Instagram,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    medicalRecords,
    triages,
    centers,
    services,
    doctors,
    cancelAppointment,
    triggerNotification,
    setIsBookingModalOpen,
    setIsTriageModalOpen,
    setSelectedAppointmentForTriage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'triage' | 'records' | 'reminders'>('appointments');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Filter patient appointments: if logged in as patient, match by ID or patient name
  const patientAppointments = appointments.filter(apt => {
    if (currentUser.role === 'patient') {
      return apt.patientId === currentUser.id || apt.patientEmail === currentUser.email;
    }
    return true; // For demo/preview, show all if admin
  });

  const filteredAppointments = patientAppointments.filter(apt => {
    if (statusFilter === 'all') return true;
    return apt.status === statusFilter;
  });

  // Filter patient records
  const patientRecords = medicalRecords.filter(rec => {
    if (currentUser.role === 'patient') {
      return rec.patientId === currentUser.id || rec.patientName.toLowerCase().includes('ana');
    }
    return true;
  });

  // Filter patient triages
  const patientTriages = triages.filter(tri => {
    if (currentUser.role === 'patient') {
      return tri.patientId === currentUser.id || tri.patientName.toLowerCase().includes('ana');
    }
    return true;
  });

  const handleDownloadPDF = (apt: (typeof appointments)[0]) => {
    const center = centers.find(c => c.id === apt.centerId);
    const service = services.find(s => s.id === apt.serviceId);
    const doctor = doctors.find(d => d.id === apt.doctorId);
    generateAppointmentPDF(apt, center, service, doctor);
    showToast(`📄 PDF da consulta ${apt.protocolNumber} baixado com sucesso!`);
  };

  const handleDownloadRecordPDF = (rec: (typeof medicalRecords)[0]) => {
    const doctor = doctors.find(d => d.id === rec.doctorId || d.name === rec.doctorName);
    generateMedicalRecordPDF(rec, doctor?.licenseNumber || 'OM-ANG 4892/2014');
    showToast(`📄 Prontuário oficial com logotipo Cáritas baixado com sucesso!`);
  };

  const handleSendReminderTest = (apt: (typeof appointments)[0], type: 'sms' | 'email' | 'both') => {
    triggerNotification(apt, type);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Profile Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-teal-500/10 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider">
                  Portal do Paciente
                </span>
                <span className="text-xs text-slate-400">ID: {currentUser.documentId || '006892341LA042'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {currentUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  {currentUser.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  {currentUser.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
              <img
                src="/caritas_logo.png"
                alt="Logo Cáritas Oficial"
                className="w-8 h-8 object-contain"
              />
              <div className="text-left">
                <span className="text-[10px] font-bold text-red-600 block uppercase">Projeto Pró-Vida</span>
                <span className="text-[11px] text-slate-600 font-semibold">Cáritas de Angola</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedAppointmentForTriage(patientAppointments[0] || null);
                setIsTriageModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Ficha de Triagem Rápida</span>
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Marcar Nova Consulta</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-sm font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'appointments'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Minhas Consultas ({patientAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`pb-3 flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'triage'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Ficha de Triagem Rápida ({patientTriages.length})</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Sinais Vitais
            </span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'records'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Meu Prontuário & Histórico ({patientRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`pb-3 flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'reminders'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Central de Lembretes SMS & E-mail</span>
          </button>
        </div>

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Filter pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Filtrar por:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todas ({patientAppointments.length})
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'confirmed' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Confirmadas ({patientAppointments.filter(a => a.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Concluídas ({patientAppointments.filter(a => a.status === 'completed').length})
              </button>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Nenhuma consulta encontrada</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Não possui agendamentos no filtro selecionado. Faça uma nova marcação gratuita.
                </p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="mt-4 bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Agendar Agora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top badge and protocol */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                            {apt.protocolNumber}
                          </span>
                          {apt.isTelemedicine && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                              <Video className="w-3 h-3" /> Telemedicina
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {apt.status === 'confirmed'
                            ? 'Agendada'
                            : apt.status === 'completed'
                            ? 'Concluída'
                            : 'Cancelada'}
                        </span>
                      </div>

                      {/* Main appointment info */}
                      <h3 className="text-lg font-bold text-slate-900">{apt.serviceName}</h3>
                      <p className="text-xs text-teal-700 font-semibold mt-0.5">
                        Médico: {apt.doctorName}
                      </p>

                      <div className="mt-3 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Data e Hora:</span>
                          <strong className="text-slate-900 font-bold">
                            {apt.date} às {apt.time}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Centro Médico:</span>
                          <strong className="text-slate-900">{apt.centerName}</strong>
                        </div>
                        {apt.notes && (
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                            Motivo: {apt.notes}
                          </div>
                        )}
                      </div>

                      {/* Triage Preview or Call to Action */}
                      {apt.triage ? (
                        <div className="mt-3 bg-teal-50/90 border border-teal-200 rounded-2xl p-3 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-teal-900 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                              Triagem Pré-Consulta Registada
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                apt.triage.priorityLevel === 'verde'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.triage.priorityLevel === 'amarelo'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              Prioridade {apt.triage.priorityLevel.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="bg-white p-1.5 rounded-xl border border-teal-100 shadow-2xs">
                              <span className="text-[10px] text-slate-400 block font-semibold">Pressão</span>
                              <strong className="text-slate-900 font-extrabold">{apt.triage.bloodPressure}</strong>
                            </div>
                            <div className="bg-white p-1.5 rounded-xl border border-teal-100 shadow-2xs">
                              <span className="text-[10px] text-slate-400 block font-semibold">Temperatura</span>
                              <strong className="text-slate-900 font-extrabold">{apt.triage.temperature} ºC</strong>
                            </div>
                            <div className="bg-white p-1.5 rounded-xl border border-teal-100 shadow-2xs">
                              <span className="text-[10px] text-slate-400 block font-semibold">Peso</span>
                              <strong className="text-slate-900 font-extrabold">{apt.triage.weight} kg</strong>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-teal-100/80">
                            <button
                              type="button"
                              onClick={() => generateTriagePDF(apt.triage!)}
                              className="text-teal-800 hover:text-teal-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3 h-3 text-teal-700" />
                              <span>Baixar Ficha Triagem (PDF)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAppointmentForTriage(apt);
                                setIsTriageModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-slate-800 text-[11px] underline font-medium"
                            >
                              Editar Aferição
                            </button>
                          </div>
                        </div>
                      ) : apt.status === 'confirmed' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAppointmentForTriage(apt);
                            setIsTriageModalOpen(true);
                          }}
                          className="w-full mt-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-300/80 text-emerald-900 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs group"
                        >
                          <Activity className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span>Preencher Ficha de Triagem (Peso, Tº, PA)</span>
                        </button>
                      ) : null}

                      {/* Reminder status pill */}
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Lembrete SMS ativo para {apt.patientPhone}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      {/* Baixar PDF button */}
                      <button
                        onClick={() => handleDownloadPDF(apt)}
                        className="bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar PDF</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSendReminderTest(apt, 'sms')}
                          title="Disparar teste de SMS agora"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 px-2.5 rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <BellRing className="w-3.5 h-3.5 text-teal-600" />
                          <span>Reenviar SMS</span>
                        </button>

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              if (confirm('Deseja realmente cancelar este agendamento?')) {
                                cancelAppointment(apt.id);
                              }
                            }}
                            className="text-red-600 hover:bg-red-50 text-xs font-semibold py-2 px-2.5 rounded-xl transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Ficha de Triagem Rápida */}
        {activeTab === 'triage' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Ficha de Triagem Rápida & Registro de Sinais Vitais
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha o peso, temperatura axilar e pressão arterial para agilizar seu atendimento médico nos centros Mamã Muxima, Santo André e Santa Ana.
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Quick Triage Form */}
            <QuickTriageForm
              isEmbedded={true}
              initialAppointment={patientAppointments.find(a => a.status === 'confirmed') || patientAppointments[0] || null}
            />

            {/* Triage History */}
            {patientTriages.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-teal-600" />
                      Histórico de Fichas de Triagem & Aferições
                    </h4>
                    <p className="text-xs text-slate-500">
                      Registos anteriores de sinais vitais guardados na sua conta do paciente.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {patientTriages.length} registos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientTriages.map(tri => (
                    <div
                      key={tri.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                            Protocolo: {tri.protocolNumber || tri.id}
                          </span>
                          <strong className="text-sm font-bold text-slate-900">{tri.serviceName || 'Clínica Geral'}</strong>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tri.priorityLevel === 'verde'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tri.priorityLevel === 'amarelo'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          Risco {tri.priorityLevel.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Pressão</span>
                          <strong className="text-slate-900 font-extrabold">{tri.bloodPressure}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Temperatura</span>
                          <strong className="text-slate-900 font-extrabold">{tri.temperature} ºC</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Peso</span>
                          <strong className="text-slate-900 font-extrabold">{tri.weight} kg</strong>
                        </div>
                      </div>

                      {tri.mainSymptoms && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-white p-2 rounded-xl border border-slate-100">
                          "{tri.mainSymptoms}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                        <span>Aferido em: {tri.date} às {tri.time}</span>
                        <button
                          type="button"
                          onClick={() => generateTriagePDF(tri)}
                          className="bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-teal-600" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Medical Records (Prontuário) */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Histórico de Atendimentos & Prontuário Clínico Digital
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acesse diagnósticos, prescrições de remédios, laudos de exames laboratoriais e orientações emitidas pelos médicos da Rede Pró-Vida.
              </p>
            </div>

            {patientRecords.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Nenhum prontuário registrado ainda</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Os prontuários eletrônicos são preenchidos pelos médicos no momento da consulta presencial ou telemedicina.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {patientRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
                  >
                    {/* Record Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                          Atendimento Clínico • {rec.specialty}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                          Diagnóstico: {rec.diagnosis}
                        </h4>
                      </div>
                      <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-slate-700 block">{rec.date}</span>
                          <span className="text-[11px] text-slate-400">Médico: {rec.doctorName}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadRecordPDF(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-teal-700" />
                          <span>Baixar Prontuário & Receita (PDF)</span>
                        </button>
                      </div>
                    </div>

                    {/* Vital signs bar if present */}
                    {rec.vitalSigns && (
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Pressão Arterial:</span>
                          <strong className="text-slate-900 font-extrabold">{rec.vitalSigns.bloodPressure}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Temperatura:</span>
                          <strong className="text-slate-900 font-extrabold">{rec.vitalSigns.temperature}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequência Cardíaca:</span>
                          <strong className="text-slate-900 font-extrabold">{rec.vitalSigns.heartRate}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Peso Corporal:</span>
                          <strong className="text-slate-900 font-extrabold">{rec.vitalSigns.weight}</strong>
                        </div>
                      </div>
                    )}

                    {/* Prescription & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-teal-800">
                          <Pill className="w-4 h-4 text-teal-600" />
                          <span>Prescrição Médica & Medicamentos</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{rec.prescription}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-purple-800">
                          <Activity className="w-4 h-4 text-purple-600" />
                          <span>Exames Laboratoriais & Ecografias</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {rec.labExamOrders || 'Nenhum exame solicitado nesta data.'}
                        </p>
                      </div>
                    </div>

                    {/* Clinical notes */}
                    {rec.clinicalNotes && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <strong className="text-slate-800 block mb-1">Evolução Clínica do Médico:</strong>
                        <p>{rec.clinicalNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Reminders History */}
        {activeTab === 'reminders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lembretes Automáticos de Consulta
                </h3>
                <p className="text-xs text-slate-500">
                  Histórico de avisos disparados para seu número e endereço de e-mail cadastrados.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between font-semibold">
                <span>Status do Serviço de Notificações:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operacional
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Nosso gateway envia lembrete com antecedência de 24 horas e reaviso de 2 horas antes do atendimento, incluindo orientações de jejum se houver exame.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Últimos Disparos Registados:
              </span>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">SMS de Lembrete Enviado</strong>
                      <span className="text-[10px] text-slate-400">Hoje, às 08:30</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      [Pró-Vida SMS] Lembrete: Sua consulta de Clínica Geral com Dr. Manuel Domingos é em 02/10 às 09:30 no Centro Mamã Muxima.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 shrink-0">
                  Entregue
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">E-mail de Confirmação Enviado</strong>
                      <span className="text-[10px] text-slate-400">Hoje, às 08:30</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      [Pró-Vida Email] Confirmação oficial de agendamento Protocolo PV-2026-0901 com orientações pré-consulta.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 shrink-0">
                  Entregue
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Social Media & Community Health Channels (Facebook & Instagram) */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Comunidade & Saúde Pró-Vida
              </span>
              <span className="text-xs text-slate-400">Cáritas de Angola</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Siga o Projeto Pró-Vida no Facebook e Instagram
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Fique informado sobre datas de vacinação gratuita, campanhas de pré-natal comunitário, check-ups de hipertensão e diabetes e horários de atendimento nos centros Mamã Muxima, Santo André e Santa Ana.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {/* Facebook Button */}
            <a
              href="https://www.facebook.com/caritasdeangola"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Página Oficial do Facebook da Cáritas de Angola Projeto Pró-Vida"
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-blue-900/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Facebook className="w-5 h-5 fill-white" />
              <span>Seguir no Facebook</span>
            </a>

            {/* Instagram Button */}
            <a
              href="https://www.instagram.com/caritasdeangola"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Oficial da Cáritas de Angola @caritasdeangola"
              className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-pink-900/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Instagram className="w-5 h-5 text-white" />
              <span>Seguir no Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
