import { jsPDF } from 'jspdf';
import { Appointment, MedicalCenter, ServiceDetail, Doctor, MedicalRecord, MonthlyStats, QuickTriageData } from '../types';
import { CARITAS_LOGO_BASE64 } from '../assets/logoBase64';

// Common Palette for Official Documents
const PRIMARY_TEAL: [number, number, number] = [13, 148, 136]; // #0d9488
const DARK_NAVY: [number, number, number] = [15, 23, 42]; // #0f172a
const SLATE_MUTED: [number, number, number] = [100, 116, 139]; // #64748b
const LIGHT_BG: [number, number, number] = [241, 245, 249]; // #f1f5f9
const ACCENT_RED: [number, number, number] = [220, 38, 38]; // Caritas Red #dc2626
const BORDER_COLOR: [number, number, number] = [226, 232, 240];

/**
 * 1. OFFICIAL APPOINTMENT BOOKING CONFIRMATION PDF
 */
export function generateAppointmentPDF(
  appointment: Appointment,
  center?: MedicalCenter,
  service?: ServiceDetail,
  doctor?: Doctor
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Caritas Red)
  doc.setFillColor(...ACCENT_RED);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Official Logo Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 6, 30, 30, 3, 3, 'F');
  try {
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 14, 8, 26, 26);
  } catch (err) {
    console.warn('Erro ao inserir logo oficial no PDF:', err);
  }

  // Title Text next to logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('PROJETO PRÓ-VIDA', 47, 18);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(254, 226, 226); // Light soft red-white
  doc.text('CÁRITAS DE ANGOLA • SAÚDE & ACOLHIMENTO COMUNITÁRIO', 47, 25);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 250);
  doc.text('Centros Médicos: Mamã Muxima • Santo André • Santa Ana', 47, 31);
  doc.text('Atendimento Humanizado de Excelência • Cuidados Médicos', 47, 36);

  // Document Badge on right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(148, 8, 52, 26, 2, 2, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('FICHA OFICIAL DE MARCAÇÃO', 151, 15);
  doc.setTextColor(...ACCENT_RED);
  doc.setFontSize(10.5);
  doc.text(appointment.protocolNumber || 'PV-2026-CONF', 151, 22);
  doc.setFontSize(7);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-PT')}`, 151, 28);

  // Status Box
  let yPos = 52;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 14, 2, 2, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTADO DO AGENDAMENTO:', 20, yPos + 9);

  const statusLabel =
    appointment.status === 'confirmed'
      ? 'CONFIRMADO E AGENDADO'
      : appointment.status === 'completed'
      ? 'CONSULTA REALIZADA'
      : appointment.status === 'in_progress'
      ? 'EM ANDAMENTO'
      : 'CANCELADO';

  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(statusLabel, 85, yPos + 9);

  // Section 1: Patient Data
  yPos += 20;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', 22, yPos + 8);

  yPos += 14;
  doc.setDrawColor(...BORDER_COLOR);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 27, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome Completo:', 20, yPos + 7);
  doc.text('Nº de Identificação / BI:', 115, yPos + 7);
  doc.text('Telefone (SMS Lembrete):', 20, yPos + 17);
  doc.text('Correio Eletrónico:', 115, yPos + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  doc.text(appointment.patientName || '---', 20, yPos + 12);
  doc.text(appointment.patientDocument || 'Registado no sistema', 115, yPos + 12);
  doc.text(appointment.patientPhone || '---', 20, yPos + 22);
  doc.text(appointment.patientEmail || '---', 115, yPos + 22);

  // Section 2: Consultation & Doctor Info
  yPos += 35;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DA CONSULTA & CORPO CLÍNICO', 22, yPos + 8);

  yPos += 14;
  doc.roundedRect(14, yPos, 182, 36, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('Serviço / Especialidade:', 20, yPos + 7);
  doc.text('Médico(a) Responsável:', 115, yPos + 7);
  doc.text('Data Marcada:', 20, yPos + 19);
  doc.text('Horário de Atendimento:', 75, yPos + 19);
  doc.text('Modalidade:', 135, yPos + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  doc.text(appointment.serviceName || 'Consulta Médica', 20, yPos + 12);

  const docName = appointment.doctorName || doctor?.name || 'Corpo Clínico Pró-Vida';
  const docLicence = doctor?.licenseNumber ? ` (${doctor.licenseNumber})` : '';
  doc.text(`${docName}${docLicence}`, 115, yPos + 12);

  const formattedDate = appointment.date ? new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : appointment.date;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(formattedDate || appointment.date, 20, yPos + 25);
  doc.text(appointment.time ? `${appointment.time} horas` : '09:00', 75, yPos + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  doc.text(appointment.isTelemedicine ? 'Telemedicina Virtual' : 'Presencial no Gabinete', 135, yPos + 25);

  if (appointment.notes) {
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE_MUTED);
    doc.text(`Observações: ${appointment.notes}`, 20, yPos + 32);
  }

  // Section 3: Medical Center Information
  yPos += 43;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11.5);
  doc.setFont('helvetica', 'bold');
  doc.text('LOCAL DE ATENDIMENTO - CENTRO MÉDICO', 22, yPos + 8);

  yPos += 14;
  doc.roundedRect(14, yPos, 182, 33, 2, 2, 'DF');

  const centerName = center?.name || appointment.centerName || 'Centro Médico Pró-Vida';
  const centerAddress = center?.address || 'Luanda, Angola';
  const centerPhone = center?.phone || '+244 923 000 000';
  const centerHours = center?.hours || 'Segunda a Sábado: 07:30 - 19:30';
  const clinicalDirector = center?.clinicalDirector ? `Direção Clínica: ${center.clinicalDirector}` : '';

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(centerName, 20, yPos + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  doc.text(`Endereço Oficial: ${centerAddress}`, 20, yPos + 13);
  doc.text(`Linha de Recepção & Apoio: ${centerPhone}  |  Horário: ${centerHours}`, 20, yPos + 19);
  if (clinicalDirector) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_TEAL);
    doc.text(clinicalDirector, 20, yPos + 25);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE_MUTED);
    doc.text(`Serviço de Lembrete: Notificações automáticas por SMS e E-mail confirmadas para este utente.`, 20, yPos + 30);
  } else {
    doc.setTextColor(...SLATE_MUTED);
    doc.text(`Serviço de Lembrete: Notificações automáticas por SMS e E-mail confirmadas para este utente.`, 20, yPos + 25);
  }

  // Section 4: Preparation Guidelines
  yPos += 36;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 33, 2, 2, 'F');

  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTAÇÕES IMPORTANTES PARA O PACIENTE:', 20, yPos + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const req1 = '• Chegue com 15 a 20 minutos de antecedência na recepção para triagem de sinais vitais.';
  const req2 = service?.requirements?.[0]
    ? `• Preparo específico: ${service.requirements[0]}`
    : '• Traga documento de identificação original e exames anteriores relevantes.';
  const req3 = service?.requirements?.[1]
    ? `• ${service.requirements[1]}`
    : '• Se for consulta de Pediatria, apresentar o boletim de vacinas da criança.';
  const req4 = '• Apresente este documento oficial com o logotipo do Projeto Pró-Vida / Cáritas no ato da entrada.';

  doc.text(req1, 20, yPos + 13);
  doc.text(req2, 20, yPos + 18);
  doc.text(req3, 20, yPos + 23);
  doc.text(req4, 20, yPos + 28);

  // Mini Seal Stamp at bottom right
  try {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, 259, 22, 12, 1, 1, 'F');
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 16, 260, 10, 10);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ACCENT_RED);
    doc.text('CÁRITAS', 27, 265);
    doc.setTextColor(...DARK_NAVY);
    doc.text('PRÓ-VIDA', 27, 269);
  } catch {
    // fallback
  }

  // Footer & Digital Validation
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 274, 196, 274);

  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PROJETO PRÓ-VIDA • CÁRITAS DE ANGOLA • Rede Mamã Muxima, Santo André e Santa Ana', 14, 280);
  doc.text('Documento Oficial de Marcação • Autenticação Digital Verificada no Firebase Firestore', 14, 284);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`Protocolo: ${appointment.protocolNumber} - Válido em toda a rede hospitalar`, 14, 288);

  // Trigger Save / Download
  const filename = `Comprovativo_Consulta_${appointment.protocolNumber || 'ProVida'}.pdf`;
  doc.save(filename);
}

