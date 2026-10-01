import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Building2,
  FileCheck2,
  BellRing,
  Video,
  HeartHandshake,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    setIsBookingModalOpen,
    setActiveTab,
    appointments
  } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white pt-10 pb-16 lg:py-20">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 shadow-xs">
                <img
                  src="/caritas_logo.png"
                  alt="Logo Cáritas Oficial"
                  className="w-4 h-4 object-contain"
                />
                <span>Cáritas de Angola • Projeto Pró-Vida</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
                Atendimento Humanizado & Acolhimento de Excelência
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              Saúde de Excelência para Todas as Famílias com o{' '}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                Projeto Pró-Vida
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Agende sua consulta nos nossos <strong className="text-white">3 Centros Médicos de Referência</strong>:
              Mamã Muxima, Santo André e Santa Ana. Acompanhe prontuários, receba lembretes por SMS e E-mail e baixe seu comprovativo oficial em PDF.
            </p>

            {/* Quick feature pill grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                <FileCheck2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>PDF com QR Code no Ato</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lembrete SMS & E-mail</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sem Filas de Espera</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                <span>Marcar Consulta Agora</span>
              </button>

              <button
                onClick={() => setActiveTab('centers')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl flex items-center gap-2 transition-all"
              >
                <Building2 className="w-5 h-5 text-teal-300" />
                <span>Ver os 3 Centros</span>
              </button>

              <button
                onClick={() => setActiveTab('telemedicine')}
                className="bg-teal-900/60 hover:bg-teal-900/80 text-teal-200 border border-teal-500/30 font-semibold text-sm sm:text-base px-4 py-3.5 rounded-xl flex items-center gap-2 transition-all"
              >
                <Video className="w-5 h-5 text-teal-300" />
                <span>Telemedicina (Em Breve)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Card Preview */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                    Rede Pró-Vida Conectada
                  </span>
                  <h3 className="text-lg font-bold text-white">3 Centros em Funcionamento</h3>
                </div>
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              </div>

              {/* 3 Centers Quick List */}
              <div className="space-y-3">
                <div
                  onClick={() => setActiveTab('centers')}
                  className="group cursor-pointer p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        Mamã Muxima (Ingombota)
                      </h4>
                      <p className="text-xs text-slate-400">Pediátrico, Geral, Ecografia e Análises</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                    Aberto
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('centers')}
                  className="group cursor-pointer p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        Santo André (Kilamba / Belas)
                      </h4>
                      <p className="text-xs text-slate-400">Pré-Natal, Ginecologia e Saúde da Mulher</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                    Aberto
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('centers')}
                  className="group cursor-pointer p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        Santa Ana (Palanca)
                      </h4>
                      <p className="text-xs text-slate-400">Urologia, Triagem e Exames Físicos</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                    Aberto
                  </span>
                </div>
              </div>

              {/* Live Metric Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-900/60 to-emerald-900/60 border border-teal-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-teal-300 font-medium">Consultas Realizadas este mês</div>
                  <div className="text-xl font-extrabold text-white">642 Atendimentos</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-300 font-medium">Marcações Ativas</div>
                  <div className="text-lg font-bold text-emerald-200">
                    {appointments.filter(a => a.status === 'confirmed').length} na Rede
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
