import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';
import {
  Baby,
  Stethoscope,
  HeartHandshake,
  Sparkles,
  Activity,
  Scan,
  FlaskConical,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const {
    services,
    centers,
    setSelectedServiceForBooking,
    setIsBookingModalOpen
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'consultas' | 'exames'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-6 h-6 text-teal-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-teal-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-teal-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-teal-600" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-teal-600" />;
      case 'Scan':
        return <Scan className="w-6 h-6 text-teal-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-teal-600" />;
      default:
        return <Stethoscope className="w-6 h-6 text-teal-600" />;
    }
  };

  const filteredServices = services.filter(s => {
    if (activeFilter === 'consultas') return !s.isExameFisico;
    if (activeFilter === 'exames') return s.isExameFisico;
    return true;
  });

  const handleBookService = (serviceId: ServiceType) => {
    setSelectedServiceForBooking(serviceId);
    setIsBookingModalOpen(true);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200" id="servicos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 mb-3">
              <Stethoscope className="w-3.5 h-3.5" />
              Especialidades Médicas & Meios de Diagnóstico
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Serviços Médicos Disponíveis
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Atendimento com profissionais especializados nos 3 centros médicos do Projeto Pró-Vida.
              Consulte orientações de jejum e preparo antes do agendamento.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos (7)
            </button>
            <button
              onClick={() => setActiveFilter('consultas')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'consultas'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consultas Médicas (5)
            </button>
            <button
              onClick={() => setActiveFilter('exames')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'exames'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ecografia & Laboratório (2)
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-teal-300 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header with icon and tag */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                    {getIcon(service.icon)}
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      service.isExameFisico
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {service.isExameFisico ? 'Exame / Laboratório' : 'Consulta Médica'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Duração estimada: {service.estimatedDuration}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Available Centers tags */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Disponível nos Centros:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {service.availableCenters.map(cId => {
                      const c = centers.find(center => center.id === cId);
                      return (
                        <span
                          key={cId}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                        >
                          {c?.name.replace('Centro Médico ', '')}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements / Pre-requisitos */}
                {service.requirements.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Orientações & Preparo:</span>
                    </div>
                    {service.requirements.map((req, rIdx) => (
                      <p key={rIdx} className="leading-tight pl-2 border-l-2 border-amber-300">
                        {req}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking CTA */}
              <div className="pt-6">
                <button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-teal-200/80 group-hover:border-teal-600"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Marcar {service.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
