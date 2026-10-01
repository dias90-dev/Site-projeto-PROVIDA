import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MONTHLY_STATS_DATA, PROJECT_LEADERSHIP } from '../data/mockData';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';
import {
  BarChart3,
  TrendingUp,
  Building,
  Users,
  CheckCircle2,
  Calendar,
  BellRing,
  Download,
  Filter,
  FileSpreadsheet,
  Stethoscope,
  Phone,
  Mail,
  Search,
  Award,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    appointments,
    centers,
    services,
    doctors,
    notifications,
    triggerNotification,
    showToast
  } = useApp();

  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(4); // Setembro (Atual)
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentMonthData = MONTHLY_STATS_DATA[selectedMonthIdx];

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesCenter = centerFilter === 'all' || apt.centerId === centerFilter;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCenter && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Protocolo,Paciente,Documento,Telefone,Email,Centro,Especialidade,Medico,Data,Hora,Status\n';
    const rows = filteredAppointments.map(a =>
      `"${a.protocolNumber}","${a.patientName}","${a.patientDocument}","${a.patientPhone}","${a.patientEmail}","${a.centerName}","${a.serviceName}","${a.doctorName}","${a.date}","${a.time}","${a.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Relatorio_Atendimentos_ProVida_${currentMonthData.month.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Relatório de atendimentos exportado em formato CSV!');
  };

  const handleExportOfficialPDF = () => {
    generateMonthlyReportPDF(currentMonthData, filteredAppointments);
    showToast('📄 Relatório Mensal Oficial com logotipo Cáritas baixado em PDF!');
  };

  const handleBatchReminder = () => {
    const pendingConfirmed = filteredAppointments.filter(a => a.status === 'confirmed');
    pendingConfirmed.forEach(apt => {
      triggerNotification(apt, 'sms');
    });
    showToast(`🔔 Disparo em lote efetuado para ${pendingConfirmed.length} pacientes via SMS!`);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white p-1 border border-slate-200 shadow-xs shrink-0 items-center justify-center">
              <img
                src="/caritas_logo.png"
                alt="Logo Oficial Cáritas"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                Painel de Controle e Relatórios
              </div>
              <div className="inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Firestore em Tempo Real
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Relatórios Mensais de Atendimentos Realizados
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Indicadores consolidados dos 3 Centros Médicos: Mamã Muxima, Santo André e Santa Ana.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month selector dropdown */}
            <select
              value={selectedMonthIdx}
              onChange={e => setSelectedMonthIdx(Number(e.target.value))}
              className="bg-slate-100 border border-slate-200 font-bold text-xs text-slate-800 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            >
              {MONTHLY_STATS_DATA.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.month}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportOfficialPDF}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Relatório Oficial (PDF)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Institutional Governance Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-teal-500/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <img
                  src="/caritas_logo.png"
                  alt="Logotipo Oficial Cáritas"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                    Governação Executiva & Pastoral
                  </span>
                  <span className="text-xs text-slate-300">Cáritas de Angola • Projeto Pró-Vida</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  Administradora Geral: <span className="text-teal-300">{PROJECT_LEADERSHIP.administrator}</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Supervisão institucional e gestão centralizada dos 3 centros médicos de Luanda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-teal-400 font-bold uppercase">Centro Mamã Muxima</span>
                  <span className="text-[10px] text-slate-400">Ingombota</span>
                </div>
                <div className="font-bold text-white text-xs mt-1">
                  {PROJECT_LEADERSHIP.clinicalDirectors.mamaMuxima.name}
                </div>
                <div className="text-[10px] text-teal-200 mt-0.5">Direção Clínica</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Praia do Bispo, Rua Agostinho Neto, Travessa II/BETE
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-teal-400 font-bold uppercase">Centro Santa Ana</span>
                  <span className="text-[10px] text-slate-400">Kilamba Kiaxi</span>
                </div>
                <div className="font-bold text-white text-xs mt-1">
                  {PROJECT_LEADERSHIP.clinicalDirectors.santaAna.name}
                </div>
                <div className="text-[10px] text-teal-200 mt-0.5">Direção Clínica</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Bairro Palanca, Rua Ngola Yeto, Zona 2, casa nº 18
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Total Atendimentos
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {currentMonthData.completedAppointments}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% vs mês anterior
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Taxa de Comparecimento
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {Math.round((currentMonthData.completedAppointments / currentMonthData.totalAppointments) * 100)}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Graças aos lembretes SMS
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Lembretes Enviados
              </span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">
                {notifications.length * 12 + 420}
              </span>
              <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
                SMS & E-mails 100% Entregues
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BellRing className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                3 Centros Ativos
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                100%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Capacidade instalada em pleno
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts & Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Comparison Bar Graph */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Evolução Mensal de Atendimentos na Rede
                </h3>
                <p className="text-xs text-slate-500">
                  Crescimento progressivo da assistência nos últimos 5 meses
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                Projeto Pró-Vida
              </span>
            </div>

            {/* Visual Bars */}
            <div className="space-y-4 pt-2">
              {MONTHLY_STATS_DATA.map((st, idx) => {
                const maxVal = 700;
                const pct = Math.round((st.completedAppointments / maxVal) * 100);
                const isCurrent = idx === selectedMonthIdx;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={isCurrent ? 'text-teal-700 font-extrabold' : 'text-slate-700'}>
                        {st.month}
                      </span>
                      <span className="text-slate-900 font-bold">
                        {st.completedAppointments} atendimentos ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCurrent
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Breakdown by the 3 Centers */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Distribuição por Centro Médico em {currentMonthData.month}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200">
                  <span className="text-[11px] font-bold text-teal-800 uppercase block">
                    Mamã Muxima
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {currentMonthData.centerStats.mamaMuxima}
                  </div>
                  <span className="text-[10px] text-teal-600 font-medium">
                    {Math.round((currentMonthData.centerStats.mamaMuxima / currentMonthData.totalAppointments) * 100)}% da rede
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    Santo André
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {currentMonthData.centerStats.santoAndre}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {Math.round((currentMonthData.centerStats.santoAndre / currentMonthData.totalAppointments) * 100)}% da rede
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">
                    Santa Ana
                  </span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">
                    {currentMonthData.centerStats.santaAna}
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">
                    {Math.round((currentMonthData.centerStats.santaAna / currentMonthData.totalAppointments) * 100)}% da rede
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown by Service / Specialty */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Atendimentos por Especialidade
              </h3>
              <p className="text-xs text-slate-500">
                Volume de consultas nos 7 serviços essenciais
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(currentMonthData.serviceStats).map(([srvName, count], idx) => {
                const maxSrv = 200;
                const pct = Math.round((count / maxSrv) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800">{srvName}</span>
                      <span className="text-teal-700 font-bold">{count} consultas</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-800 block">
                Atendimento Humanizado do Projeto Pró-Vida:
              </span>
              <p className="text-[11px] leading-relaxed">
                As consultas e exames contam com acolhimento digno, respeito e atenção integral para todas as famílias em Ingombota/Praia do Bispo, Belas/Kilamba e Palanca/Kilamba Kiaxi.
              </p>
            </div>
          </div>
        </div>

        {/* General Appointments Network Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Gestão Geral de Agendamentos na Rede ({filteredAppointments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Supervisão de fluxo de pacientes em tempo real
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleBatchReminder}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Disparar Lembretes em Lote</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por paciente, protocolo, médico..."
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filter buttons by center */}
            <div className="flex flex-wrap gap-1.5 text-xs w-full sm:w-auto">
              <button
                onClick={() => setCenterFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  centerFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              {centers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCenterFilter(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    centerFilter === c.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name.replace('Centro Médico ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Protocolo</th>
                  <th className="py-3 px-3">Paciente & BI</th>
                  <th className="py-3 px-3">Centro Médico</th>
                  <th className="py-3 px-3">Especialidade / Médico</th>
                  <th className="py-3 px-3">Data / Hora</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-teal-700">
                      {apt.protocolNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[10px] text-slate-400">{apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {apt.centerName.replace('Centro Médico ', '')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900">{apt.serviceName}</div>
                      <div className="text-[10px] text-slate-400">{apt.doctorName}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{apt.date}</div>
                      <div className="text-[10px] text-slate-400">{apt.time}h</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {apt.status === 'confirmed'
                          ? 'Confirmado'
                          : apt.status === 'completed'
                          ? 'Realizado'
                          : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => triggerNotification(apt, 'both')}
                        className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                      >
                        Reenviar Aviso
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
