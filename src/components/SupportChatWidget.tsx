import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Calendar,
  PhoneCall,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  Building,
  HelpCircle,
  Minimize2,
  Maximize2,
  ExternalLink,
  Bot,
  User as UserIcon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  actions?: Array<{
    label: string;
    actionType: 'open_booking' | 'call_support' | 'open_centers' | 'open_services' | 'view_docs';
  }>;
}

export const SupportChatWidget: React.FC = () => {
  const { setIsBookingModalOpen, setActiveTab, showToast } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'assistant',
      text: 'Olá! Sou a Enfª Paula, assistente de triagem e acolhimento do Projeto Pró-Vida. 👋',
      time: 'Agora'
    },
    {
      id: 'msg-welcome-2',
      sender: 'assistant',
      text: 'Está com alguma dúvida sobre quais documentos levar, preparo para exames em jejum ou qual dos nossos 3 centros médicos escolher (Mamã Muxima, Santo André ou Santa Ana)?',
      time: 'Agora',
      actions: [
        { label: '📋 Que documentos devo levar?', actionType: 'view_docs' },
        { label: '🧪 Preparo para exames e jejum', actionType: 'open_services' },
        { label: '🗓️ Marcar consulta agora', actionType: 'open_booking' },
        { label: '🏥 Onde ficam os 3 centros?', actionType: 'open_centers' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      if (!hasOpenedBefore) {
        setHasOpenedBefore(true);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleActionClick = (actionType: string) => {
    if (actionType === 'open_booking') {
      setIsBookingModalOpen(true);
      setIsOpen(false);
    } else if (actionType === 'call_support') {
      showToast('📞 Linha de Apoio do Projeto Pró-Vida: +244 912 000 111 / +244 923 112 233');
    } else if (actionType === 'open_centers') {
      setActiveTab('centers');
      setIsOpen(false);
    } else if (actionType === 'open_services') {
      setActiveTab('services');
      setIsOpen(false);
    } else if (actionType === 'view_docs') {
      handleUserSendMessage('Que documentos são necessários para a consulta?');
    }
  };

  const generateBotReply = (userQuery: string): { text: string; actions?: ChatMessage['actions'] } => {
    const q = userQuery.toLowerCase();

    // Documents check
    if (
      q.includes('documento') ||
      q.includes('documenta') ||
      q.includes('bi') ||
      q.includes('cedula') ||
      q.includes('identidade') ||
      q.includes('levar') ||
      q.includes('preciso levar') ||
      q.includes('certidao')
    ) {
      return {
        text: `📋 **Documentação Necessária para o Atendimento:**\n\n1. **Documento de Identificação:** Bilhete de Identidade (BI) original válido ou Cédula Pessoal / Certidão de Nascimento para crianças.\n2. **Para Pediatria:** Boletim de Vacinas da criança atualizado e caderneta de saúde infantil.\n3. **Para Pré-Natal:** Caderneta da gestante e últimas ecografias/análises efetuadas.\n4. **Exames Anteriores:** Se tiver análises de sangue, relatórios de ecografia ou receitas de uso contínuo, traga para avaliação do médico.\n5. **Comprovativo de Agendamento:** Baixe o PDF da marcação aqui no site ou mostre o SMS de confirmação na recepção.`,
        actions: [
          { label: '🗓️ Agendar consulta com meus dados', actionType: 'open_booking' },
          { label: '📞 Falar com a recepção', actionType: 'call_support' }
        ]
      };
    }

    // Fasting / Preparo de Exames
    if (
      q.includes('jejum') ||
      q.includes('exame') ||
      q.includes('sangue') ||
      q.includes('analise') ||
      q.includes('ecografia') ||
      q.includes('urina') ||
      q.includes('laboratorio') ||
      q.includes('agua') ||
      q.includes('comer')
    ) {
      return {
        text: `🧪 **Orientações de Preparo para Exames & Laboratório:**\n\n• **Exames de Sangue (Glicemia, Perfil Lipídico, Bioquímica):** Jejum de 8 a 12 horas (pode beber pouca água pura).\n• **Ecografia Abdominal Total:** Jejum alimentar de 6 a 8 horas para evitar gases intestinais.\n• **Ecografia Pélvica / Renal / Vias Urinárias:** Beba 4 a 6 copos de água 1 hora antes do exame e segure a urina para a bexiga estar cheia.\n• **Ecografia Obstétrica:** Não requer preparo nem jejum.\n• **Sumário de Urina:** Coleta preferencial da 1ª urina da manhã em frasco esterilizado.`,
        actions: [
          { label: 'Marcar Exame ou Ecografia', actionType: 'open_booking' },
          { label: 'Ver todos os exames', actionType: 'open_services' }
        ]
      };
    }

    // Centros médicos / Localização
    if (
      q.includes('centro') ||
      q.includes('mama muxima') ||
      q.includes('santo andre') ||
      q.includes('santa ana') ||
      q.includes('onde') ||
      q.includes('viana') ||
      q.includes('kilamba') ||
      q.includes('cazenga') ||
      q.includes('morada') ||
      q.includes('endereco') ||
      q.includes('localizacao')
    ) {
      return {
        text: `🏥 **Nossos 3 Centros Médicos Pró-Vida:**\n\n1. **Centro Mamã Muxima (Viana):** Av. Deolinda Rodrigues Km 14. Especialista em Pediatria, Clínica Geral, Ecografia 4D e Laboratório 24h.\n2. **Centro Santo André (Kilamba / Belas):** Centralidade do Kilamba, Bloco C-12. Referência em Pré-Natal, Ginecologia e Saúde Materno-Infantil.\n3. **Centro Santa Ana (Cazenga):** Rua dos Comandos, Zona 4. Foco em Urologia, Triagem Clínica Rápida e Exames Físicos admissionais.`,
        actions: [
          { label: 'Ver detalhes dos 3 Centros', actionType: 'open_centers' },
          { label: 'Marcar num centro', actionType: 'open_booking' }
        ]
      };
    }

    // Agendamento e PDF
    if (
      q.includes('marcar') ||
      q.includes('agendar') ||
      q.includes('pdf') ||
      q.includes('comprovativo') ||
      q.includes('horario') ||
      q.includes('vaga') ||
      q.includes('dia') ||
      q.includes('ficha')
    ) {
      return {
        text: `📅 **Como Agendar e Baixar seu PDF:**\n\n1. Clique em **"Marcar Consulta"** no menu ou aqui no chat.\n2. Escolha o Centro Médico mais perto de você e o serviço desejado.\n3. Escolha o médico, o dia e horário que melhor convier.\n4. Preencha seu nome, BI e telefone para receber o lembrete por SMS.\n5. Clique em Confirmar e baixe instantaneamente a **Ficha de Marcação em PDF** com o código do protocolo!`,
        actions: [
          { label: 'Abrir Agendador Agora', actionType: 'open_booking' },
          { label: '📞 Apoio por telefone', actionType: 'call_support' }
        ]
      };
    }

    // Hospedagem e Gratuidade
    if (
      q.includes('hospedagem') ||
      q.includes('gratis') ||
      q.includes('gratuito') ||
      q.includes('preco') ||
      q.includes('valor') ||
      q.includes('pagar') ||
      q.includes('custo') ||
      q.includes('social') ||
      q.includes('dormir') ||
      q.includes('provincias')
    ) {
      return {
        text: `🤝 **Hospedagem & Atendimento Gratuito / Subsidiado:**\n\nO Projeto Pró-Vida é uma iniciativa de cariz social e humanitário. Oferecemos atendimento gratuito ou com taxa simbólica comunitária.\n\nPara pacientes que viajam de províncias ou zonas periféricas distantes, disponibilizamos **acolhimento diurno e apoio logístico gratuito** para que façam as suas consultas e exames com total dignidade e conforto.`,
        actions: [
          { label: 'Agendar Consulta Social', actionType: 'open_booking' },
          { label: '📞 Linha de Apoio Social', actionType: 'call_support' }
        ]
      };
    }

    // Pediatria
    if (q.includes('pediatria') || q.includes('bebe') || q.includes('filho') || q.includes('crianca')) {
      return {
        text: `👶 **Consulta de Pediatria no Pró-Vida:**\n\nDisponível nos centros Mamã Muxima, Santo André e Santa Ana. Cuidado carinhoso com Dra. Rosa Kiala e equipa especializada.\n\n⚠️ **Obrigatório trazer:** Boletim de Vacinas, certidão de nascimento/cédula e chegar 15 minutos antes para pesagem e medição.`,
        actions: [
          { label: 'Marcar Pediatria', actionType: 'open_booking' }
        ]
      };
    }

    // Default Fallback
    return {
      text: `Entendi sua dúvida sobre "${userQuery}".\n\nVocê pode agendar sua consulta a qualquer momento pelo portal, ou comparecer diretamente à recepção dos Centros Mamã Muxima, Santo André ou Santa Ana.\n\nLembre-se de levar sempre o **Bilhete de Identidade (BI)** ou Cédula da criança. Caso precise de apoio direto da nossa equipa, ligue para a linha de atendimento central: **+244 912 000 111**.`,
      actions: [
        { label: '🗓️ Marcar Consulta Agora', actionType: 'open_booking' },
        { label: '📋 Lista de Documentos', actionType: 'view_docs' },
        { label: '📞 Ligar para a Recepção', actionType: 'call_support' }
      ]
    };
  };

  const handleUserSendMessage = (queryText?: string) => {
    const textToSend = queryText || inputValue.trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsTyping(true);

    // Simulate realistic typing response
    setTimeout(() => {
      const replyData = generateBotReply(textToSend);
      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyData.text,
        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        actions: replyData.actions
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Tooltip callout badge on desktop */}
          <div
            onClick={handleOpenChat}
            className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800 animate-fadeIn"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Dúvidas com agendamento ou documentos?</span>
            <span className="text-teal-600 font-bold flex items-center">
              Fale Conosco <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Floating Pill Button */}
          <button
            onClick={handleOpenChat}
            className="group relative flex items-center justify-center p-3.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-full shadow-2xl shadow-teal-700/40 hover:shadow-teal-600/50 hover:scale-105 active:scale-95 transition-all"
            aria-label="Abrir suporte em tempo real"
          >
            <div className="relative flex items-center gap-2">
              <MessageSquare className="w-6 h-6 stroke-[2.2]" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                Apoio Pró-Vida
              </span>

              {/* Online Green Badge */}
              <span className="absolute -top-1 -right-1 sm:static w-3 h-3 bg-emerald-400 border-2 border-teal-800 rounded-full animate-pulse" />
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-slideUp font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-200">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm leading-tight text-white">
                    Suporte & Acolhimento
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/90 leading-tight mt-0.5">
                  Enfª Paula • Dúvidas de Marcação & Documentos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                title="Fechar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Institutional Alert Ribbon */}
          <div className="bg-teal-50/80 px-3.5 py-1.5 border-b border-teal-100 flex items-center justify-between text-[11px] text-teal-900 font-medium">
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Centros Mamã Muxima, Santo André & Santa Ana</span>
            </span>
            <span className="text-slate-400 text-[10px]">24h</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    PV
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl shadow-2xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Optional Action Chips inside message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act.actionType)}
                          className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-800 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-2xs flex items-center gap-1 text-left"
                        >
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`text-[9px] text-slate-400 block px-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion row */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none text-[11px]">
            <button
              onClick={() => handleUserSendMessage('Que documentos preciso levar para a consulta?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200"
            >
              📄 Documentos necessários
            </button>
            <button
              onClick={() => handleUserSendMessage('Como é o jejum para análises de sangue e ecografia?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200"
            >
              🧪 Jejum e preparo
            </button>
            <button
              onClick={() => handleUserSendMessage('Como funciona a hospedagem e atendimento gratuito?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200"
            >
              🏠 Hospedagem gratuita
            </button>
            <button
              onClick={() => handleUserSendMessage('Onde fica o centro Mamã Muxima, Santo André e Santa Ana?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200"
            >
              🏥 Endereço dos 3 centros
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida sobre marcação ou documentos..."
              className="flex-1 bg-slate-100 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />

            <button
              onClick={() => handleUserSendMessage()}
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
