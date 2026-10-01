import { MedicalCenter, ServiceDetail, Doctor, User, Appointment, MedicalRecord, NotificationLog, MonthlyStats, QuickTriageData } from '../types';

export const PROJECT_LEADERSHIP = {
  administrator: 'Irmã Ventura',
  administratorRole: 'Administradora do Projeto Pró-Vida',
  organization: 'Cáritas de Angola • Projeto Pró-Vida',
  clinicalDirectors: {
    mamaMuxima: {
      name: 'Dra. Emília Kajika Raimundo M. Adão',
      role: 'Diretora Clínica',
      center: 'Centro Médico Mamã Muxima',
      address: 'Bairro Praia do Bispo, Rua Agostinho Neto, Travessa II/BETE, Distrito Urbano da Ingombota, Município de Luanda, Província de Luanda'
    },
    santaAna: {
      name: 'Dr. Ericson Cassoma',
      role: 'Diretor Clínico',
      center: 'Centro Médico Santa Ana',
      address: 'Bairro Palanca, Rua Ngola Yeto, Zona 2, Casa nº 18, Distrito Urbano do Kilamba Kiaxi, Luanda'
    },
    santoAndre: {
      name: 'Dra. Esperança Bento',
      role: 'Diretora Clínica',
      center: 'Centro Médico Santo André',
      address: 'Quarteirão B, Centralidade do Kilamba, Bloco C-12, Município de Belas, Província de Luanda'
    }
  }
};

export const MEDICAL_CENTERS: MedicalCenter[] = [
  {
    id: 'mama-muxima',
    name: 'Centro Médico Mamã Muxima',
    tagline: 'Excelência em Saúde Familiar e Pediátrica',
    address: 'Bairro Praia do Bispo, Rua Agostinho Neto, Travessa II/BETE, Distrito Urbano da Ingombota, Município de Luanda, Província de Luanda',
    zone: 'Ingombota / Praia do Bispo, Luanda',
    municipality: 'Município de Luanda',
    province: 'Província de Luanda',
    clinicalDirector: 'Dra. Emília Kajika Raimundo M. Adão',
    phone: '+244 923 112 233',
    emergencyPhone: '+244 912 000 111',
    email: 'mama.muxima@provida.ao',
    hours: 'Segunda a Sábado: 07:30 - 19:30 | Urgências 24h',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Unidade de referência com atendimento humanizado, bloco de ecografia normal e laboratório central de análises clínicas. Direção Clínica: Dra. Emília Kajika Raimundo M. Adão.',
    facilities: ['Laboratório de Análises 24h', 'Sala de Ecografia Normal', 'Enfermaria Pediátrica', 'Farmácia Pró-Vida', 'Estacionamento Gratuito']
  },
  {
    id: 'santo-andre',
    name: 'Centro Médico Santo André',
    tagline: 'Cuidado Integral e Saúde Materno-Infantil',
    address: 'Quarteirão B, Centralidade do Kilamba, Bloco C-12, Município de Belas, Província de Luanda',
    zone: 'Kilamba / Belas, Luanda',
    municipality: 'Município de Belas',
    province: 'Província de Luanda',
    clinicalDirector: 'Dra. Esperança Bento',
    phone: '+244 924 556 677',
    emergencyPhone: '+244 914 222 333',
    email: 'santo.andre@provida.ao',
    hours: 'Segunda a Sexta: 07:30 - 20:00 | Sábado: 08:00 - 15:00',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'Especializado em Pré-Natal humanizado, saúde ginecológica e preventiva com consultas programadas e acompanhamento contínuo da gestante.',
    facilities: ['Gabinete de Pré-Natal Avançado', 'Consultórios Ginecológicos', 'Salas de Exames Físicos', 'Posto de Vacinação', 'Auditório de Educação em Saúde']
  },
  {
    id: 'santa-ana',
    name: 'Centro Médico Santa Ana',
    tagline: 'Proximidade, Diagnóstico e Prevenção Especializada',
    address: 'Bairro Palanca, Rua Ngola Yeto, Zona 2, Casa nº 18, Distrito Urbano do Kilamba Kiaxi, Luanda',
    zone: 'Palanca / Kilamba Kiaxi, Luanda',
    municipality: 'Distrito Urbano do Kilamba Kiaxi',
    province: 'Província de Luanda',
    clinicalDirector: 'Dr. Ericson Cassoma',
    phone: '+244 925 889 900',
    emergencyPhone: '+244 915 444 555',
    email: 'santa.ana@provida.ao',
    hours: 'Segunda a Sábado: 07:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    description: 'Polo comunitário de alta resolutividade focado em Clínica Geral, Urologia preventiva, triagem médica rápida e exames laboratoriais admissionais e periódicos. Direção Clínica: Dr. Ericson Cassoma.',
    facilities: ['Gabinete de Urologia', 'Sala de Coleta Rápida', 'Consultório de Triagem', 'Atendimento Humanizado Pró-Vida', 'Acessibilidade Total']
  }
];