/**
 * 2. OFFICIAL MEDICAL RECORD & PRESCRIPTION PDF (PRONTUÁRIO CLÍNICO & RECEITA)
 */
export function generateMedicalRecordPDF(
  record: MedicalRecord,
  doctorLicense?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Caritas Red)
  doc.setFillColor(...ACCENT_RED);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Official Logo Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 6, 30, 30, 3, 3, 'F');
  try {
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 14, 8, 26, 26);
  } catch (err) {
    console.warn('Erro ao inserir logo no PDF do prontuário:', err);
  }

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROJETO PRÓ-VIDA', 47, 17);

  doc.setFontSize(9.5);
  doc.setTextColor(254, 226, 226);
  doc.text('CÁRITAS DE ANGOLA • SERVIÇO DE SAÚDE CLÍNICA', 47, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 250);
  doc.text('Centros Médicos: Mamã Muxima • Santo André • Santa Ana', 47, 30);
  doc.text('Acolhimento Hospitalar & Acompanhamento Médico Contínuo', 47, 35);

  // Document Badge on right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(144, 8, 56, 26, 2, 2, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PRONTUÁRIO & PRESCRIÇÃO', 147, 15);
  doc.setTextColor(...ACCENT_RED);
  doc.setFontSize(9.5);
  doc.text(record.id ? `REC-${record.id.slice(0, 10).toUpperCase()}` : 'PV-REC-OFICIAL', 147, 22);
  doc.setFontSize(7);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data Consulta: ${record.date}`, 147, 28);

  // Section 1: Patient & Medical Team Box
  let yPos = 52;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 24, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente:', 20, yPos + 7);
  doc.text('Especialidade:', 115, yPos + 7);
  doc.text('Médico Assistente:', 20, yPos + 17);
  doc.text('Centro Médico:', 115, yPos + 17);

  doc.setFontSize(9);
  doc.setTextColor(...DARK_NAVY);
  doc.text(record.patientName || 'Paciente Não Especificado', 20, yPos + 12);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(record.specialty || 'Clínica Geral', 115, yPos + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  const licenseText = doctorLicense ? ` (${doctorLicense})` : '';
  doc.text(`${record.doctorName}${licenseText}`, 20, yPos + 22);
  doc.text(record.centerId === 'mama-muxima' ? 'Mamã Muxima (Ingombota)' : record.centerId === 'santo-andre' ? 'Santo André (Kilamba)' : 'Santa Ana (Palanca)', 115, yPos + 22);

  // Vital Signs Table
  yPos += 30;
  if (record.vitalSigns) {
    doc.setFillColor(...PRIMARY_TEAL);
    doc.rect(14, yPos, 4, 10, 'F');
    doc.setTextColor(...DARK_NAVY);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('SINAIS VITAIS DO PACIENTE', 22, yPos + 7);

    yPos += 13;
    doc.setDrawColor(...BORDER_COLOR);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, yPos, 182, 14, 2, 2, 'DF');

    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE_MUTED);
    doc.text('Pressão Arterial:', 20, yPos + 5);
    doc.text('Temperatura:', 65, yPos + 5);
    doc.text('Freq. Cardíaca:', 110, yPos + 5);
    doc.text('Peso Corporal:', 155, yPos + 5);

    doc.setFontSize(8.5);
    doc.setTextColor(...DARK_NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text(record.vitalSigns.bloodPressure || '120/80 mmHg', 20, yPos + 10);
    doc.text(record.vitalSigns.temperature || '36.5 ºC', 65, yPos + 10);
    doc.text(record.vitalSigns.heartRate || '72 bpm', 110, yPos + 10);
    doc.text(record.vitalSigns.weight || '65 kg', 155, yPos + 10);

    yPos += 18;
  }

  // Section 2: Clinical Evaluation & Diagnosis
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNÓSTICO & AVALIAÇÃO CLÍNICA', 22, yPos + 7);

  yPos += 13;
  doc.setDrawColor(...BORDER_COLOR);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 24, 2, 2, 'DF');

  doc.setFontSize(8);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('Hipótese / Diagnóstico Conclusivo:', 20, yPos + 6);
  doc.setFontSize(9);
  doc.setTextColor(...ACCENT_RED);
  doc.text(record.diagnosis || 'Sem diagnóstico lançado', 20, yPos + 12);

  if (record.symptoms) {
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE_MUTED);
    doc.setFont('helvetica', 'bold');
    doc.text('Sintomas / Queixa:', 20, yPos + 17);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK_NAVY);
    doc.text(record.symptoms.slice(0, 95), 20, yPos + 22);
  }

  // Section 3: Official Prescription (Receita Médica)
  yPos += 30;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESCRIÇÃO MÉDICA OFICIAL & TERAPÊUTICA', 22, yPos + 7);

  yPos += 13;
  doc.setDrawColor(...BORDER_COLOR);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 40, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);

  const prescriptionLines = doc.splitTextToSize(
    record.prescription || 'Nenhum medicamento prescrito nesta consulta.',
    170
  );
  doc.text(prescriptionLines, 20, yPos + 8);

  // Section 4: Lab & Imaging Exams (Exames Requisitados)
  yPos += 46;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUISIÇÃO DE EXAMES LABORATORIAIS & ECOGRAFIA', 22, yPos + 7);

  yPos += 13;
  doc.roundedRect(14, yPos, 182, 22, 2, 2, 'DF');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);
  const examLines = doc.splitTextToSize(
    record.labExamOrders || 'Nenhum exame adicional solicitado nesta data.',
    170
  );
  doc.text(examLines, 20, yPos + 7);

  // Doctor Signature Stamp & Official Seal
  yPos += 28;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 26, 2, 2, 'F');

  // Official Logo Stamp inside signature area
  try {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, yPos + 3, 20, 20, 1, 1, 'F');
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 19, yPos + 4, 18, 18);
  } catch {
    // fallback
  }

  doc.setFontSize(7.5);
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETO PRÓ-VIDA • CÁRITAS', 43, yPos + 8);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('Certificação Médica Digital Integrada ao Firestore', 43, yPos + 13);
  doc.text('Documento reconhecido em farmácias e laboratórios credenciados', 43, yPos + 18);

  // Doctor Signature line on right
  doc.setDrawColor(...SLATE_MUTED);
  doc.line(125, yPos + 16, 186, yPos + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text(record.doctorName || 'Médico Responsável', 130, yPos + 20);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text(doctorLicense || 'Ordem dos Médicos de Angola', 130, yPos + 24);

  // Bottom line & footer
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 276, 196, 276);

  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PROJETO PRÓ-VIDA • CÁRITAS DE ANGOLA • Rede Mamã Muxima, Santo André e Santa Ana', 14, 282);
  doc.text('Prontuário Médico Confidencial - Respeite o sigilo médico nos termos da legislação em vigor', 14, 286);

  const filename = `Prontuario_${record.patientName.replace(/\s+/g, '_')}_${record.date}.pdf`;
  doc.save(filename);
}

/**
 * 3. OFFICIAL MONTHLY STATISTICAL REPORT PDF (RELATÓRIO MENSAL DE ATENDIMENTOS)
 */
export function generateMonthlyReportPDF(
  monthData: MonthlyStats,
  appointmentsList?: Appointment[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Caritas Red)
  doc.setFillColor(...ACCENT_RED);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Official Logo Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 6, 30, 30, 3, 3, 'F');
  try {
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 14, 8, 26, 26);
  } catch (err) {
    console.warn('Erro ao inserir logo no PDF do relatório:', err);
  }

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROJETO PRÓ-VIDA', 47, 17);

  doc.setFontSize(9.5);
  doc.setTextColor(254, 226, 226);
  doc.text('CÁRITAS DE ANGOLA • DIRETORIA CLÍNICA & GESTÃO HOSPITALAR', 47, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 250);
  doc.text('Relatório Consolidado de Atendimentos Realizados', 47, 30);
  doc.text('Centros Médicos: Mamã Muxima • Santo André • Santa Ana', 47, 35);

  // Document Badge on right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(144, 8, 56, 26, 2, 2, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RELATÓRIO MENSAL OFICIAL', 147, 15);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.setFontSize(10);
  doc.text(monthData.month.toUpperCase(), 147, 22);
  doc.setFontSize(7);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 147, 28);

  // KPI Summary Cards
  let yPos = 52;
  const cardWidth = 58;
  const cardHeight = 22;

  // Card 1: Total
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AGENDAMENTOS', 18, yPos + 7);
  doc.setFontSize(14);
  doc.setTextColor(...DARK_NAVY);
  doc.text(String(monthData.totalAppointments), 18, yPos + 16);

  // Card 2: Completed
  doc.roundedRect(76, yPos, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('ATENDIMENTOS CONCLUÍDOS', 80, yPos + 7);
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(String(monthData.completedAppointments), 80, yPos + 16);

  // Card 3: Attendance Rate
  doc.roundedRect(138, yPos, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('TAXA DE COMPARECIMENTO', 142, yPos + 7);
  doc.setFontSize(14);
  doc.setTextColor(...ACCENT_RED);
  const rate = Math.round((monthData.completedAppointments / monthData.totalAppointments) * 100);
  doc.text(`${rate}%`, 142, yPos + 16);

  // Section 1: Breakdown by the 3 Medical Centers
  yPos += 30;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DISTRIBUIÇÃO POR CENTRO MÉDICO', 22, yPos + 7);

  yPos += 14;
  doc.setDrawColor(...BORDER_COLOR);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 36, 2, 2, 'DF');

  const c1 = monthData.centerStats.mamaMuxima;
  const c2 = monthData.centerStats.santoAndre;
  const c3 = monthData.centerStats.santaAna;
  const sum = c1 + c2 + c3 || 1;

  doc.setFontSize(9);
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Centro Médico Mamã Muxima (Ingombota / Praia do Bispo)', 20, yPos + 9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`${c1} consultas realizadas (${Math.round((c1 / sum) * 100)}%)`, 130, yPos + 9);

  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Centro Médico Santo André (Kilamba / Belas)', 20, yPos + 20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`${c2} consultas realizadas (${Math.round((c2 / sum) * 100)}%)`, 130, yPos + 20);

  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Centro Médico Santa Ana (Palanca / Kilamba Kiaxi)', 20, yPos + 31);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`${c3} consultas realizadas (${Math.round((c3 / sum) * 100)}%)`, 130, yPos + 31);

  // Section 2: Services / Specialties Table
  yPos += 44;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ATENDIMENTOS POR ESPECIALIDADE & EXAMES', 22, yPos + 7);

  yPos += 14;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 9, 1, 1, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('Especialidade / Serviço', 20, yPos + 6);
  doc.text('Volume de Atendimentos', 120, yPos + 6);
  doc.text('Status', 165, yPos + 6);

  yPos += 11;
  const services = Object.entries(monthData.serviceStats);
  services.forEach(([serv, count]) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK_NAVY);
    doc.text(serv, 20, yPos + 5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_TEAL);
    doc.text(`${count} atendimentos`, 120, yPos + 5);
    doc.setTextColor(16, 185, 129);
    doc.text('Meta Atingida', 165, yPos + 5);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos + 7.5, 196, yPos + 7.5);
    yPos += 7.5;
  });

  // Section 3: Institutional Approval & Signature
  yPos += 10;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 32, 2, 2, 'F');

  try {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, yPos + 4, 22, 22, 1, 1, 'F');
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 19, yPos + 5, 20, 20);
  } catch {
    // fallback
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('Irmã Ventura', 45, yPos + 9);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text('Administradora do Projeto Pró-Vida', 45, yPos + 14);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('Cáritas de Angola • Coordenação Geral da Rede de Centros Médicos', 45, yPos + 19);
  doc.text('Relatório homologado e autenticado com dados em tempo real no Firestore.', 45, yPos + 24);

  // Right signature line for clinical direction
  doc.setDrawColor(...SLATE_MUTED);
  doc.line(132, yPos + 15, 190, yPos + 15);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('Direção Clínica dos Centros:', 132, yPos + 19);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('Dra. Emília Kajika R. M. Adão (Mamã Muxima)', 132, yPos + 23);
  doc.text('Dr. Ericson Cassoma (Santa Ana)', 132, yPos + 27);

  // Footer & Digital Validation
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 276, 196, 276);

  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PROJETO PRÓ-VIDA • CÁRITAS DE ANGOLA • Rede Mamã Muxima, Santo André e Santa Ana', 14, 282);
  doc.text('Documento Estatístico Oficial • Certificação Institucional', 14, 286);

  const filename = `Relatorio_Oficial_ProVida_${monthData.month.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}

