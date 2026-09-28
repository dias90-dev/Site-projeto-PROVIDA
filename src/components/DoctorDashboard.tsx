import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalRecord, Appointment } from '../types';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Bell,
  Activity,
  Pill,
  Send,
  Building,
  Filter,
  Save,
  MessageSquare,
  Check
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    medicalRecords,
    addMedicalRecord,
    completeAppointment,
    centers,
    doctorSchedules,
    updateDoctorSlots,
    triggerNotification,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'agenda' | 'schedule-mgr' | 'records'>('agenda');
  const [selectedCenterFilter, setSelectedCenterFilter] = useState<string>('all');

  // Prontuário Form State
  const [activePatientApt, setActivePatientApt] = useState<Appointment | null>(null);
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [labExamOrders, setLabExamOrders] = useState('');
  const [bloodPressure, setBloodPressure] = useState('120/80 mmHg');
  const [temperature, setTemperature] = useState('36.5 ºC');
  const [heartRate, setHeartRate] = useState('72 bpm');
  const [weight, setWeight] = useState('65 kg');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Schedule manager state
  const doctorId = currentUser.id || 'doc-1';
  const currentSlots = doctorSchedules[doctorId] || [
    '08:00',
    '08:45',
    '09:30',
    '10:15',
    '11:00',
    '14:00',
    '14:45',
    '15:30'
  ];
  const [slotsList, setSlotsList] = useState<string[]>(currentSlots);
  const [newSlotInput, setNewSlotInput] = useState('');

  // Filter doctor appointments
  const doctorAppointments = appointments.filter(apt => {
    // If logged in as specific doctor, match doctorId or show all if admin
    if (currentUser.role === 'doctor') {
      const matchDoc = apt.doctorId === currentUser.id || apt.doctorName.includes(currentUser.name.split(' ')[0]);
      if (selectedCenterFilter !== 'all') {
        return matchDoc && apt.centerId === selectedCenterFilter;
      }
      return matchDoc;
    }
    // If admin viewing
    if (selectedCenterFilter !== 'all') {
      return apt.centerId === selectedCenterFilter;
    }
    return true;
  });

  const handleOpenProntuarioForAppointment = (apt: Appointment) => {
    setActivePatientApt(apt);
    setPatientName(apt.patientName);
    setSymptoms(apt.notes || 'Paciente relata queixas clínicas para avaliação médica.');
    setDiagnosis('Avaliação clínica em andamento.');
    setPrescription('');
    setLabExamOrders('');
    setActiveTab('records');
  };

  const handleSaveProntuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !diagnosis.trim()) {
      alert('Por favor, informe ao menos o nome do paciente e o diagnóstico.');
      return;
    }

    addMedicalRecord({
      appointmentId: activePatientApt?.id,
      patientId: activePatientApt?.patientId || `pat-${Date.now()}`,
      patientName,
      doctorId: currentUser.id || 'doc-1',
      doctorName: currentUser.name || 'Médico Pró-Vida',
      centerId: activePatientApt?.centerId || 'mama-muxima',
      date: new Date().toISOString().split('T')[0],
      specialty: currentUser.specialty || 'Clínica Geral',
      symptoms,
      diagnosis,
      prescription,
      labExamOrders,
      vitalSigns: {
        bloodPressure,
        temperature,
        heartRate,
        weight
      },
      clinicalNotes
    });

    if (activePatientApt) {
      completeAppointment(activePatientApt.id);
    }

    // Reset
    setActivePatientApt(null);
    setSymptoms('');
    setDiagnosis('');
    setPrescription('');
    setLabExamOrders('');
    setClinicalNotes('');
  };

  // Schedule management handlers
  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    if (slotsList.includes(newSlotInput.trim())) {
      alert('Este horário já está na lista.');
      return;
    }
    const updated = [...slotsList, newSlotInput.trim()].sort();
    setSlotsList(updated);
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    const updated = slotsList.filter(s => s !== slotToRemove);
    setSlotsList(updated);
  };

  const handleSaveSchedule = () => {
    updateDoctorSlots(doctorId, slotsList);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Doctor Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Área Médica & Prontuários
                </span>
                <span className="text-xs text-slate-400">
                  {currentUser.crmOrLicence || 'OM-ANG 4892/2014'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {currentUser.name}
              </h1>
              <p className="text-xs text-teal-700 font-semibold mt-1">
                {currentUser.specialty || 'Clínica Geral & Urologia'} • Rede Pró-Vida
              </p>
            </div>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center px-4">
              <span className="text-xs text-slate-400 font-bold uppercase block">Hoje</span>
              <span className="text-xl font-extrabold text-teal-700">
                {doctorAppointments.length} Pacientes
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`pb-3 flex items-center gap-2 transition-all ${
              activeTab === 'agenda'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda de Consultas ({doctorAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule-mgr')}
            className={`pb-3 flex items-center gap-2 transition-all ${
              activeTab === 'schedule-mgr'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Gerenciar Horários & Escalas</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 flex items-center gap-2 transition-all ${
              activeTab === 'records'
                ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prontuário Eletrônico & Prescrições</span>
          </button>
        </div>

        {/* TAB 1: Agenda de Consultas */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* Filter by center */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-700 uppercase">Filtrar Centro Médico:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setSelectedCenterFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedCenterFilter === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos os Centros
                </button>
                {centers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCenterFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      selectedCenterFilter === c.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.name.replace('Centro Médico ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {doctorAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  Nenhuma consulta agendada para este filtro
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Novos agendamentos marcados pelos pacientes aparecerão aqui em tempo real.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctorAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                          {apt.protocolNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {apt.date} às {apt.time}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          • {apt.centerName}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {apt.status === 'confirmed'
                            ? 'Agendado'
                            : apt.status === 'completed'
                            ? 'Atendido'
                            : 'Cancelado'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900">
                          {apt.patientName}
                        </h3>
                        <span className="text-xs text-slate-400">
                          BI: {apt.patientDocument}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-teal-700">{apt.serviceName}</span>
                        <span>•</span>
                        <span>Tel: {apt.patientPhone}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <strong>Queixa do paciente:</strong> {apt.notes}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleOpenProntuarioForAppointment(apt)}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Stethoscope className="w-4 h-4" />
                          <span>Atender & Abrir Prontuário</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          triggerNotification(
                            apt,
                            'sms',
                            `[Pró-Vida SMS] Dr. ${currentUser.name.split(' ')[0]} aguarda seu comparecimento para a consulta de ${apt.serviceName} no ${apt.centerName}. Protocolo: ${apt.protocolNumber}.`
                          )
                        }
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                        <span>Lembrar por SMS</span>
                      </button>

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => completeAppointment(apt.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Finalizar</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Schedule & Availability Manager */}
        {activeTab === 'schedule-mgr' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Gerenciador de Horários de Atendimento
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adicione ou remova janelas de horários disponíveis para agendamento dos pacientes.
                </p>
              </div>

              <button
                onClick={handleSaveSchedule}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações de Horário</span>
              </button>
            </div>

            {/* Current slots list */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Horários Atuais Disponíveis na Agenda ({slotsList.length})
              </label>

              <div className="flex flex-wrap gap-2.5">
                {slotsList.map(slot => (
                  <div
                    key={slot}
                    className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot)}
                      className="text-slate-400 hover:text-red-500 ml-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Adicionar Novo Horário (Formato HH:MM)
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={newSlotInput}
                  onChange={e => setNewSlotInput(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Prontuário Eletrônico & Prescrições */}
        {activeTab === 'records' && (
          <div className="space-y-8">
            {/* Form */}
            <form
              onSubmit={handleSaveProntuario}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Prontuário Eletrônico Pró-Vida
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {activePatientApt
                    ? `Atendimento Clínico: ${activePatientApt.patientName}`
                    : 'Novo Registro de Atendimento Clínico'}
                </h3>
              </div>

              {/* Patient Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Ex: Ana Paula Silva"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hipótese Diagnóstica / CID Principal *
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="Ex: Hipertensão Arterial Sistêmica Estágio 1 (CID I10)"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Sinais Vitais */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Triagem & Sinais Vitais Aferidos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Pressão Arterial:</span>
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={e => setBloodPressure(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Temperatura:</span>
                    <input
                      type="text"
                      value={temperature}
                      onChange={e => setTemperature(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Freq. Cardíaca:</span>
                    <input
                      type="text"
                      value={heartRate}
                      onChange={e => setHeartRate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Peso:</span>
                    <input
                      type="text"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Anamnese & Queixas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Anamnese, Queixas Principais & Sintomas
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Relato do paciente, início dos sintomas, hábitos e fatores agravantes..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Prescrição Médica */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Prescrição Médica & Posologia (Medicamentos)
                </label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={e => setPrescription(e.target.value)}
                  placeholder="Ex: 1. Paracetamol 500mg - 1 comp de 8/8h por 3 dias se dor ou febre.&#10;2. Losartana Potássica 50mg - 1 comp pela manhã em jejum."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Solicitação de Exames */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requisição de Exames Físicos, Laboratório & Ecografia
                </label>
                <textarea
                  rows={2}
                  value={labExamOrders}
                  onChange={e => setLabExamOrders(e.target.value)}
                  placeholder="Ex: Hemograma completo, glicemia de jejum, ecografia abdominal total, sumário de urina..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Observações / Evolução */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Evolução Clínica & Conduta do Médico
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Orientações de estilo de vida, retorno programado para reavaliação em 30 dias..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Prontuário & Concluir Consulta</span>
                </button>
              </div>
            </form>

            {/* List of Recent Prontuários */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
              <h4 className="font-bold text-sm text-slate-900">
                Histórico de Prontuários Registrados no Sistema ({medicalRecords.length})
              </h4>
              <div className="space-y-3">
                {medicalRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{rec.patientName}</span>
                      <span className="text-slate-400 font-normal">{rec.date}</span>
                    </div>
                    <div className="text-teal-700 font-semibold">
                      Diagnóstico: {rec.diagnosis}
                    </div>
                    {rec.prescription && (
                      <p className="text-slate-600">Prescrição: {rec.prescription}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
