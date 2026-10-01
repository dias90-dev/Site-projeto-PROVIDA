import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CentersSection } from './components/CentersSection';
import { ServicesSection } from './components/ServicesSection';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TelemedicinePreview } from './components/TelemedicinePreview';
import { BookingModal } from './components/BookingModal';
import { LoginModal } from './components/LoginModal';
import { QuickTriageModal } from './components/QuickTriageModal';
import { Toast } from './components/Toast';
import { SupportChatWidget } from './components/SupportChatWidget';
import { Footer } from './components/Footer';
import {
  HeartHandshake,
  ShieldCheck,
  Download,
  Calendar,
  PhoneCall,
  Video,
  FileCheck2,
  Clock,
  Sparkles,
  CheckCircle2,
  Building
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsBookingModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroBanner />

            {/* Institutional Banner (Atendimento Humanizado & Acolhimento) */}
            <section className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white py-10 px-4 sm:px-6 border-y border-teal-800/40">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                        Atendimento Humanizado
                      </span>
                      <span className="text-xs text-slate-400">Projeto Pró-Vida</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                      Atendimento Humanizado & Acolhimento de Excelência
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                      Nos Centros Mamã Muxima, Santo André e Santa Ana, dedicamo-nos ao acolhimento digno, respeito e atenção integral a cada paciente e sua família, com cuidados médicos de qualidade e agendamento digital facilitado.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-white hover:bg-teal-50 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Marcar Consulta</span>
                  </button>
                </div>
              </div>
            </section>

            <CentersSection />
            <ServicesSection />

            {/* Quick Informational / PDF & Reminder Highlights */}
            <section className="py-16 bg-slate-100/70 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    Garantia de Qualidade Pró-Vida
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    Como Funciona o Agendamento no Projeto Pró-Vida?
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      1
                    </div>
                    <h4 className="font-bold text-base text-slate-900">
                      Escolha o Centro e o Serviço
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Selecione um dos 3 centros (Mamã Muxima, Santo André ou Santa Ana) e a especialidade desejada, verificando se exige jejum ou preparo prévio.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      2
                    </div>
                    <h4 className="font-bold text-base text-slate-900">
                      Baixe o Comprovativo em PDF
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Assim que confirmar, baixe a ficha oficial em PDF com código de protocolo e orientações para apresentar na recepção no dia da consulta.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      3
                    </div>
                    <h4 className="font-bold text-base text-slate-900">
                      Lembretes por SMS e E-mail
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nosso sistema envia automaticamente lembrete 24h e 2h antes com data, horário, nome do médico e sala para que nunca se esqueça.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'centers' && <CentersSection />}
        {activeTab === 'services' && <ServicesSection />}
        {activeTab === 'patient-portal' && <PatientDashboard />}
        {activeTab === 'doctor-portal' && <DoctorDashboard />}
        {activeTab === 'admin-portal' && <AdminDashboard />}
        {activeTab === 'telemedicine' && <TelemedicinePreview />}
      </main>

      <Footer />
      <BookingModal />
      <LoginModal />
      <QuickTriageModal />
      <Toast />
      <SupportChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
