import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Wifi,
  ShieldCheck,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Send,
  Users
} from 'lucide-react';

export const TelemedicinePreview: React.FC = () => {
  const { setIsBookingModalOpen, showToast } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegisterWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail && !waitlistPhone) return;
    setIsRegistered(true);
    showToast('🎉 Inscrição registada! Será notificado(a) por SMS no lançamento da Telemedicina.');
  };

  return (
    <div className="py-12 bg-slate-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Inovação em Saúde Comunitária
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Telemedicina Pró-Vida{' '}
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              (Em Breve)
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Consultas médicas seguras por vídeo com os médicos especialistas dos Centros Mamã Muxima, Santo André e Santa Ana. Cuidado de saúde onde você estiver, sem necessidade de deslocamento.
          </p>
        </div>

        {/* Interactive Virtual Room Simulator */}
        <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Virtual Top Bar */}
          <div className="bg-slate-950/80 px-6 py-3.5 flex items-center justify-between border-b border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-slate-200">
                Simulador de Sala de Teleconsulta Pró-Vida
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Wifi className="w-3.5 h-3.5" /> Conexão Segura Criptografada
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-slate-300">Resolução HD 1080p</span>
            </div>
          </div>

          {/* Main Video Stage */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center p-6">
            {isVideoOn ? (
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                    alt="Dr. Manuel Domingos"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-teal-500/40 shadow-2xl mx-auto"
                  />
                  <span className="absolute bottom-1 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-900">
                    Online
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Dr. Manuel Domingos</h3>
                  <p className="text-xs text-teal-300 font-medium">Clínica Geral & Urologia • Pró-Vida</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isCalling
                      ? 'Em atendimento virtual demonstrativo...'
                      : 'Gabinete Virtual pronto para iniciar a consulta'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 text-slate-500">
                <VideoOff className="w-16 h-16 mx-auto" />
                <p className="text-xs">Sua câmara está desligada.</p>
              </div>
            )}

            {/* Floating Patient Pip (Picture in picture) */}
            <div className="absolute bottom-4 right-4 w-28 sm:w-36 aspect-video bg-slate-900/90 rounded-xl border border-white/20 p-2 flex items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-slate-300 font-medium">
                Você (Paciente)
              </span>
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="bg-slate-950 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isMicOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span>{isMicOn ? 'Microfone Ativo' : 'Microfone Mudo'}</span>
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
                  isVideoOn
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {isVideoOn ? <Video className="w-4 h-4 text-teal-400" /> : <VideoOff className="w-4 h-4" />}
                <span>{isVideoOn ? 'Vídeo Ligado' : 'Vídeo Desligado'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsCalling(!isCalling);
                  showToast(
                    isCalling
                      ? 'Demonstração de chamada encerrada.'
                      : 'Simulação iniciada! Áudio e vídeo testados com sucesso.'
                  );
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isCalling
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isCalling ? 'Desligar Teste' : 'Iniciar Teste de Chamada'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Receita Médica Digital com QR Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prescrições de medicamentos com assinatura digital aceitas em farmácias, enviadas instantaneamente por SMS e baixáveis em PDF.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sem Custos de Deslocamento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ideal para pacientes em zonas distantes de Luanda ou pessoas acamadas que precisam de triagem, retorno ou renovação de medicação.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mesmos Médicos de Referência</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seu prontuário eletrônico é integrado com as unidades físicas Mamã Muxima, Santo André e Santa Ana.
            </p>
          </div>
        </div>

        {/* Early Access / Priority Waitlist Form */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-teal-950 via-slate-800 to-teal-950 p-8 rounded-3xl border border-teal-500/30 text-center space-y-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Quer Ser dos Primeiros a Usufruir?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Cadastre seu telefone ou e-mail para receber um convite VIP e atendimento gratuito na primeira fase piloto da Telemedicina Pró-Vida.
            </p>
          </div>

          {isRegistered ? (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Obrigado! Seu contato foi registrado na lista de espera prioritária.</span>
            </div>
          ) : (
            <form onSubmit={handleRegisterWaitlist} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  value={waitlistPhone}
                  onChange={e => setWaitlistPhone(e.target.value)}
                  placeholder="Seu telefone (+244 9...)"
                  className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
                />
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-all"
              >
                Quero Acesso Prioritário Gratuito
              </button>
            </form>
          )}

          <div className="pt-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="text-xs text-teal-300 hover:underline font-semibold"
            >
              Ou marque agora uma consulta presencial em um dos 3 centros →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