export const SERVICES: ServiceDetail[] = [
  {
    id: 'pediatria',
    name: 'Consulta de Pediatria',
    shortDescription: 'Cuidado carinhoso e vigilância do desenvolvimento infantil desde os primeiros dias até a adolescência.',
    fullDescription: 'Avaliação clínica completa do crescimento, desenvolvimento psicomotor, vacinação, nutrição infantil, diagnóstico e tratamento de patologias comuns na infância.',
    requirements: ['Trazer boletim de vacinas e certidão/cédula da criança', 'Chegar 15 minutos antes para pesagem e medição'],
    icon: 'Baby',
    estimatedDuration: '30 - 45 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: false
  },
  {
    id: 'clinica-geral',
    name: 'Clínica Geral',
    shortDescription: 'Diagnóstico primário, check-up preventivo, controle de hipertensão, diabetes e encaminhamentos.',
    fullDescription: 'Atendimento médico global para adultos e idosos. Investigação de queixas clínicas, pedidos de exames de rotina, prescrição terapêutica e acompanhamento crônico.',
    requirements: ['Trazer lista de medicamentos de uso contínuo', 'Exames laboratoriais anteriores (se houver)'],
    icon: 'Stethoscope',
    estimatedDuration: '30 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: false
  },
  {
    id: 'pre-natal',
    name: 'Consulta de Pré-Natal',
    shortDescription: 'Acompanhamento rigoroso da saúde da mãe e desenvolvimento saudável do bebê com foco no parto seguro.',
    fullDescription: 'Consultas periódicas obstétricas, cálculo gestacional, controle da pressão arterial materna, batimentos cardíacos fetais, orientações nutricionais e plano de parto.',
    requirements: ['Trazer caderneta da gestante', 'Últimos exames de sangue e relatórios de ecografia'],
    icon: 'HeartHandshake',
    estimatedDuration: '40 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: false
  },
  {
    id: 'ginecologia',
    name: 'Ginecologia',
    shortDescription: 'Saúde integral da mulher, rastreio de colo uterino, planejamento familiar e saúde reprodutiva.',
    fullDescription: 'Consulta preventiva ginecológica, orientação anticoncepcional, tratamento de infecções ginecológicas, climatério, menopausa e rastreio de patologias pélvicas.',
    requirements: ['Evitar relações sexuais e duchas vaginais 48h antes da citologia', 'Não estar no período menstrual'],
    icon: 'Sparkles',
    estimatedDuration: '35 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: false
  },
  {
    id: 'urologia',
    name: 'Urologia',
    shortDescription: 'Prevenção de doenças da próstata, saúde do trato urinário masculino e feminino, cálculos renais.',
    fullDescription: 'Avaliação especializada do sistema urinário e reprodutor masculino. Rastreio preventivo do câncer de próstata (PSA/toque), tratamento de litíase urinária e infecções.',
    requirements: ['Homens acima de 45 anos: trazer exames de PSA anteriores', 'Bexiga confortavelmente cheia caso haja ecografia associada'],
    icon: 'Activity',
    estimatedDuration: '30 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: false
  },
  {
    id: 'ecografia',
    name: 'Ecografia Normal',
    shortDescription: 'Exames de ecografia preventiva normal: obstétrica, abdominal, pélvica e renal com laudo médico.',
    fullDescription: 'Diagnóstico não invasivo por imagem de ecografia normal. Fornece laudo descritivo e relatório impresso no ato para o médico assistente.',
    requirements: [
      'Ecografia Abdominal Total: Jejum alimentar absoluto de 6 a 8 horas',
      'Ecografia Pélvica / Renal: Beber 4 a 6 copos de água 1 hora antes e reter urina',
      'Ecografia Obstétrica: Sem preparo prévio'
    ],
    icon: 'Scan',
    estimatedDuration: '25 - 40 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: true
  },
  {
    id: 'laboratorio',
    name: 'Laboratório para Exames Físicos e Análises',
    shortDescription: 'Exames laboratoriais de sangue, urina, fezes e exames físicos admissionais/periódicos com laudo rápido.',
    fullDescription: 'Posto avançado de coletas biológicas e realização de perícias e exames físicos de aptidão física. Testes de bioquímica, hemograma completo, perfil lipídico, função renal e hepática.',
    requirements: [
      'Jejum de 8 a 12 horas para glicemia e perfil lipídico',
      'Primeira urina da manhã em frasco esterilizado',
      'Documento de identificação oficial original'
    ],
    icon: 'FlaskConical',
    estimatedDuration: '20 min',
    availableCenters: ['mama-muxima', 'santo-andre', 'santa-ana'],
    isExameFisico: true
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-dir-mama',
    name: 'Dra. Emília Kajika Raimundo M. Adão',
    title: 'Diretora Clínica • Centro Mamã Muxima',
    specialty: 'clinica-geral',
    specialtyName: 'Clínica Geral & Medicina Familiar',
    centers: ['mama-muxima'],
    licenseNumber: 'OM-ANG 3218/2009',
    bio: 'Diretora Clínica do Centro Médico Mamã Muxima (Ingombota/Praia do Bispo). Mais de 16 anos de liderança em saúde comunitária, medicina preventiva e acolhimento familiar humanizado.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    experienceYears: 16
  },
  {
    id: 'doc-dir-santa-ana',
    name: 'Dr. Ericson Cassoma',
    title: 'Diretor Clínico • Centro Santa Ana',
    specialty: 'urologia',
    specialtyName: 'Clínica Geral & Urologia',
    centers: ['santa-ana'],
    licenseNumber: 'OM-ANG 4105/2012',
    bio: 'Diretor Clínico do Centro Médico Santa Ana (Palanca / Kilamba Kiaxi). Especialista em coordenação médica hospitalar, diagnóstico precoce e triagem clínica resolutiva.',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    timeSlots: ['08:00', '08:45', '09:30', '10:15', '11:00', '14:00', '14:45', '15:30'],
    experienceYears: 14
  },
  {
    id: 'doc-1',
    name: 'Dr. Manuel Domingos',
    title: 'Especialista em Clínica Geral e Urologia',
    specialty: 'clinica-geral',
    specialtyName: 'Clínica Geral & Urologia',
    centers: ['mama-muxima', 'santa-ana'],
    licenseNumber: 'OM-ANG 4892/2014',
    bio: 'Mais de 12 anos de experiência em saúde pública e preventiva. Coordenador de programas do Projeto Pró-Vida, dedicado à humanização hospitalar.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
    timeSlots: ['08:00', '08:45', '09:30', '10:15', '11:00', '14:00', '14:45', '15:30', '16:15'],
    experienceYears: 12
  },
  {
    id: 'doc-2',
    name: 'Dra. Rosa Kiala',
    title: 'Pediatra & Especialista em Neonatologia',
    specialty: 'pediatria',
    specialtyName: 'Pediatria',
    centers: ['mama-muxima', 'santo-andre'],
    licenseNumber: 'OM-ANG 6120/2017',
    bio: 'Especialista apaixonada pelo desenvolvimento infantil, com atuação direta no acolhimento de recém-nascidos e acompanhamento pediátrico integrativo.',
    avatar: 'https://images.unsplash.com/photo-1594824813583-02f5a54db68b?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Terça-feira', 'Quinta-feira', 'Sábado'],
    timeSlots: ['08:30', '09:15', '10:00', '10:45', '11:30', '13:30', '14:15', '15:00'],
    experienceYears: 9
  },
  {
    id: 'doc-3',
    name: 'Dra. Esperança Bento',
    title: 'Ginecologista & Obstetra',
    specialty: 'pre-natal',
    specialtyName: 'Pré-Natal & Ginecologia',
    centers: ['santo-andre', 'mama-muxima'],
    licenseNumber: 'OM-ANG 3540/2011',
    bio: 'Pioneira em programas de parto humanizado e vigilância de gestações de alto risco no Projeto Pró-Vida.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Terça-feira', 'Quarta-feira', 'Sexta-feira'],
    timeSlots: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    experienceYears: 15
  },
  {
    id: 'doc-4',
    name: 'Dr. Afonso Ndala',
    title: 'Urologista Cirurgião',
    specialty: 'urologia',
    specialtyName: 'Urologia',
    centers: ['santa-ana', 'mama-muxima'],
    licenseNumber: 'OM-ANG 7821/2019',
    bio: 'Especialista em saúde do homem, prevenção do cancro de próstata e litíase renal com técnicas minimamente invasivas.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Quarta-feira', 'Sábado'],
    timeSlots: ['08:00', '08:45', '09:30', '10:15', '11:00', '14:00', '14:45'],
    experienceYears: 8
  },
  {
    id: 'doc-5',
    name: 'Dr. Bernardo Cassoma',
    title: 'Médico Imagiologista & Ecografista',
    specialty: 'ecografia',
    specialtyName: 'Ecografia Normal',
    centers: ['mama-muxima', 'santo-andre', 'santa-ana'],
    licenseNumber: 'OM-ANG 5291/2015',
    bio: 'Experiência sólida em ecografia normal, incluindo exames abdominais, pélvicos, renais e obstétricos com diagnóstico rigoroso e atendimento humanizado.',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    timeSlots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30'],
    experienceYears: 11
  },
  {
    id: 'doc-6',
    name: 'Dra. Teresa Van-Dúnem',
    title: 'Responsável Técnica de Análises & Exames Físicos',
    specialty: 'laboratorio',
    specialtyName: 'Laboratório & Exames Físicos',
    centers: ['mama-muxima', 'santa-ana', 'santo-andre'],
    licenseNumber: 'CRB-ANG 1920/2016',
    bio: 'Bioquímica e médica perita com foco em exames de admissão profissional, check-ups biológicos rápidos e controle de qualidade laboratorial.',
    avatar: 'https://images.unsplash.com/photo-1594824813583-02f5a54db68b?auto=format&fit=crop&w=400&q=80',
    availableDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    timeSlots: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
    experienceYears: 10
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-patient',
    name: 'Ana Paula Silva',
    email: 'ana.silva@email.com',
    phone: '+244 923 456 789',
    role: 'patient',
    documentId: '006892341LA042',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-dir-mama',
    name: 'Dra. Emília Kajika Raimundo M. Adão',
    email: 'dra.emilia.adao@provida.ao',
    phone: '+244 923 112 233',
    role: 'doctor',
    specialty: 'Diretora Clínica (Mamã Muxima)',
    crmOrLicence: 'OM-ANG 3218/2009',
    assignedCenterId: 'mama-muxima',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-dir-santa-ana',
    name: 'Dr. Ericson Cassoma',
    email: 'dr.ericson.cassoma@provida.ao',
    phone: '+244 925 889 900',
    role: 'doctor',
    specialty: 'Diretor Clínico (Santa Ana)',
    crmOrLicence: 'OM-ANG 4105/2012',
    assignedCenterId: 'santa-ana',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-1',
    name: 'Dr. Manuel Domingos',
    email: 'dr.manuel@provida.ao',
    phone: '+244 912 345 678',
    role: 'doctor',
    specialty: 'Clínica Geral & Urologia',
    crmOrLicence: 'OM-ANG 4892/2014',
    assignedCenterId: 'mama-muxima',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-2',
    name: 'Dra. Rosa Kiala',
    email: 'dra.rosa@provida.ao',
    phone: '+244 922 987 654',
    role: 'doctor',
    specialty: 'Pediatria & Neonatologia',
    crmOrLicence: 'OM-ANG 6120/2017',
    assignedCenterId: 'santo-andre',
    avatar: 'https://images.unsplash.com/photo-1594824813583-02f5a54db68b?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-admin',
    name: 'Irmã Ventura',
    email: 'irma.ventura@provida.ao',
    phone: '+244 923 000 999',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    protocolNumber: 'PV-2026-0901',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    patientEmail: 'ana.silva@email.com',
    patientPhone: '+244 923 456 789',
    patientDocument: '006892341LA042',
    centerId: 'mama-muxima',
    centerName: 'Centro Médico Mamã Muxima',
    serviceId: 'clinica-geral',
    serviceName: 'Clínica Geral',
    doctorId: 'doc-1',
    doctorName: 'Dr. Manuel Domingos',
    date: '2026-10-02',
    time: '09:30',
    status: 'confirmed',
    notes: 'Check-up de rotina e aferição de tensão arterial.',
    createdAt: '2026-09-27T10:00:00.000Z',
    reminderSms: true,
    reminderEmail: true,
    reminderSent: true,
    isTelemedicine: false,
    triage: {
      id: 'tri-001',
      appointmentId: 'apt-101',
      protocolNumber: 'PV-2026-0901',
      patientId: 'user-patient',
      patientName: 'Ana Paula Silva',
      patientPhone: '+244 923 456 789',
      patientDocument: '006892341LA042',
      centerId: 'mama-muxima',
      centerName: 'Centro Médico Mamã Muxima',
      serviceId: 'clinica-geral',
      serviceName: 'Clínica Geral',
      date: '2026-09-28',
      time: '08:45',
      weight: '64.5',
      height: '168',
      bmi: '22.9',
      bmiCategory: 'Peso Normal',
      temperature: '36.5',
      temperatureStatus: 'normal',
      bloodPressureSystolic: '120',
      bloodPressureDiastolic: '80',
      bloodPressure: '120/80 mmHg',
      bloodPressureStatus: 'normal',
      heartRate: '72',
      oxygenSaturation: '98',
      bloodGlucose: '92',
      painLevel: 1,
      mainSymptoms: 'Leve cansaço vespertino e aferição preventiva para consulta.',
      symptomDuration: 'Há 3 dias',
      allergies: 'Nenhuma alergia conhecida a medicamentos',
      currentMedications: 'Nenhum medicamento contínuo',
      priorityLevel: 'verde',
      observations: 'Sinais vitais normais. Triagem rápida realizada previamente no Portal do Paciente.',
      submittedAt: '2026-09-28T08:45:00.000Z'
    }
  },
  {
    id: 'apt-102',
    protocolNumber: 'PV-2026-0902',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    patientEmail: 'ana.silva@email.com',
    patientPhone: '+244 923 456 789',
    patientDocument: '006892341LA042',
    centerId: 'santo-andre',
    centerName: 'Centro Médico Santo André',
    serviceId: 'ecografia',
    serviceName: 'Ecografia Normal',
    doctorId: 'doc-5',
    doctorName: 'Dr. Bernardo Cassoma',
    date: '2026-10-06',
    time: '10:00',
    status: 'confirmed',
    notes: 'Ecografia abdominal de controlo preventivo.',
    createdAt: '2026-09-26T14:30:00.000Z',
    reminderSms: true,
    reminderEmail: true,
    reminderSent: true,
    isTelemedicine: false
  },
  {
    id: 'apt-103',
    protocolNumber: 'PV-2026-0889',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    patientEmail: 'ana.silva@email.com',
    patientPhone: '+244 923 456 789',
    patientDocument: '006892341LA042',
    centerId: 'mama-muxima',
    centerName: 'Centro Médico Mamã Muxima',
    serviceId: 'laboratorio',
    serviceName: 'Laboratório para Exames Físicos e Análises',
    doctorId: 'doc-6',
    doctorName: 'Dra. Teresa Van-Dúnem',
    date: '2026-09-15',
    time: '08:00',
    status: 'completed',
    notes: 'Hemograma completo, perfil lipídico e glicemia em jejum.',
    createdAt: '2026-09-10T09:12:00.000Z',
    reminderSms: true,
    reminderEmail: true,
    reminderSent: true,
    isTelemedicine: false
  },
  {
    id: 'apt-104',
    protocolNumber: 'PV-2026-0914',
    patientId: 'pat-999',
    patientName: 'João Baptista Mateus',
    patientEmail: 'joao.mateus@gmail.com',
    patientPhone: '+244 934 111 222',
    patientDocument: '001239845LA033',
    centerId: 'santa-ana',
    centerName: 'Centro Médico Santa Ana',
    serviceId: 'urologia',
    serviceName: 'Urologia',
    doctorId: 'doc-1',
    doctorName: 'Dr. Manuel Domingos',
    date: '2026-09-30',
    time: '08:45',
    status: 'confirmed',
    notes: 'Primeira consulta urológica de prevenção anual.',
    createdAt: '2026-09-25T11:20:00.000Z',
    reminderSms: true,
    reminderEmail: true,
    reminderSent: true,
    isTelemedicine: false
  },
  {
    id: 'apt-105',
    protocolNumber: 'PV-2026-0915',
    patientId: 'pat-888',
    patientName: 'Kieza Ferreira Manuel',
    patientEmail: 'kieza.m@gmail.com',
    patientPhone: '+244 945 333 444',
    patientDocument: '007788991LA012',
    centerId: 'santo-andre',
    centerName: 'Centro Médico Santo André',
    serviceId: 'pre-natal',
    serviceName: 'Consulta de Pré-Natal',
    doctorId: 'doc-3',
    doctorName: 'Dra. Esperança Bento',
    date: '2026-10-01',
    time: '09:00',
    status: 'confirmed',
    notes: 'Consulta de 24ª semana gestacional.',
    createdAt: '2026-09-24T16:00:00.000Z',
    reminderSms: true,
    reminderEmail: false,
    reminderSent: true,
    isTelemedicine: false
  },
  {
    id: 'apt-106',
    protocolNumber: 'PV-2026-0920',
    patientId: 'pat-777',
    patientName: 'Pequeno Lucas da Costa (3 anos)',
    patientEmail: 'maria.costa@hotmail.com',
    patientPhone: '+244 921 777 888',
    patientDocument: '009847123LA099',
    centerId: 'mama-muxima',
    centerName: 'Centro Médico Mamã Muxima',
    serviceId: 'pediatria',
    serviceName: 'Consulta de Pediatria',
    doctorId: 'doc-2',
    doctorName: 'Dra. Rosa Kiala',
    date: '2026-09-29',
    time: '10:00',
    status: 'confirmed',
    notes: 'Vigilância de peso e tosse alérgica sazonal.',
    createdAt: '2026-09-26T08:15:00.000Z',
    reminderSms: true,
    reminderEmail: true,
    reminderSent: true,
    isTelemedicine: false
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-001',
    appointmentId: 'apt-103',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    doctorId: 'doc-6',
    doctorName: 'Dra. Teresa Van-Dúnem',
    centerId: 'mama-muxima',
    date: '2026-09-15',
    specialty: 'Laboratório & Análises',
    symptoms: 'Paciente assintomática, em realização de exames admissionais e rotina física.',
    diagnosis: 'Parâmetros bioquímicos normais; leve dislipidemia em observação dietética.',
    prescription: 'Recomendação de dieta com baixo teor de gorduras saturadas e prática regular de caminhada.',
    labExamOrders: 'Glicemia: 88 mg/dL (Normal) | Colesterol Total: 204 mg/dL | Triglicerídeos: 140 mg/dL | Hemoglobina: 13.4 g/dL.',
    vitalSigns: {
      bloodPressure: '120/80 mmHg',
      temperature: '36.5 ºC',
      heartRate: '72 bpm',
      weight: '64 kg'
    },
    clinicalNotes: 'Exame físico geral sem anormalidades torácicas ou abdominais. Apta para atividades físicas habituais.'
  },
  {
    id: 'rec-002',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    doctorId: 'doc-1',
    doctorName: 'Dr. Manuel Domingos',
    centerId: 'mama-muxima',
    date: '2026-06-18',
    specialty: 'Clínica Geral',
    symptoms: 'Cefaleia tensional e cansaço visual após jornada de trabalho no computador.',
    diagnosis: 'Cefaleia de tensão episódica associada a esforço visual.',
    prescription: 'Paracetamol 500mg (1 comprimido de 8/8h se dor) | Encaminhamento para avaliação oftalmológica.',
    labExamOrders: 'Hemograma e glicemia de jejum solicitados previamente normais.',
    vitalSigns: {
      bloodPressure: '118/78 mmHg',
      temperature: '36.4 ºC',
      heartRate: '68 bpm',
      weight: '63.5 kg'
    },
    clinicalNotes: 'Boa resposta ao relaxamento muscular. Orientada quanto a pausas periódicas e ergonomia laboral.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif-1',
    appointmentId: 'apt-101',
    recipientName: 'Ana Paula Silva',
    recipientContact: '+244 923 456 789',
    type: 'sms',
    timestamp: '2026-09-28 08:30',
    message: '[Pró-Vida SMS] Lembrete: Sua consulta de Clínica Geral com Dr. Manuel Domingos é em 02/10 às 09:30 no Centro Mamã Muxima. Compareça 15 min antes.',
    status: 'delivered'
  },
  {
    id: 'notif-2',
    appointmentId: 'apt-101',
    recipientName: 'Ana Paula Silva',
    recipientContact: 'ana.silva@email.com',
    type: 'email',
    timestamp: '2026-09-28 08:30',
    message: '[Pró-Vida Email] Confirmação de Agendamento Protocolo PV-2026-0901. Detalhes anexos e orientações pré-consulta para Centro Mamã Muxima.',
    status: 'delivered'
  },
  {
    id: 'notif-3',
    appointmentId: 'apt-102',
    recipientName: 'Ana Paula Silva',
    recipientContact: '+244 923 456 789',
    type: 'sms',
    timestamp: '2026-09-27 14:35',
    message: '[Pró-Vida SMS] Lembrete: Ecografia marcada para 06/10 às 10:00 no Centro Santo André. Favor cumprir o jejum recomendado.',
    status: 'delivered'
  },
  {
    id: 'notif-4',
    appointmentId: 'apt-106',
    recipientName: 'Maria Costa (mãe de Lucas)',
    recipientContact: '+244 921 777 888',
    type: 'sms',
    timestamp: '2026-09-28 09:00',
    message: '[Pró-Vida SMS] Lembrete: Consulta de Pediatria com Dra. Rosa Kiala amanhã (29/09) às 10:00 no Centro Mamã Muxima. Trazer boletim de vacinas.',
    status: 'delivered'
  }
];