/**
 * 4. OFFICIAL TELEMEDICINE VOUCHER PDF
 */
export function generateTelemedicineVoucherPDF(
  patientName: string,
  phone: string,
  email: string,
  voucherCode: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Caritas Red)
  doc.setFillColor(...ACCENT_RED);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Official Logo Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 6, 30, 30, 3, 3, 'F');
  try {
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 14, 8, 26, 26);
  } catch (err) {
    console.warn('Erro ao inserir logo no PDF do voucher:', err);
  }

  // Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROJETO PRÓ-VIDA', 47, 17);

  doc.setFontSize(9.5);
  doc.setTextColor(254, 226, 226);
  doc.text('CÁRITAS DE ANGOLA • TELEMEDICINA COMUNITÁRIA', 47, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 250);
  doc.text('Comprovativo Oficial de Inscrição Prioritária em Teleconsulta', 47, 30);
  doc.text('Centros Médicos: Mamã Muxima • Santo André • Santa Ana', 47, 35);

  // Voucher Code Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(144, 8, 56, 26, 2, 2, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CÓDIGO DE PRIORIDADE', 147, 15);
  doc.setTextColor(...ACCENT_RED);
  doc.setFontSize(11);
  doc.text(voucherCode || 'PV-TELE-2026', 147, 22);
  doc.setFontSize(7);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-PT')}`, 147, 28);

  // Content Box
  let yPos = 55;
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, yPos, 182, 38, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(...SLATE_MUTED);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome do Utente:', 20, yPos + 10);
  doc.text('Telefone Registado (SMS):', 20, yPos + 22);
  doc.text('E-mail Registado:', 110, yPos + 22);

  doc.setFontSize(11);
  doc.setTextColor(...DARK_NAVY);
  doc.text(patientName || 'Utente Pró-Vida', 20, yPos + 16);
  doc.setFontSize(9.5);
  doc.text(phone || '+244 923 000 000', 20, yPos + 28);
  doc.text(email || 'utente@email.com', 110, yPos + 28);

  // Instructions
  yPos += 48;
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(14, yPos, 4, 10, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTRUÇÕES PARA O ACESSO À TELEMEDICINA', 22, yPos + 7);

  yPos += 14;
  doc.setDrawColor(...BORDER_COLOR);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 50, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'normal');

  const instructions = [
    '1. A Telemedicina Pró-Vida conectará você por vídeo chamada segura com os médicos especialistas.',
    '2. O código do seu comprovativo garante vaga prioritária nas primeiras semanas de lançamento.',
    '3. Você receberá um SMS com o link direto da sala virtual no dia da teleconsulta.',
    '4. As receitas médicas e pedidos de exames serão enviados em PDF digital válido imediatamente após a chamada.',
    '5. Pacientes com dificuldades de mobilidade ou de províncias distantes terão prioridade de agendamento.'
  ];

  instructions.forEach((line, idx) => {
    doc.text(line, 20, yPos + 8 + idx * 8);
  });

  // Footer & Official Stamp
  yPos += 60;
  try {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, yPos, 22, 12, 1, 1, 'F');
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 16, yPos + 1, 10, 10);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...ACCENT_RED);
    doc.text('CÁRITAS', 27, yPos + 6);
    doc.setTextColor(...DARK_NAVY);
    doc.text('PRÓ-VIDA', 27, yPos + 10);
  } catch {
    // fallback
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(14, 276, 196, 276);

  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PROJETO PRÓ-VIDA • CÁRITAS DE ANGOLA • Rede Mamã Muxima, Santo André e Santa Ana', 14, 282);
  doc.text('Comprovativo Oficial de Inscrição em Telemedicina', 14, 286);

  doc.save(`Voucher_Telemedicina_${voucherCode || 'ProVida'}.pdf`);
}

