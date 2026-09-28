import { jsPDF } from 'jspdf';
import { Appointment, MedicalCenter, ServiceDetail, Doctor } from '../types';

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

  // Color Palette
  const primaryTeal: [number, number, number] = [13, 148, 136]; // #0d9488
  const darkNavy: [number, number, number] = [15, 23, 42]; // #0f172a
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748b
  const lightBg: [number, number, number] = [241, 245, 249]; // #f1f5f9
  const accentEmerald: [number, number, number] = [16, 185, 129];

  // Header Banner
  doc.setFillColor(...primaryTeal);
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line
  doc.setFillColor(...accentEmerald);
  doc.rect(0, 36, 210, 2, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PROJETO PRÓ-VIDA', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('REDE DE CENTROS MÉDICOS E SAÚDE COMUNITÁRIA', 14, 25);
  doc.text('Hospedagem & Atendimento Humanizado de Excelência', 14, 30);

  // Document Badge on right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(135, 8, 62, 22, 2, 2, 'F');
  doc.setTextColor(...darkNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FICHA DE MARCAÇÃO', 140, 15);
  doc.setTextColor(...primaryTeal);
  doc.setFontSize(11);
  doc.text(appointment.protocolNumber || 'PV-2026-CONF', 140, 22);
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emitido: ${new Date().toLocaleDateString('pt-PT')}`, 140, 27);

  // Status Box
  let yPos = 48;
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, yPos, 182, 14, 2, 2, 'F');
  doc.setTextColor(...darkNavy);
  doc.setFontSize(10);
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

  doc.setTextColor(...primaryTeal);
  doc.text(statusLabel, 85, yPos + 9);

  // Section 1: Patient Data
  yPos += 22;
  doc.setFillColor(...primaryTeal);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...darkNavy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', 22, yPos + 8);

  yPos += 14;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, yPos, 182, 28, 2, 2, 'DF');

  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome Completo:', 20, yPos + 8);
  doc.text('Nº de Identificação / BI:', 115, yPos + 8);
  doc.text('Telefone (SMS Lembrete):', 20, yPos + 18);
  doc.text('Correio Eletrónico:', 115, yPos + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkNavy);
  doc.text(appointment.patientName || '---', 20, yPos + 13);
  doc.text(appointment.patientDocument || 'Registado no sistema', 115, yPos + 13);
  doc.text(appointment.patientPhone || '---', 20, yPos + 23);
  doc.text(appointment.patientEmail || '---', 115, yPos + 23);

  // Section 2: Consultation & Doctor Info
  yPos += 36;
  doc.setFillColor(...primaryTeal);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...darkNavy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DA CONSULTA & CORPO CLÍNICO', 22, yPos + 8);

  yPos += 14;
  doc.roundedRect(14, yPos, 182, 38, 2, 2, 'DF');

  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'bold');
  doc.text('Serviço / Especialidade:', 20, yPos + 8);
  doc.text('Médico(a) Responsável:', 115, yPos + 8);
  doc.text('Data Marcada:', 20, yPos + 20);
  doc.text('Horário de Atendimento:', 75, yPos + 20);
  doc.text('Modalidade:', 135, yPos + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkNavy);
  doc.text(appointment.serviceName || 'Consulta Médica', 20, yPos + 13);

  const docName = appointment.doctorName || doctor?.name || 'Corpo Clínico Pró-Vida';
  const docLicence = doctor?.licenseNumber ? ` (${doctor.licenseNumber})` : '';
  doc.text(`${docName}${docLicence}`, 115, yPos + 13);

  const formattedDate = appointment.date ? new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : appointment.date;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryTeal);
  doc.text(formattedDate || appointment.date, 20, yPos + 27);
  doc.text(appointment.time ? `${appointment.time} horas` : '09:00', 75, yPos + 27);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkNavy);
  doc.text(appointment.isTelemedicine ? 'Telemedicina Virtual' : 'Presencial no Gabinete', 135, yPos + 27);

  if (appointment.notes) {
    doc.setFontSize(8);
    doc.setTextColor(...slateMuted);
    doc.text(`Observações: ${appointment.notes}`, 20, yPos + 34);
  }

  // Section 3: Medical Center Information
  yPos += 46;
  doc.setFillColor(...primaryTeal);
  doc.rect(14, yPos, 4, 12, 'F');
  doc.setTextColor(...darkNavy);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LOCAL DE ATENDIMENTO - CENTRO MÉDICO', 22, yPos + 8);

  yPos += 14;
  doc.roundedRect(14, yPos, 182, 30, 2, 2, 'DF');

  const centerName = center?.name || appointment.centerName || 'Centro Médico Pró-Vida';
  const centerAddress = center?.address || 'Luanda, Angola';
  const centerPhone = center?.phone || '+244 923 000 000';
  const centerHours = center?.hours || 'Segunda a Sábado: 07:30 - 19:30';

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryTeal);
  doc.text(centerName, 20, yPos + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkNavy);
  doc.text(`Endereço: ${centerAddress}`, 20, yPos + 15);
  doc.text(`Linha de Apoio & Recepção: ${centerPhone}  |  Horário: ${centerHours}`, 20, yPos + 21);
  doc.setTextColor(...slateMuted);
  doc.text(`Serviço de Lembrete: SMS e E-mail automáticos ativados para este paciente.`, 20, yPos + 26);

  // Section 4: Preparation Guidelines
  yPos += 37;
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, yPos, 182, 34, 2, 2, 'F');

  doc.setTextColor(...darkNavy);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIENTAÇÕES IMPORTANTES PARA O PACIENTE:', 20, yPos + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const req1 = '• Chegue com 15 a 20 minutos de antecedência na recepção para triagem de sinais vitais.';
  const req2 = service?.requirements?.[0]
    ? `• Preparo específico: ${service.requirements[0]}`
    : '• Traga documento de identificação original e exames anteriores relevantes.';
  const req3 = service?.requirements?.[1]
    ? `• ${service.requirements[1]}`
    : '• Se for consulta de Pediatria, apresentar o boletim de vacinas da criança.';
  const req4 = '• Cancelamento ou remarcação com antecedência mínima de 4 horas pelo portal ou telefone.';

  doc.text(req1, 20, yPos + 13);
  doc.text(req2, 20, yPos + 18);
  doc.text(req3, 20, yPos + 23);
  doc.text(req4, 20, yPos + 28);

  // Footer & Digital Validation
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 275, 196, 275);

  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text('PROJETO PRÓ-VIDA • Rede de Centros Mamã Muxima, Santo André e Santa Ana', 14, 281);
  doc.text('Autenticação Digital Verificada • Sistema Integrado de Saúde & Prontuário Eletrónico', 14, 285);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryTeal);
  doc.text(`Protocolo: ${appointment.protocolNumber} - Válido em toda a rede`, 14, 289);

  // Trigger Save / Download
  const filename = `Comprovativo_Consulta_${appointment.protocolNumber || 'ProVida'}.pdf`;
  doc.save(filename);
}
