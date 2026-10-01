import React from 'react';
import { useApp } from '../context/AppContext';
import { MedicalCenterId } from '../types';
import { PROJECT_LEADERSHIP } from '../data/mockData';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Stethoscope,
  HeartHandshake,
  Award
} from 'lucide-react';

export const CentersSection: React.FC = () => {
  const {
    centers,
    setSelectedCenterForBooking,
    setIsBookingModalOpen
  } = useApp();

  const handleBookAtCenter = (centerId: MedicalCenterId) => {
    setSelectedCenterForBooking(centerId);
    setIsBookingModalOpen(true);
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200" id="centros">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 mb-3">
            <Building className="w-3.5 h-3.5" />
            Rede Integrada Pró-Vida
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nossos 3 Centros Médicos
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Unidades equipadas com tecnologia moderna, acolhimento humanizado e atendimento gratuito/subsidiado para toda a comunidade.
          </p>
        </div>

        {/* Institutional Governance Card */}
        <div className="mb-10 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-teal-500/20">
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
                    Governação & Administração
                  </span>
                  <span className="text-xs text-slate-300">Projeto Pró-Vida • Cáritas de Angola</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  Administradora do Projeto: <span className="text-teal-300">{PROJECT_LEADERSHIP.administrator}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Supervisão operacional e pastoral de saúde comunitária nos 3 polos clínicos de Luanda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-teal-300 block font-semibold">Mamã Muxima (Ingombota)</span>
                  <span className="font-bold text-white text-xs">Dra. Emília Kajika Raimundo M. Adão</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] text-teal-300 block font-semibold">Santa Ana (Palanca)</span>
                  <span className="font-bold text-white text-xs">Dr. Ericson Cassoma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Centers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {centers.map(center => (
            <div
              key={center.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-800">
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 right-3 bg-teal-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  Unidade Ativa
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
                    {center.zone}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {center.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg inline-block">
                      {center.tagline}
                    </p>
                  </div>

                  {/* Direção Clínica Highlight */}
                  {center.clinicalDirector && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                          Direção Clínica Oficial
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 leading-snug block">
                          {center.clinicalDirector}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {center.description}
                  </p>

                  {/* Info points */}
                  <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900 block">Endereço Oficial:</span>
                          <span className="text-slate-700 leading-relaxed">{center.address}</span>
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ' ' + center.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 shrink-0 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 px-2.5 py-1 rounded-lg transition-colors"
                        title="Ver localização no Google Maps"
                      >
                        <span>Mapa</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        Recepção: <strong className="text-slate-800">{center.phone}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{center.hours}</span>
                    </div>
                  </div>

                  {/* Facilities bullets */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                      Destaques da Unidade:
                    </span>
                    <ul className="space-y-1.5">
                      {center.facilities.map((fac, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{fac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleBookAtCenter(center.id)}
                    className="w-full bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group-hover:bg-teal-600"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Marcar Consulta em {center.name.replace('Centro Médico ', '')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
