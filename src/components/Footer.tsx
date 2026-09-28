import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Video,
  FileCheck2,
  Calendar
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsBookingModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                PROJETO PRÓ-VIDA
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Iniciativa de saúde comunitária e hospitalar com foco no acolhimento digno, atendimento gratuito e subsidiado, agendamento digital com comprovativo em PDF e lembretes por SMS e E-mail.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                Hospedagem & Acolhimento Social
              </span>
            </div>
          </div>

          {/* Col 3: Os 3 Centros */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Nossos 3 Centros Médicos
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <strong className="text-slate-200 block">Mamã Muxima:</strong>
                <span>Av. Deolinda Rodrigues, Viana</span>
                <span className="text-teal-400 block text-[11px]">+244 923 112 233</span>
              </li>
              <li>
                <strong className="text-slate-200 block">Santo André:</strong>
                <span>Centralidade do Kilamba, Belas</span>
                <span className="text-teal-400 block text-[11px]">+244 924 556 677</span>
              </li>
              <li>
                <strong className="text-slate-200 block">Santa Ana:</strong>
                <span>Rua dos Comandos, Cazenga</span>
                <span className="text-teal-400 block text-[11px]">+244 925 889 900</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Serviços */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Especialidades & Exames
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Consulta de Pediatria</li>
              <li>Clínica Geral & Check-up</li>
              <li>Consulta de Pré-Natal</li>
              <li>Ginecologia Preventiva</li>
              <li>Urologia & Saúde do Homem</li>
              <li>Ecografia Digital de Imagem</li>
              <li>Laboratório para Exames Físicos</li>
            </ul>
          </div>

          {/* Col 5: Acesso Rápido */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Acesso Rápido
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Marcar Consulta Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('patient-portal')}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
                  Baixar PDF da Marcação
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('telemedicine')}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-teal-400" />
                  Telemedicina (Em Breve)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('doctor-portal')}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  Área Médica & Prontuários
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin-portal')}
                  className="hover:text-teal-300 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Relatórios Mensais da Rede
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © 2026 Projeto Pró-Vida. Todos os direitos reservados. Centros Médicos Mamã Muxima, Santo André e Santa Ana.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacidade & Sigilo Médico</span>
            <span>•</span>
            <span>Termos de Atendimento</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