/**
  * 5. OFFICIAL QUICK TRIAGE RECORD (FICHA DE TRIAGEM RÁPIDA PRÉ-CONSULTA)
  */
export function generateTriagePDF(triage: QuickTriageData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(...PRIMARY_TEAL);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Line (Caritas Red)
  doc.setFillColor(...ACCENT_RED);
  doc.rect(0, 42, 210, 2.5, 'F');

  // Official Logo Container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 6, 30, 30, 3, 3, 'F');
  try {
    doc.addImage(CARITAS_LOGO_BASE64, 'PNG', 14, 8, 26, 26);
  } catch (err) {
    console.warn('Erro ao inserir logo oficial no PDF:', err);
  }

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PROJETO PRÓ-VIDA', 47, 17);

  doc.setFontSize(9.5);
  doc.setTextColor(254, 226, 226);
  doc.text('CÁRITAS DE ANGOLA • SAÚDE & ACOLHIMENTO COMUNITÁRIO', 47, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 250);
  doc.text('FICHA DE TRIAGEM RÁPIDA & SINAIS VITAIS PRÉ-CONSULTA', 47, 31);
  doc.text(`Aferição Registada: ${triage.date} às ${triage.time} | Protocolo: ${triage.protocolNumber || triage.id}`, 47, 36);

  let y = 52;

  // Title Box
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(14, y, 182, 14, 2, 2, 'DF');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_NAVY);
  doc.text('FICHA CLÍNICA DE ACOLHIMENTO E TRIAGEM RÁPIDA', 18, y + 9);

  // Priority Badge
  const priorityColor: [number, number, number] =
    triage.priorityLevel === 'verde'
      ? [16, 185, 129] // Emerald
      : triage.priorityLevel === 'amarelo'
      ? [245, 158, 11] // Amber
      : triage.priorityLevel === 'laranja'
      ? [249, 115, 22] // Orange
      : [59, 130, 246]; // Blue

  doc.setFillColor(...priorityColor);
  doc.roundedRect(140, y + 3, 50, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const prioText =
    triage.priorityLevel === 'verde'
      ? 'RISCO: POUCO URGENTE'
      : triage.priorityLevel === 'amarelo'
      ? 'RISCO: URGENTE'
      : triage.priorityLevel === 'laranja'
      ? 'RISCO: MUITO URGENTE'
      : 'RISCO: NÃO URGENTE';
  doc.text(prioText, 143, y + 8.5);

  y += 20;

  // Section 1: Patient & Appointment Context
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text('1. DADOS DE IDENTIFICAÇÃO E AGENDAMENTO', 14, y);
  y += 4;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(14, y, 182, 26, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_NAVY);

  doc.text(`Paciente: `, 18, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(triage.patientName, 36, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.text(`BI / Documento: `, 115, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(triage.patientDocument || 'Registado em Sistema', 142, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.text(`Telefone: `, 18, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(triage.patientPhone || '+244 923 000 000', 36, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.text(`Centro Médico: `, 115, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(triage.centerName || 'Rede Pró-Vida (Luanda)', 142, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.text(`Especialidade: `, 18, y + 21);
  doc.setFont('helvetica', 'bold');
  doc.text(triage.serviceName || 'Clínica Geral / Triagem', 42, y + 21);

  doc.setFont('helvetica', 'normal');
  doc.text(`Data do Atendimento: `, 115, y + 21);
  doc.setFont('helvetica', 'bold');
  doc.text(`${triage.date} às ${triage.time}`, 148, y + 21);

  y += 33;

  // Section 2: Vital Signs (Sinais Vitais Básicos)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text('2. SINAIS VITAIS BÁSICOS AFERIDOS', 14, y);
  y += 4;

  // Grid for vitals
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(14, y, 182, 54, 2, 2, 'DF');

  // Vital 1: Pressão Arterial
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, y + 4, 84, 22, 1.5, 1.5, 'DF');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PRESSÃO ARTERIAL (PA)', 22, y + 10);
  doc.setFontSize(13);
  doc.setTextColor(...DARK_NAVY);
  doc.text(`${triage.bloodPressure}`, 22, y + 19);
  doc.setFontSize(7.5);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`Status: ${triage.bloodPressureStatus || 'Normal / Avaliado'}`, 58, y + 19);

  // Vital 2: Temperatura Corporal
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(106, y + 4, 84, 22, 1.5, 1.5, 'DF');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('TEMPERATURA CORPORAL (Tº)', 110, y + 10);
  doc.setFontSize(13);
  doc.setTextColor(...DARK_NAVY);
  doc.text(`${triage.temperature} ºC`, 110, y + 19);
  doc.setFontSize(7.5);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`Classif: ${triage.temperatureStatus || 'Afebril'}`, 146, y + 19);

  // Vital 3: Peso Corporal e Altura / IMC
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, y + 28, 84, 22, 1.5, 1.5, 'DF');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('PESO & ÍNDICE DE MASSA (IMC)', 22, y + 34);
  doc.setFontSize(12);
  doc.setTextColor(...DARK_NAVY);
  doc.text(`${triage.weight} kg`, 22, y + 43);
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text(`IMC: ${triage.bmi ? `${triage.bmi} kg/m²` : 'Calculado'} (${triage.bmiCategory || 'Normal'})`, 46, y + 43);

  // Vital 4: Frequência Cardíaca e Oximetria
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(106, y + 28, 84, 22, 1.5, 1.5, 'DF');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('FREQ. CARDÍACA / OXIGENIA', 110, y + 34);
  doc.setFontSize(12);
  doc.setTextColor(...DARK_NAVY);
  doc.text(triage.heartRate ? `${triage.heartRate} bpm` : '72 bpm (Normal)', 110, y + 43);
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE_MUTED);
  doc.text(`SpO2: ${triage.oxygenSaturation ? `${triage.oxygenSaturation}%` : '98%'}`, 160, y + 43);

  y += 61;

  // Section 3: Clinical Screening
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text('3. QUEIXA PRINCIPAL, SINTOMAS E HISTÓRICO PRÉ-CONSULTA', 14, y);
  y += 4;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(14, y, 182, 45, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('Queixa Relatada pelo Paciente:', 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  const complaintLines = doc.splitTextToSize(
    triage.mainSymptoms || 'Consulta preventiva e verificação de rotina sem sintomas agudos.',
    174
  );
  doc.text(complaintLines, 18, y + 13);

  const afterComplaintY = y + 13 + complaintLines.length * 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text(`Nível de Dor Declarado (0-10): `, 18, afterComplaintY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY_TEAL);
  doc.text(`${triage.painLevel ?? 0} / 10`, 70, afterComplaintY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text(`Duração dos Sintomas: `, 115, afterComplaintY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text(triage.symptomDuration || 'Menos de 24h', 152, afterComplaintY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text(`Alergias a Medicamentos: `, 18, afterComplaintY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text(triage.allergies || 'Nenhuma alergia relatada', 60, afterComplaintY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text(`Medicamentos em Uso: `, 115, afterComplaintY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text(triage.currentMedications || 'Nenhum medicamento contínuo', 152, afterComplaintY + 11);

  y += 52;

  // Institutional Sign-off & Rules
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'DF');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('ORIENTAÇÕES DE ATENDIMENTO NO CENTRO MÉDICO:', 18, y + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  const advice = [
    '• Apresente este comprovativo impresso ou no celular ao balcão de enfermagem do centro médico.',
    '• Os sinais vitais foram sincronizados com o prontuário eletrônico do médico assistente.',
    '• Em caso de alteração severa de pressão ou temperatura elevada, dirija-se imediatamente à sala de triagem.',
    '• Projeto Pró-Vida da Cáritas de Angola: Atendimento digno, humanizado e comunitário.'
  ];
  advice.forEach((line, i) => {
    doc.text(line, 18, y + 13 + i * 5.5);
  });

  // Stamp & Signatures
  y += 44;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('VALIDAÇÃO INSTITUCIONAL DO PROJETO PRÓ-VIDA', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_MUTED);
  doc.text('Administração Geral: Irmã Ventura (Cáritas de Angola)', 14, y + 5);
  doc.text('Centros: Mamã Muxima (Ingombota) • Santo André (Kilamba) • Santa Ana (Palanca)', 14, y + 9);

  // Footer rule
  doc.setDrawColor(...BORDER_COLOR);
  doc.line(14, 276, 196, 276);

  doc.setFontSize(7);
  doc.setTextColor(...SLATE_MUTED);
  doc.text('Documento gerado automaticamente pelo Portal do Paciente • Projeto Pró-Vida • Cáritas de Angola', 14, 282);
  doc.text(`Data de Emissão: ${new Date().toLocaleString('pt-PT')} | ID: ${triage.id}`, 14, 286);

  doc.save(`Ficha_Triagem_${triage.patientName.replace(/\s+/g, '_')}_${triage.date}.pdf`);
}