export const MONTHLY_STATS_DATA: MonthlyStats[] = [
  {
    month: 'Maio/2026',
    totalAppointments: 420,
    completedAppointments: 398,
    centerStats: {
      mamaMuxima: 175,
      santoAndre: 140,
      santaAna: 105
    },
    serviceStats: {
      'Clínica Geral': 120,
      'Pediatria': 95,
      'Pré-Natal': 60,
      'Ginecologia': 45,
      'Urologia': 35,
      'Ecografia': 40,
      'Laboratório': 25
    }
  },
  {
    month: 'Junho/2026',
    totalAppointments: 485,
    completedAppointments: 462,
    centerStats: {
      mamaMuxima: 200,
      santoAndre: 165,
      santaAna: 120
    },
    serviceStats: {
      'Clínica Geral': 135,
      'Pediatria': 110,
      'Pré-Natal': 70,
      'Ginecologia': 52,
      'Urologia': 40,
      'Ecografia': 48,
      'Laboratório': 30
    }
  },
  {
    month: 'Julho/2026',
    totalAppointments: 530,
    completedAppointments: 508,
    centerStats: {
      mamaMuxima: 220,
      santoAndre: 180,
      santaAna: 130
    },
    serviceStats: {
      'Clínica Geral': 150,
      'Pediatria': 125,
      'Pré-Natal': 75,
      'Ginecologia': 58,
      'Urologia': 42,
      'Ecografia': 50,
      'Laboratório': 30
    }
  },
  {
    month: 'Agosto/2026',
    totalAppointments: 610,
    completedAppointments: 585,
    centerStats: {
      mamaMuxima: 260,
      santoAndre: 205,
      santaAna: 145
    },
    serviceStats: {
      'Clínica Geral': 170,
      'Pediatria': 140,
      'Pré-Natal': 90,
      'Ginecologia': 68,
      'Urologia': 52,
      'Ecografia': 55,
      'Laboratório': 35
    }
  },
  {
    month: 'Setembro/2026 (Atual)',
    totalAppointments: 684,
    completedAppointments: 642,
    centerStats: {
      mamaMuxima: 294,
      santoAndre: 225,
      santaAna: 165
    },
    serviceStats: {
      'Clínica Geral': 195,
      'Pediatria': 160,
      'Pré-Natal': 102,
      'Ginecologia': 75,
      'Urologia': 58,
      'Ecografia': 62,
      'Laboratório': 32
    }
  }
];

