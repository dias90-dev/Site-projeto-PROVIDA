import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  MedicalCenter,
  ServiceDetail,
  Doctor,
  Appointment,
  MedicalRecord,
  NotificationLog,
  MedicalCenterId,
  ServiceType,
  QuickTriageData
} from '../types';
import {
  MEDICAL_CENTERS,
  SERVICES,
  DOCTORS,
  DEMO_USERS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRIAGES
} from '../data/mockData';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  loginAsDemo: (role: UserRole, specificId?: string) => void;
  loginWithCredentials: (email: string, role: UserRole, name?: string) => boolean;
  logout: () => void;

  centers: MedicalCenter[];
  services: ServiceDetail[];
  doctors: Doctor[];

  appointments: Appointment[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'protocolNumber' | 'createdAt' | 'reminderSent'>) => Appointment;
  cancelAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;

  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => MedicalRecord;

  // Triagem Rápida Pré-Consulta
  triages: QuickTriageData[];
  saveQuickTriage: (triageData: Omit<QuickTriageData, 'id' | 'submittedAt'>) => Promise<QuickTriageData>;
  isTriageModalOpen: boolean;
  setIsTriageModalOpen: (open: boolean) => void;
  selectedAppointmentForTriage: Appointment | null;
  setSelectedAppointmentForTriage: (apt: Appointment | null) => void;

  doctorSchedules: Record<string, string[]>; // doctorId -> list of active slots
  updateDoctorSlots: (doctorId: string, slots: string[]) => void;

  notifications: NotificationLog[];
  triggerNotification: (appointment: Appointment, type: 'sms' | 'email' | 'both', customMsg?: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  selectedCenterForBooking?: MedicalCenterId;
  setSelectedCenterForBooking: (centerId?: MedicalCenterId) => void;
  selectedServiceForBooking?: ServiceType;
  setSelectedServiceForBooking: (serviceId?: ServiceType) => void;

  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  isFirestoreSynced: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state (with localStorage caching)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('provida_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [triages, setTriages] = useState<QuickTriageData[]>(INITIAL_TRIAGES);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [selectedAppointmentForTriage, setSelectedAppointmentForTriage] = useState<Appointment | null>(null);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);

  // Doctor schedules state
  const [doctorSchedules, setDoctorSchedules] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    DOCTORS.forEach(d => {
      init[d.id] = [...d.timeSlots];
    });
    return init;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCenterForBooking, setSelectedCenterForBooking] = useState<MedicalCenterId | undefined>();
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceType | undefined>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('provida_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4500);
  };

  // Seed initial demo data to Firestore if collection is empty
  useEffect(() => {
    let isMounted = true;

    const seedAndSubscribe = async () => {
      try {
        const aptsCol = collection(db, 'appointments');
        const snap = await getDocs(aptsCol);

        if (snap.empty) {
          const batch = writeBatch(db);

          // Seed demo appointments
          INITIAL_APPOINTMENTS.forEach(apt => {
            const ref = doc(db, 'appointments', apt.id);
            batch.set(ref, apt);
          });

          // Seed demo medical records
          INITIAL_MEDICAL_RECORDS.forEach(rec => {
            const ref = doc(db, 'medicalRecords', rec.id);
            batch.set(ref, rec);
          });

          // Seed demo notifications
          INITIAL_NOTIFICATIONS.forEach(notif => {
            const ref = doc(db, 'notifications', notif.id);
            batch.set(ref, notif);
          });

          // Seed demo quick triages
          INITIAL_TRIAGES.forEach(tri => {
            const ref = doc(db, 'triages', tri.id);
            batch.set(ref, tri);
          });

          // Seed demo users
          DEMO_USERS.forEach(u => {
            const ref = doc(db, 'users', u.id);
            batch.set(ref, u);
          });

          await batch.commit();
        }

        if (isMounted) {
          setIsFirestoreSynced(true);
        }
      } catch (err) {
        console.warn('Firebase initial seed check/write (fallback to memory if offline):', err);
      }
    };

    seedAndSubscribe();

    // 1. Listen for real-time appointments updates across all users & devices
    const unsubscribeAppointments = onSnapshot(
      query(collection(db, 'appointments')),
      snapshot => {
        if (!snapshot.empty) {
          const loaded: Appointment[] = [];
          snapshot.forEach(docSnap => {
            loaded.push(docSnap.data() as Appointment);
          });
          // Sort most recent first
          loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setAppointments(loaded);
          setIsFirestoreSynced(true);
        }
      },
      error => {
        console.warn('Firestore appointments listener notice:', error);
      }
    );

    // 2. Listen for real-time medical records (prontuários)
    const unsubscribeRecords = onSnapshot(
      query(collection(db, 'medicalRecords')),
      snapshot => {
        if (!snapshot.empty) {
          const loaded: MedicalRecord[] = [];
          snapshot.forEach(docSnap => {
            loaded.push(docSnap.data() as MedicalRecord);
          });
          loaded.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          setMedicalRecords(loaded);
        }
      },
      error => {
        console.warn('Firestore records listener notice:', error);
      }
    );

    // 3. Listen for real-time notification logs
    const unsubscribeNotifications = onSnapshot(
      query(collection(db, 'notifications')),
      snapshot => {
        if (!snapshot.empty) {
          const loaded: NotificationLog[] = [];
          snapshot.forEach(docSnap => {
            loaded.push(docSnap.data() as NotificationLog);
          });
          loaded.sort((a, b) => b.id.localeCompare(a.id));
          setNotifications(loaded);
        }
      },
      error => {
        console.warn('Firestore notifications listener notice:', error);
      }
    );

    // 4. Listen for real-time quick triages (fichas de triagem pré-consulta)
    const unsubscribeTriages = onSnapshot(
      query(collection(db, 'triages')),
      snapshot => {
        if (!snapshot.empty) {
          const loaded: QuickTriageData[] = [];
          snapshot.forEach(docSnap => {
            loaded.push(docSnap.data() as QuickTriageData);
          });
          loaded.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
          setTriages(loaded);
        }
      },
      error => {
        console.warn('Firestore triages listener notice:', error);
      }
    );

    return () => {
      isMounted = false;
      unsubscribeAppointments();
      unsubscribeRecords();
      unsubscribeNotifications();
      unsubscribeTriages();
    };
  }, []);

  const loginAsDemo = async (role: UserRole, specificId?: string) => {
    let target = DEMO_USERS.find(u => u.role === role);
    if (specificId) {
      const match = DEMO_USERS.find(u => u.id === specificId);
      if (match) target = match;
    }
    if (target) {
      setCurrentUser(target);
      showToast(`Sessão iniciada como: ${target.name} (${role.toUpperCase()})`);
      setIsLoginModalOpen(false);

      // Persist user profile to Firestore
      try {
        await setDoc(doc(db, 'users', target.id), target, { merge: true });
      } catch (err) {
        console.warn('Firestore user save:', err);
      }
    }
  };

  const loginWithCredentials = (email: string, role: UserRole, name?: string): boolean => {
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showToast(`Bem-vindo(a) de volta, ${existing.name}!`);
      setIsLoginModalOpen(false);
      return true;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || (email.split('@')[0].toUpperCase()),
      email,
      phone: '+244 923 000 123',
      role,
      documentId: '00' + Math.floor(10000000 + Math.random() * 90000000) + 'LA042',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(newUser);
    showToast(`Conta criada com sucesso! Bem-vindo(a), ${newUser.name}.`);
    setIsLoginModalOpen(false);

    // Save to Firestore
    setDoc(doc(db, 'users', newUser.id), newUser).catch(err => {
      console.warn('Firestore new user save:', err);
    });

    return true;
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS[0]);
    showToast('Sessão terminada com segurança.');
  };

  const triggerNotification = async (appointment: Appointment, type: 'sms' | 'email' | 'both', customMsg?: string) => {
    const newLogs: NotificationLog[] = [];
    const nowStr = new Date().toLocaleString('pt-PT', {
      dateStyle: 'short',
      timeStyle: 'short'
    });

    if (type === 'sms' || type === 'both') {
      const smsMsg = customMsg || `[Pró-Vida SMS] Lembrete: Sua consulta de ${appointment.serviceName} com ${appointment.doctorName} é dia ${appointment.date} às ${appointment.time} no ${appointment.centerName}. Protocolo: ${appointment.protocolNumber}`;
      newLogs.push({
        id: `notif-${Date.now()}-sms`,
        appointmentId: appointment.id,
        recipientName: appointment.patientName,
        recipientContact: appointment.patientPhone,
        type: 'sms',
        timestamp: nowStr,
        message: smsMsg,
        status: 'delivered'
      });
    }

    if (type === 'email' || type === 'both') {
      const emailMsg = customMsg || `[Pró-Vida Email] Confirmação oficial de agendamento (${appointment.protocolNumber}). Consulta de ${appointment.serviceName} no ${appointment.centerName} em ${appointment.date} às ${appointment.time}.`;
      newLogs.push({
        id: `notif-${Date.now()}-email`,
        appointmentId: appointment.id,
        recipientName: appointment.patientName,
        recipientContact: appointment.patientEmail,
        type: 'email',
        timestamp: nowStr,
        message: emailMsg,
        status: 'delivered'
      });
    }

    // Update local state and persist to Firestore
    setNotifications(prev => [...newLogs, ...prev]);

    newLogs.forEach(n => {
      setDoc(doc(db, 'notifications', n.id), n).catch(err => console.warn('Firestore notification save:', err));
    });

    if (type === 'sms') {
      showToast(`📱 SMS de lembrete enviado para ${appointment.patientPhone}`);
    } else if (type === 'email') {
      showToast(`📧 E-mail de confirmação enviado para ${appointment.patientEmail}`);
    } else {
      showToast(`🔔 Lembretes disparados por SMS (${appointment.patientPhone}) e E-mail (${appointment.patientEmail})!`);
    }
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'protocolNumber' | 'createdAt' | 'reminderSent'>): Appointment => {
    const protocolCode = `PV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      protocolNumber: protocolCode,
      createdAt: new Date().toISOString(),
      reminderSent: true,
      status: 'confirmed'
    };

    // Optimistic local update
    setAppointments(prev => [newApt, ...prev]);

    // Persist to Firebase Firestore
    setDoc(doc(db, 'appointments', newApt.id), newApt)
      .then(() => {
        console.log('Agendamento salvo com sucesso no Firebase Firestore:', newApt.id);
      })
      .catch(err => {
        console.warn('Erro ao salvar agendamento no Firestore:', err);
      });

    // Send notifications if checked
    if (newApt.reminderSms && newApt.reminderEmail) {
      triggerNotification(newApt, 'both');
    } else if (newApt.reminderSms) {
      triggerNotification(newApt, 'sms');
    } else if (newApt.reminderEmail) {
      triggerNotification(newApt, 'email');
    }

    return newApt;
  };

  const cancelAppointment = async (id: string) => {
    // Optimistic update
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('Consulta cancelada com sucesso.');

    // Persist status change to Firestore
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
    } catch (err) {
      console.warn('Erro ao atualizar cancelamento no Firestore:', err);
    }
  };

  const completeAppointment = async (id: string) => {
    // Optimistic update
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'completed' } : apt))
    );
    showToast('Atendimento finalizado com sucesso.');

    // Persist status change to Firestore
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'completed' });
    } catch (err) {
      console.warn('Erro ao atualizar status de conclusão no Firestore:', err);
    }
  };

  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `rec-${Date.now()}`
    };

    // Optimistic update
    setMedicalRecords(prev => [newRecord, ...prev]);
    showToast(`Prontuário eletrônico de ${newRecord.patientName} salvo com sucesso.`);

    // Persist prontuário to Firestore
    setDoc(doc(db, 'medicalRecords', newRecord.id), newRecord)
      .then(() => {
        console.log('Prontuário salvo no Firestore:', newRecord.id);
      })
      .catch(err => {
        console.warn('Erro ao salvar prontuário no Firestore:', err);
      });

    return newRecord;
  };

  const updateDoctorSlots = (doctorId: string, slots: string[]) => {
    setDoctorSchedules(prev => ({
      ...prev,
      [doctorId]: slots
    }));
    showToast('Horários de atendimento atualizados na agenda.');
  };

  const saveQuickTriage = async (triageData: Omit<QuickTriageData, 'id' | 'submittedAt'>): Promise<QuickTriageData> => {
    const newTriage: QuickTriageData = {
      ...triageData,
      id: `tri-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };

    // 1. Optimistic update in triages
    setTriages(prev => [newTriage, ...prev]);

    // 2. If associated with an appointment, update the appointment locally and in Firestore
    if (newTriage.appointmentId) {
      setAppointments(prev =>
        prev.map(apt => (apt.id === newTriage.appointmentId ? { ...apt, triage: newTriage } : apt))
      );

      updateDoc(doc(db, 'appointments', newTriage.appointmentId), { triage: newTriage }).catch(err => {
        console.warn('Erro ao associar triagem ao agendamento no Firestore:', err);
      });
    }

    // 3. Save to Firestore triages collection
    try {
      await setDoc(doc(db, 'triages', newTriage.id), newTriage);
    } catch (err) {
      console.warn('Erro ao salvar triagem rápida no Firestore:', err);
    }

    showToast(`✅ Ficha de Triagem Rápida registada com sucesso! Sinais vitais guardados.`);
    setIsTriageModalOpen(false);
    return newTriage;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: DEMO_USERS,
        loginAsDemo,
        loginWithCredentials,
        logout,
        centers: MEDICAL_CENTERS,
        services: SERVICES,
        doctors: DOCTORS,
        appointments,
        bookAppointment,
        cancelAppointment,
        completeAppointment,
        medicalRecords,
        addMedicalRecord,
        triages,
        saveQuickTriage,
        isTriageModalOpen,
        setIsTriageModalOpen,
        selectedAppointmentForTriage,
        setSelectedAppointmentForTriage,
        doctorSchedules,
        updateDoctorSlots,
        notifications,
        triggerNotification,
        activeTab,
        setActiveTab,
        selectedCenterForBooking,
        setSelectedCenterForBooking,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toastMessage,
        showToast,
        isFirestoreSynced
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
