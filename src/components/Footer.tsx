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
  Calendar,
  Facebook,
  Instagram
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
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src="/caritas_logo.png"
                  alt="Logotipo Oficial Cáritas Pró-Vida"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">
                  PROJETO PRÓ-VIDA
                </span>
                <span className="text-[10px] text-red-400 font-bold tracking-wider uppercase">
                  CÁRITAS DE ANGOLA
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Iniciativa de saúde comunitária e hospitalar com foco no acolhimento digno, atendimento humanizado de excelência, agendamento digital com comprovativo em PDF e lembretes por SMS e E-mail.
            </p>

            <div className="pt-1">
              <span className="text-[11px] font-bold text-teal-300 block">
                Administradora do Projeto: <strong className="text-white">Irmã Ventura</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                Atendimento Humanizado & Acolhimento
              </span>
            </div>

            {/* Official Social Media Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Siga Nossas Redes Sociais:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://www.facebook.com/caritasdeangola"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Página Oficial do Facebook da Cáritas de Angola Projeto Pró-Vida"
                  className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:scale-105"
                >
                  <Facebook className="w-4 h-4 fill-white" />
                  <span>Facebook Oficial</span>
                </a>

                <a
                  href="https://www.instagram.com/caritasdeangola"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial da Cáritas de Angola @caritasdeangola"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm hover:scale-105"
                >
                  <Instagram className="w-4 h-4 text-white" />
                  <span>Instagram Oficial</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Os 3 Centros */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Nossos 3 Centros Médicos
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>
                <strong className="text-slate-200 block">Centro Médico Mamã Muxima:</strong>
                <span className="block leading-snug">Bairro Praia do Bispo, Rua Agostinho Neto, Travessa II/BETE, Ingombota, Luanda</span>
                <span className="text-teal-300 block text-[11px] font-medium mt-0.5">Dir. Clínica: Dra. Emília Kajika Raimundo M. Adão</span>
                <span className="text-teal-400 block text-[11px]">+244 923 112 233</span>
              </li>
              <li>
                <strong className="text-slate-200 block">Centro Médico Santo André:</strong>
                <span className="block leading-snug">Centralidade do Kilamba, Bloco C-12, Belas, Luanda</span>
                <span className="text-teal-300 block text-[11px] font-medium mt-0.5">Dir. Clínica: Dra. Esperança Bento</span>
                <span className="text-teal-400 block text-[11px]">+244 924 556 677</span>
              </li>
              <li>
                <strong className="text-slate-200 block">Centro Médico Santa Ana:</strong>
                <span className="block leading-snug">Bairro Palanca, Rua Ngola Yeto, Zona 2, Casa nº 18, Kilamba Kiaxi, Luanda</span>
                <span className="text-teal-300 block text-[11px] font-medium mt-0.5">Dir. Clínica: Dr. Ericson Cassoma</span>
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
              <li>Ecografia Normal</li>
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
            <span>•</span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/caritasdeangola"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook da Cáritas de Angola"
                className="hover:text-blue-400 transition-colors p-1"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://www.instagram.com/caritasdeangola"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram da Cáritas de Angola"
                className="hover:text-pink-400 transition-colors p-1"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