export const INITIAL_TRIAGES: QuickTriageData[] = [
  {
    id: 'tri-001',
    appointmentId: 'apt-101',
    protocolNumber: 'PV-2026-0901',
    patientId: 'user-patient',
    patientName: 'Ana Paula Silva',
    patientPhone: '+244 923 456 789',
    patientDocument: '006892341LA042',
    centerId: 'mama-muxima',
    centerName: 'Centro Médico Mamã Muxima',
    serviceId: 'clinica-geral',
    serviceName: 'Clínica Geral',
    date: '2026-09-28',
    time: '08:45',
    weight: '64.5',
    height: '168',
    bmi: '22.9',
    bmiCategory: 'Peso Normal',
    temperature: '36.5',
    temperatureStatus: 'normal',
    bloodPressureSystolic: '120',
    bloodPressureDiastolic: '80',
    bloodPressure: '120/80 mmHg',
    bloodPressureStatus: 'normal',
    heartRate: '72',
    oxygenSaturation: '98',
    bloodGlucose: '92',
    painLevel: 1,
    mainSymptoms: 'Leve cansaço vespertino e aferição preventiva para consulta.',
    symptomDuration: 'Há 3 dias',
    allergies: 'Nenhuma alergia conhecida a medicamentos',
    currentMedications: 'Nenhum medicamento contínuo',
    priorityLevel: 'verde',
    observations: 'Sinais vitais normais. Triagem rápida realizada previamente no Portal do Paciente.',
    submittedAt: '2026-09-28T08:45:00.000Z'
  },
  {
    id: 'tri-002',
    appointmentId: 'apt-104',
    protocolNumber: 'PV-2026-0914',
    patientId: 'pat-999',
    patientName: 'João Baptista Mateus',
    patientPhone: '+244 934 111 222',
    patientDocument: '001239845LA033',
    centerId: 'santa-ana',
    centerName: 'Centro Médico Santa Ana',
    serviceId: 'urologia',
    serviceName: 'Urologia',
    date: '2026-09-28',
    time: '09:15',
    weight: '78.0',
    height: '175',
    bmi: '25.5',
    bmiCategory: 'Sobrepeso Leve',
    temperature: '36.6',
    temperatureStatus: 'normal',
    bloodPressureSystolic: '128',
    bloodPressureDiastolic: '84',
    bloodPressure: '128/84 mmHg',
    bloodPressureStatus: 'pre_hipertensao',
    heartRate: '76',
    oxygenSaturation: '97',
    bloodGlucose: '102',
    painLevel: 0,
    mainSymptoms: 'Prevenção anual sem queixas álgicas agudas.',
    symptomDuration: 'Sem sintomas agudos',
    allergies: 'Nenhuma',
    currentMedications: 'Nenhum',
    priorityLevel: 'verde',
    observations: 'Pressão limítrofe, orientado sobre hidratação e redução de sódio.',
    submittedAt: '2026-09-28T09:15:00.000Z'
  }
];

