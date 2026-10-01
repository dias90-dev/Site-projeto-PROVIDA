import React from 'react';
import { useApp } from '../context/AppContext';
import { QuickTriageForm } from './QuickTriageForm';

export const QuickTriageModal: React.FC = () => {
  const { isTriageModalOpen, setIsTriageModalOpen, selectedAppointmentForTriage } = useApp();

  if (!isTriageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto rounded-3xl">
        <QuickTriageForm
          initialAppointment={selectedAppointmentForTriage}
          onClose={() => setIsTriageModalOpen(false)}
          isEmbedded={false}
        />
      </div>
    </div>
  );
};
