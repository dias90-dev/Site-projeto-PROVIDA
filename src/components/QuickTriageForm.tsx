import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, QuickTriageData, TriagePriorityLevel, MedicalCenterId } from '../types';
import { generateTriagePDF } from '../utils/pdfGenerator';
import {
  Activity,
  Heart,
  Thermometer,
  Scale,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Building,
  User,
  X,
  Stethoscope,
  Info,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface QuickTriageFormProps {
  initialAppointment?: Appointment | null;
  onClose?: () => void;
  isEmbedded?: boolean; // If rendered directly in a dashboard tab
}

export const QuickTriageForm: React.FC<QuickTriageFormProps> = ({
  initialAppointment,
  onClose,
  isEmbedded = false
}) => {
  const {
    currentUser,
    appointments,
    centers,
    saveQuickTriage,
    showToast
  } = useApp();

  // Filter available appointments for the current user
  const userAppointments = appointments.filter(apt => {
    if (currentUser.role === 'patient') {
      return apt.patientId === currentUser.id || apt.patientEmail === currentUser.email;
    }
    return true;
  });

  const [selectedAptId, setSelectedAptId] = useState<string>(
    initialAppointment?.id || (userAppointments.length > 0 ? userAppointments[0].id : '')
  );

  const selectedAppointment = appointments.find(a => a.id === selectedAptId) || initialAppointment;

  // Form Fields State
  const [weight, setWeight] = useState<string>(
    selectedAppointment?.triage ? String(selectedAppointment.triage.weight) : '65.0'
  );
  const [height, setHeight] = useState<string>(
    selectedAppointment?.triage?.height ? String(selectedAppointment.triage.height) : '168'
  );
  const [temperature, setTemperature] = useState<string>(
    selectedAppointment?.triage ? String(selectedAppointment.triage.temperature) : '36.5'
  );
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState<string>(
    selectedAppointment?.triage?.bloodPressureSystolic ? String(selectedAppointment.triage.bloodPressureSystolic) : '120'
  );
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState<string>(
    selectedAppointment?.triage?.bloodPressureDiastolic ? String(selectedAppointment.triage.bloodPressureDiastolic) : '80'
  );
  const [heartRate, setHeartRate] = useState<string>(
    selectedAppointment?.triage?.heartRate ? String(selectedAppointment.triage.heartRate) : '72'
  );
  const [oxygenSaturation, setOxygenSaturation] = useState<string>(
    selectedAppointment?.triage?.oxygenSaturation ? String(selectedAppointment.triage.oxygenSaturation) : '98'
  );
  const [bloodGlucose, setBloodGlucose] = useState<string>(
    selectedAppointment?.triage?.bloodGlucose ? String(selectedAppointment.triage.bloodGlucose) : ''
  );
  const [painLevel, setPainLevel] = useState<number>(
    selectedAppointment?.triage?.painLevel ?? 1
  );
  const [mainSymptoms, setMainSymptoms] = useState<string>(
    selectedAppointment?.triage?.mainSymptoms || selectedAppointment?.notes || ''
  );
  const [symptomDuration, setSymptomDuration] = useState<string>(
    selectedAppointment?.triage?.symptomDuration || 'Há 2 a 3 dias'
  );
  const [allergies, setAllergies] = useState<string>(
    selectedAppointment?.triage?.allergies || 'Nenhuma alergia conhecida'
  );
  const [currentMedications, setCurrentMedications] = useState<string>(
    selectedAppointment?.triage?.currentMedications || 'Nenhum medicamento contínuo'
  );
  const [priorityLevel, setPriorityLevel] = useState<TriagePriorityLevel>(
    selectedAppointment?.triage?.priorityLevel || 'verde'
  );
  const [observations, setObservations] = useState<string>(
    selectedAppointment?.triage?.observations || ''
  );

  const [savedTriageResult, setSavedTriageResult] = useState<QuickTriageData | null>(
    selectedAppointment?.triage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user selects another appointment, sync pre-filled triage if present
  useEffect(() => {
    if (selectedAppointment?.triage) {
      const t = selectedAppointment.triage;
      setWeight(String(t.weight));
      if (t.height) setHeight(String(t.height));
      setTemperature(String(t.temperature));
      setBloodPressureSystolic(String(t.bloodPressureSystolic));
      setBloodPressureDiastolic(String(t.bloodPressureDiastolic));
      if (t.heartRate) setHeartRate(String(t.heartRate));
      if (t.oxygenSaturation) setOxygenSaturation(String(t.oxygenSaturation));
      if (t.bloodGlucose) setBloodGlucose(String(t.bloodGlucose));
      setPainLevel(t.painLevel ?? 0);
      if (t.mainSymptoms) setMainSymptoms(t.mainSymptoms);
      if (t.symptomDuration) setSymptomDuration(t.symptomDuration);
      if (t.allergies) setAllergies(t.allergies);
      if (t.currentMedications) setCurrentMedications(t.currentMedications);
      if (t.priorityLevel) setPriorityLevel(t.priorityLevel);
      if (t.observations) setObservations(t.observations);
      setSavedTriageResult(t);
    }
  }, [selectedAptId]);

  // Derived Calculations
  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;
  const numTemp = parseFloat(temperature) || 36.5;
  const numSys = parseInt(bloodPressureSystolic) || 120;
  const numDia = parseInt(bloodPressureDiastolic) || 80;

  // BMI Calculation
  let bmiValue: string = '';
  let bmiCategory: string = 'Normal';
  if (numWeight > 0 && numHeight > 0) {
    const hInMeters = numHeight / 100;
    const rawBmi = numWeight / (hInMeters * hInMeters);
    bmiValue = rawBmi.toFixed(1);
    if (rawBmi < 18.5) bmiCategory = 'Abaixo do peso';
    else if (rawBmi < 25) bmiCategory = 'Peso Normal';
    else if (rawBmi < 30) bmiCategory = 'Sobrepeso';
    else bmiCategory = 'Obesidade';
  }

  // Temperature Status
  let tempStatus: 'normal' | 'febril' | 'febre_alta' = 'normal';
  let tempLabel = 'Temperatura Normal (Afebril)';
  let tempColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (numTemp >= 38.5) {
    tempStatus = 'febre_alta';
    tempLabel = 'Febre Alta (Requer atenção rápida)';
    tempColor = 'text-red-700 bg-red-50 border-red-200';
  } else if (numTemp >= 37.3) {
    tempStatus = 'febril';
    tempLabel = 'Estado Febril (Subfebril)';
    tempColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  // Blood Pressure Status
  let bpStatus: 'otima' | 'normal' | 'pre_hipertensao' | 'hipertensao_1' | 'hipertensao_2' | 'hipotensao' = 'normal';
  let bpLabel = 'Pressão Arterial Normal';
  let bpColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (numSys < 90 || numDia < 60) {
    bpStatus = 'hipotensao';
    bpLabel = 'Hipotensão Arterial (Pressão Baixa)';
    bpColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (numSys < 120 && numDia < 80) {
    bpStatus = 'otima';
    bpLabel = 'Pressão Arterial Ótima (<120/80)';
    bpColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (numSys <= 129 && numDia <= 84) {
    bpStatus = 'normal';
    bpLabel = 'Pressão Normal';
    bpColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (numSys <= 139 || numDia <= 89) {
    bpStatus = 'pre_hipertensao';
    bpLabel = 'Pré-hipertensão (Limítrofe)';
    bpColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (numSys <= 159 || numDia <= 99) {
    bpStatus = 'hipertensao_1';
    bpLabel = 'Hipertensão Estágio 1 (Moderada)';
    bpColor = 'text-orange-700 bg-orange-50 border-orange-200';
  } else {
    bpStatus = 'hipertensao_2';
    bpLabel = 'Hipertensão Estágio 2 (Elevada)';
    bpColor = 'text-red-700 bg-red-50 border-red-200';
  }

  // Auto recommend priority if high fever or very high BP or severe pain
  useEffect(() => {
    if (numTemp >= 38.5 || numSys >= 160 || numDia >= 100 || painLevel >= 8) {
      setPriorityLevel('laranja');
    } else if (numTemp >= 37.5 || numSys >= 140 || numDia >= 90 || painLevel >= 5) {
      setPriorityLevel('amarelo');
    } else {
      setPriorityLevel('verde');
    }
  }, [numTemp, numSys, numDia, painLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight || !temperature || !bloodPressureSystolic || !bloodPressureDiastolic) {
      alert('Por favor preencha os sinais vitais básicos: Peso, Temperatura e Pressão Arterial.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bpString = `${bloodPressureSystolic}/${bloodPressureDiastolic} mmHg`;
      const todayDate = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

      const triageData: Omit<QuickTriageData, 'id' | 'submittedAt'> = {
        appointmentId: selectedAppointment?.id,
        protocolNumber: selectedAppointment?.protocolNumber || `PV-TR-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: currentUser.id || 'user-patient',
        patientName: currentUser.name || selectedAppointment?.patientName || 'Paciente Pró-Vida',
        patientPhone: currentUser.phone || selectedAppointment?.patientPhone,
        patientDocument: currentUser.documentId || selectedAppointment?.patientDocument,
        centerId: selectedAppointment?.centerId as MedicalCenterId || 'mama-muxima',
        centerName: selectedAppointment?.centerName || 'Centro Médico Mamã Muxima',
        serviceId: selectedAppointment?.serviceId,
        serviceName: selectedAppointment?.serviceName || 'Clínica Geral & Triagem',
        date: selectedAppointment?.date || todayDate,
        time: selectedAppointment?.time || nowTime,
        weight: numWeight,
        height: numHeight || undefined,
        bmi: bmiValue || undefined,
        bmiCategory,
        temperature: numTemp,
        temperatureStatus: tempStatus,
        bloodPressureSystolic: numSys,
        bloodPressureDiastolic: numDia,
        bloodPressure: bpString,
        bloodPressureStatus: bpStatus,
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : undefined,
        bloodGlucose: bloodGlucose ? parseFloat(bloodGlucose) : undefined,
        painLevel,
        mainSymptoms: mainSymptoms.trim() || 'Aferição preventiva pré-consulta.',
        symptomDuration,
        allergies: allergies.trim() || 'Nenhuma relatada',
        currentMedications: currentMedications.trim() || 'Nenhum',
        priorityLevel,
        observations: observations.trim() || 'Triagem rápida prévia preenchida pelo paciente.'
      };

      const result = await saveQuickTriage(triageData);
      setSavedTriageResult(result);
      showToast('🎉 Ficha de Triagem Rápida registada com sucesso!');
    } catch (err) {
      console.error('Erro ao guardar triagem:', err);
      alert('Ocorreu um erro ao guardar a triagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!savedTriageResult) return;
    generateTriagePDF(savedTriageResult);
    showToast('📄 PDF da Ficha de Triagem baixado com sucesso!');
  };

  return (
    <div className={isEmbedded ? 'space-y-6' : 'bg-white rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200'}>
      {/* Header bar */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 tracking-wider">
                Projeto Pró-Vida • Cáritas
              </span>
              <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                Triagem Pré-Consulta
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Ficha de Triagem Rápida
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Registe seus sinais vitais básicos antes da consulta para agilizar o acolhimento médico nos centros Mamã Muxima, Santo André e Santa Ana.
            </p>
          </div>
        </div>

        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Success Notification if already submitted */}
      {savedTriageResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-emerald-900 block">
                Triagem Rápida Registada e Sincronizada!
              </strong>
              <p className="text-xs text-emerald-800 mt-0.5">
                Os sinais vitais (PA {savedTriageResult.bloodPressure}, Tº {savedTriageResult.temperature}ºC, Peso {savedTriageResult.weight}kg) estão visíveis no prontuário do seu médico.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Ficha em PDF</span>
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Appointment selector */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              1. Selecionar Consulta Agendada (Pré-Atendimento)
            </label>
            <span className="text-[11px] text-slate-400">
              {userAppointments.length} agendamentos disponíveis
            </span>
          </div>

          {userAppointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userAppointments.map(apt => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAptId(apt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedAptId === apt.id
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-teal-800">{apt.serviceName}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {apt.protocolNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Médico: {apt.doctorName}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {apt.date} às {apt.time}
                    </span>
                    <span className="text-teal-700 font-semibold">{apt.centerName}</span>
                  </div>
                  {apt.triage && (
                    <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Triagem já preenchida (PA: {apt.triage.bloodPressure})
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <strong className="text-slate-800 block">Triagem Geral Independente</strong>
                <span>Você pode registar seus sinais vitais avulsos para acompanhamento preventivo.</span>
              </div>
              <span className="text-xs font-bold text-teal-700 px-2.5 py-1 bg-teal-50 rounded-lg">
                Modo Aferição Livre
              </span>
            </div>
          )}
        </div>

        {/* Step 2: Three Main Vital Signs (Peso, Temperatura, Pressão Arterial) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              2. Sinais Vitais Básicos (Obrigatórios)
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Validação Clínica Imediata
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Peso Corporal */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-teal-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Peso Corporal (kg)
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Kg</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="300"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full text-2xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="65.0"
                  required
                />
              </div>

              {/* Quick weight adjustment pills */}
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setWeight((prev) => (Math.max(10, (parseFloat(prev) || 60) - 1)).toFixed(1))}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  -1 kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeight('60.0')}
                  className="px-1.5 py-1 text-slate-500 hover:text-teal-700 text-[10px]"
                >
                  60
                </button>
                <button
                  type="button"
                  onClick={() => setWeight('70.0')}
                  className="px-1.5 py-1 text-slate-500 hover:text-teal-700 text-[10px]"
                >
                  70
                </button>
                <button
                  type="button"
                  onClick={() => setWeight('80.0')}
                  className="px-1.5 py-1 text-slate-500 hover:text-teal-700 text-[10px]"
                >
                  80
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => ((parseFloat(prev) || 60) + 1).toFixed(1))}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  +1 kg
                </button>
              </div>

              {/* Height and calculated BMI */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Altura (cm):</span>
                  <input
                    type="number"
                    min="50"
                    max="230"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-16 text-right px-1.5 py-0.5 text-xs font-bold bg-slate-100 rounded border border-slate-200"
                    placeholder="168"
                  />
                </div>
                {bmiValue && (
                  <div className="flex items-center justify-between text-[11px] bg-teal-50/60 p-1.5 rounded-lg border border-teal-100">
                    <span className="text-teal-900 font-semibold">IMC: {bmiValue} kg/m²</span>
                    <span className="font-bold text-teal-700">{bmiCategory}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Temperatura Corporal */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-teal-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Temperatura (ºC)
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Graus Celsius</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="34"
                  max="43"
                  value={temperature}
                  onChange={e => setTemperature(e.target.value)}
                  className="w-full text-2xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="36.5"
                  required
                />
              </div>

              {/* Status pill */}
              <div className={`p-2 rounded-xl border text-center text-xs font-bold ${tempColor}`}>
                {tempLabel}
              </div>

              {/* Quick temp presets */}
              <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setTemperature('36.4')}
                  className="py-1 px-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium text-center"
                >
                  36.4 ºC
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('36.8')}
                  className="py-1 px-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium text-center"
                >
                  36.8 ºC
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('37.5')}
                  className="py-1 px-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-medium text-center"
                >
                  37.5 ºC
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Normal: 36.0 ºC a 37.2 ºC • Estado Febril: ≥ 37.3 ºC
              </p>
            </div>

            {/* 3. Pressão Arterial */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-teal-400 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-teal-600" />
                  Pressão Arterial (PA)
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">mmHg</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold mb-0.5 text-center">Sistólica</span>
                  <input
                    type="number"
                    min="50"
                    max="260"
                    value={bloodPressureSystolic}
                    onChange={e => setBloodPressureSystolic(e.target.value)}
                    className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="120"
                    required
                  />
                </div>
                <span className="text-xl font-bold text-slate-300 mt-4">/</span>
                <div className="flex-1">
                  <span className="block text-[10px] text-slate-400 font-semibold mb-0.5 text-center">Diastólica</span>
                  <input
                    type="number"
                    min="30"
                    max="160"
                    value={bloodPressureDiastolic}
                    onChange={e => setBloodPressureDiastolic(e.target.value)}
                    className="w-full text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              {/* Status pill */}
              <div className={`p-2 rounded-xl border text-center text-xs font-bold ${bpColor}`}>
                {bpLabel}
              </div>

              {/* Quick BP presets */}
              <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setBloodPressureSystolic('110');
                    setBloodPressureDiastolic('70');
                  }}
                  className="py-1 px-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium text-center"
                >
                  110/70
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBloodPressureSystolic('120');
                    setBloodPressureDiastolic('80');
                  }}
                  className="py-1 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-center"
                >
                  120/80
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBloodPressureSystolic('135');
                    setBloodPressureDiastolic('88');
                  }}
                  className="py-1 px-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-medium text-center"
                >
                  135/88
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Padrão OMS: Ótima &lt; 120/80 mmHg • Hipertensão: ≥ 140/90
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Complementary Vital Signs */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500" />
              3. Parâmetros Complementares (Frequência Cardíaca, Oximetria, Glicemia)
            </h3>
            <span className="text-[11px] text-slate-400">Opcional / Se aferido</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Heart Rate */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Freq. Cardíaca (Pulso)</span>
                <span className="text-[10px] text-slate-400">bpm</span>
              </label>
              <input
                type="number"
                min="40"
                max="220"
                value={heartRate}
                onChange={e => setHeartRate(e.target.value)}
                className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                placeholder="72"
              />
              <span className="text-[10px] text-slate-400 block">Normal repouso: 60 - 100 bpm</span>
            </div>

            {/* Oxygen saturation */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Saturação Oxigênio (SpO2)</span>
                <span className="text-[10px] text-slate-400">%</span>
              </label>
              <input
                type="number"
                min="70"
                max="100"
                value={oxygenSaturation}
                onChange={e => setOxygenSaturation(e.target.value)}
                className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                placeholder="98"
              />
              <span className="text-[10px] text-slate-400 block">Normal: 95% a 100%</span>
            </div>

            {/* Blood Glucose */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Glicemia Capilar (Jejum)</span>
                <span className="text-[10px] text-slate-400">mg/dL</span>
              </label>
              <input
                type="number"
                min="40"
                max="600"
                value={bloodGlucose}
                onChange={e => setBloodGlucose(e.target.value)}
                className="w-full text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                placeholder="95 (Opcional)"
              />
              <span className="text-[10px] text-slate-400 block">Jejum normal: 70 a 99 mg/dL</span>
            </div>
          </div>
        </div>

        {/* Step 4: Symptoms, Pain & Medication Screening */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            4. Triagem Clínica: Queixas, Duração e Escala de Dor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Queixa principal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Motivo / Queixa Principal do Paciente:
              </label>
              <textarea
                rows={3}
                value={mainSymptoms}
                onChange={e => setMainSymptoms(e.target.value)}
                placeholder="Ex: Consulta de rotina; sinto tontura leve ao levantar há 2 dias; verificação de tensão arterial..."
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Duração & Escala de Dor */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Início dos Sintomas:
                </label>
                <select
                  value={symptomDuration}
                  onChange={e => setSymptomDuration(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="Hoje (Menos de 24h)">Hoje (Menos de 24 horas)</option>
                  <option value="Há 2 a 3 dias">Há 2 a 3 dias</option>
                  <option value="Há cerca de 1 semana">Há cerca de 1 semana</option>
                  <option value="Há mais de 1 mês (Crônico)">Há mais de 1 mês (Quadro Crônico)</option>
                  <option value="Sem sintomas / Check-up Preventivo">Sem sintomas / Consulta Preventiva</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700">Nível de Dor Atual (0 a 10):</span>
                  <span className="font-black text-teal-800">
                    {painLevel === 0
                      ? '😊 0 - Sem dor'
                      : painLevel <= 3
                      ? `🙂 ${painLevel} - Dor Leve`
                      : painLevel <= 6
                      ? `😐 ${painLevel} - Dor Moderada`
                      : `😫 ${painLevel} - Dor Intensa`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={e => setPainLevel(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 Sem dor</span>
                  <span>5 Moderada</span>
                  <span>10 Severa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alergias e Remédios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Alergias Conhecidas (Medicamentos / Alimentos):
              </label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder="Ex: Penicilina, Dipirona, ou 'Nenhuma'"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Medicamentos de Uso Contínuo:
              </label>
              <input
                type="text"
                value={currentMedications}
                onChange={e => setCurrentMedications(e.target.value)}
                placeholder="Ex: Losartana 50mg, Metformina, ou 'Nenhum'"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Classificação de Risco (Manchester Simplificado) */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Protocolo de Triagem Pró-Vida
              </span>
              <span className="text-[11px] text-slate-400">Classificação Automática</span>
            </div>
            <strong className="text-base font-extrabold text-white block">
              Prioridade Atribuída: {priorityLevel === 'verde' ? 'Verde (Pouco Urgente)' : priorityLevel === 'amarelo' ? 'Amarelo (Urgente)' : 'Laranja (Muito Urgente)'}
            </strong>
            <p className="text-xs text-slate-400">
              {priorityLevel === 'verde'
                ? 'Sinais vitais estáveis. Atendimento no horário agendado com acolhimento padrão.'
                : priorityLevel === 'amarelo'
                ? 'Alteração moderada nos sinais vitais. A equipe médica dará prioridade no chamado da sala.'
                : 'Sinais vitais alterados! Apresente-se imediatamente à enfermagem na chegada ao centro médico.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setPriorityLevel('verde')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                priorityLevel === 'verde'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟢 Verde
            </button>
            <button
              type="button"
              onClick={() => setPriorityLevel('amarelo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                priorityLevel === 'amarelo'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟡 Amarelo
            </button>
            <button
              type="button"
              onClick={() => setPriorityLevel('laranja')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                priorityLevel === 'laranja'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟠 Laranja
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {savedTriageResult && (
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold py-3 px-4 rounded-xl flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-teal-700" />
              <span>Baixar Comprovativo em PDF</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onClose && !isEmbedded && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-bold transition-colors"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-extrabold py-3 px-6 rounded-xl shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Activity className="w-4 h-4" />
              <span>{isSubmitting ? 'A guardar triagem...' : 'Guardar Ficha de Triagem Rápida'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
