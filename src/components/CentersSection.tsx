import React from 'react';
import { useApp } from '../context/AppContext';
import { MedicalCenterId } from '../types';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ChevronRight,
  ExternalLink
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
        <div className="text-center max-w-3xl mx-auto mb-12">
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
                  <p className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg inline-block mb-3">
                    {center.tagline}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {center.description}
                  </p>

                  {/* Info points */}
                  <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{center.address}</span>
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
