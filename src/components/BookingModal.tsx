import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalCenterId, ServiceType, Doctor, Appointment } from '../types';
import { generateAppointmentPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Building,
  Stethoscope,
  CheckCircle2,
  Download,
  BellRing,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Share2,
  Video
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    centers,
    services,
    doctors,
    currentUser,
    bookAppointment,
    selectedCenterForBooking,
    setSelectedCenterForBooking,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    doctorSchedules,
    setActiveTab,
    showToast
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [centerId, setCenterId] = useState<MedicalCenterId>(selectedCenterForBooking || 'mama-muxima');
  const [serviceId, setServiceId] = useState<ServiceType>(selectedServiceForBooking || 'clinica-geral');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientDocument, setPatientDocument] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [reminderSms, setReminderSms] = useState<boolean>(true);
  const [reminderEmail, setReminderEmail] = useState<boolean>(true);
  const [isTelemedicine, setIsTelemedicine] = useState<boolean>(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Sync initial pre-selections
  useEffect(() => {
    if (selectedCenterForBooking) {
      setCenterId(selectedCenterForBooking);
    }
    if (selectedServiceForBooking) {
      setServiceId(selectedServiceForBooking);
    }
  }, [selectedCenterForBooking, selectedServiceForBooking, isBookingModalOpen]);

  // Set default patient info from logged in user if patient
  useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name || '');
      setPatientPhone(currentUser.phone || '+244 923 000 000');
      setPatientEmail(currentUser.email || 'paciente@email.com');
      setPatientDocument(currentUser.documentId || '006892341LA042');
    }
  }, [currentUser, isBookingModalOpen]);

  // Calculate matching doctors for selected service and center
  const matchingDoctors = doctors.filter(doc => {
    const matchesService =
      doc.specialty === serviceId ||
      (serviceId === 'pre-natal' && doc.specialty === 'pre-natal') ||
      (serviceId === 'ginecologia' && (doc.specialty === 'pre-natal' || doc.id === 'doc-3')) ||
      (serviceId === 'urologia' && (doc.specialty === 'urologia' || doc.id === 'doc-1')) ||
      (serviceId === 'clinica-geral' && (doc.specialty === 'clinica-geral' || doc.id === 'doc-1'));
    return matchesService;
  });

  // Pick default doctor if none selected
  useEffect(() => {
    if (matchingDoctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(matchingDoctors[0].id);
    }
  }, [matchingDoctors, selectedDoctorId]);

  // Available dates (next 7 working days)
  const availableDates = [
    { label: 'Hoje / Urgência', value: new Date().toISOString().split('T')[0] },
    {
      label: 'Amanhã',
      value: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    },
    {
      label: 'Em 2 dias',
      value: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    },
    {
      label: 'Em 3 dias',
      value: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    },
    {
      label: 'Em 4 dias',
      value: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
    },
    {
      label: 'Próxima Semana',
      value: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    }
  ];

  // Set default date
  useEffect(() => {
    if (!selectedDate && availableDates.length > 1) {
      setSelectedDate(availableDates[1].value);
    }
  }, [selectedDate]);

  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || matchingDoctors[0];
  const activeCenter = centers.find(c => c.id === centerId);
  const activeService = services.find(s => s.id === serviceId);

  // Time slots for selected doctor
  const availableSlots = activeDoctor
    ? (doctorSchedules[activeDoctor.id] || activeDoctor.timeSlots)
    : ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'];

  useEffect(() => {
    if (availableSlots.length > 0 && !selectedTime) {
      setSelectedTime(availableSlots[0]);
    }
  }, [availableSlots, selectedTime]);

  if (!isBookingModalOpen) return null;

  const handleNextStep = () => {
    if (step === 1) {
      if (!centerId || !serviceId) {
        alert('Por favor, selecione um centro médico e a especialidade.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTime) {
        alert('Por favor, selecione a data e o horário desejado.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!patientName.trim() || !patientPhone.trim()) {
        alert('Por favor, informe ao menos o nome completo e telefone para SMS.');
        return;
      }
      setStep(4);
    }
  };

  const handleConfirmBooking = () => {
    const apt = bookAppointment({
      patientId: currentUser.id || 'pat-guest',
      patientName: patientName || currentUser.name,
      patientEmail: patientEmail || 'paciente@email.com',
      patientPhone: patientPhone || '+244 923 000 000',
      patientDocument: patientDocument || '006892341LA042',
      centerId,
      centerName: activeCenter?.name || 'Centro Médico Pró-Vida',
      serviceId,
      serviceName: activeService?.name || 'Consulta Médica',
      doctorId: activeDoctor?.id || 'doc-1',
      doctorName: activeDoctor?.name || 'Corpo Clínico Pró-Vida',
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      notes: notes.trim(),
      reminderSms,
      reminderEmail,
      isTelemedicine
    });

    setCreatedAppointment(apt);
    setStep(5);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadPDF = () => {
    if (createdAppointment) {
      generateAppointmentPDF(
        createdAppointment,
        activeCenter,
        activeService,
        activeDoctor
      );
      showToast('📄 PDF do comprovativo gerado com sucesso!');
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setSelectedCenterForBooking(undefined);
    setSelectedServiceForBooking(undefined);
    setStep(1);
    setCreatedAppointment(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
              <img
                src="/caritas_logo.png"
                alt="Logo Oficial Cáritas Pró-Vida"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300">
                PROJETO PRÓ-VIDA • CÁRITAS
              </span>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Marcação de Consulta & Exames
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper indicator */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Centro & Serviço</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Médico & Data</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Dados Pessoais</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-teal-700 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>4</span>
              <span>Lembretes</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Center & Service */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-teal-600" />
                  1. Escolha o Centro Médico Pró-Vida
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {centers.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setCenterId(c.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        centerId === c.id
                          ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-teal-700 uppercase">
                          {c.id === 'mama-muxima' ? 'Ingombota / Praia do Bispo' : c.id === 'santo-andre' ? 'Kilamba / Belas' : 'Palanca / Kilamba Kiaxi'}
                        </span>
                        {centerId === c.id && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{c.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  2. Escolha a Especialidade ou Exame Físico
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                        serviceId === s.id
                          ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900">{s.name}</h4>
                          {s.isExameFisico && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                              Exame
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {s.shortDescription}
                        </p>
                      </div>
                      {serviceId === s.id && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {activeService?.requirements && activeService.requirements.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Aviso de Preparo Prévio:</span>
                    <p className="text-[11px] mt-0.5">{activeService.requirements[0]}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Doctor, Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Médico Responsável Disponível
                </label>
                {matchingDoctors.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600">
                    O plantão clínico do centro acolherá seu atendimento com especialista no dia agendado.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          selectedDoctorId === doc.id
                            ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/20"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                          <p className="text-[11px] text-teal-700 font-medium">{doc.specialtyName}</p>
                          <p className="text-[10px] text-slate-400">{doc.licenseNumber}</p>
                        </div>
                        {selectedDoctorId === doc.id && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Selecione a Data
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableDates.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDate(item.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedDate === item.value
                          ? 'border-teal-600 bg-teal-600 text-white font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wide opacity-80">{item.label}</div>
                      <div className="text-xs font-bold">{item.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Horários Disponíveis no Centro
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedTime === slot
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Telemedicina toggle */}
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Video className="w-5 h-5 text-teal-700" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Deseja atendimento por Telemedicina (Virtual)?
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Caso prefira consulta remota por vídeo em vez de deslocamento físico.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isTelemedicine}
                  onChange={e => setIsTelemedicine(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Patient Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3 text-xs text-teal-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-700" />
                <span>
                  Os dados preenchidos serão utilizados no Prontuário Clínico e no Comprovativo em PDF.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Ex: Ana Paula da Silva"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nº do Bilhete de Identidade / Cédula *
                  </label>
                  <input
                    type="text"
                    value={patientDocument}
                    onChange={e => setPatientDocument(e.target.value)}
                    placeholder="Ex: 006892341LA042"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Telefone para Lembrete SMS *
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="Ex: +244 923 456 789"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    Correio Eletrónico (E-mail)
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    placeholder="Ex: paciente@email.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sintomas ou Motivo Principal da Consulta (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Descreva brevemente o que está sentindo, dor, febre, acompanhamento rotineiro ou exames solicitados..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Reminders & Final Confirmation */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Resumo do Agendamento
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Centro Médico:</span>
                    <strong className="text-slate-900">{activeCenter?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Especialidade:</span>
                    <strong className="text-teal-700">{activeService?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Médico(a):</span>
                    <strong className="text-slate-900">{activeDoctor?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Data e Horário:</span>
                    <strong className="text-emerald-700">{selectedDate} às {selectedTime}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Paciente:</span>
                    <strong className="text-slate-900">{patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Modalidade:</span>
                    <strong className="text-slate-900">{isTelemedicine ? 'Telemedicina Virtual' : 'Presencial'}</strong>
                  </div>
                </div>
              </div>

              {/* Reminders section */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white shadow-xs">
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-teal-600" />
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Configuração de Notificações de Lembrete
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  O Projeto Pró-Vida dispara lembretes automáticos para que não perca o horário de atendimento.
                </p>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={reminderSms}
                      onChange={e => setReminderSms(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Lembrete por SMS Gratuito</span>
                      <span className="text-slate-500 text-[11px]">
                        Envia mensagem para <strong>{patientPhone}</strong> 24h e 2h antes.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={reminderEmail}
                      onChange={e => setReminderEmail(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">Confirmação e Ficha por E-mail</span>
                      <span className="text-slate-500 text-[11px]">
                        Envia instruções completas e comprovativo para <strong>{patientEmail}</strong>.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success & PDF Download */}
          {step === 5 && createdAppointment && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Agendamento Confirmado com Sucesso!
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Protocolo: {createdAppointment.protocolNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Guardado com sucesso no sistema integrado dos Centros Médicos Pró-Vida.
                </p>
              </div>

              {/* Protocol Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Unidade:</span>
                  <strong className="text-slate-900">{createdAppointment.centerName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Especialidade:</span>
                  <strong className="text-teal-700">{createdAppointment.serviceName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Data e Hora:</span>
                  <strong className="text-slate-900">{createdAppointment.date} às {createdAppointment.time}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lembretes:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SMS & E-mail Ativados
                  </span>
                </div>
              </div>

              {/* Action Buttons: PDF Download */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF da Marcação</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('patient-portal');
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all"
                >
                  Ver no Portal do Paciente
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Pode baixar o comprovativo em PDF a qualquer momento também pelo Portal do Paciente.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <span />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                Próximo Passo
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Marcação & Disparar Lembretes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
