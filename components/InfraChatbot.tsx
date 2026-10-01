'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Send, 
  RotateCcw, 
  Phone, 
  ExternalLink, 
  ChevronRight 
} from 'lucide-react';
import { ChatMessage, InfraResponse, generateInfraResponse } from '@/lib/infraEngine';
import { useScrollLock } from '@/lib/scrollLock';

/**
 * Dedicated vector insignia for Infra, inspired directly by the
 * Soul Space architectural skyline mark with soft, light architectural framing.
 */
export function InfraBotLogo({ 
  className = 'w-6 h-6', 
  spark = true,
  theme = 'light'
}: { 
  className?: string; 
  spark?: boolean;
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  // Soft, delicate light architectural framing lines (not dark)
  const outerFrameStroke = isDark ? 'rgba(250,248,245,0.3)' : '#D0C6B8';
  const innerFrameStroke = isDark ? 'rgba(250,248,245,0.2)' : '#E2DBD0';
  const towerFill = isDark ? '#FAF8F5' : '#1A1815';
  const stripeColor = isDark ? '#1A1815' : '#FAF8F5';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Architectural Frame (Light Delicate Line) */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        stroke={outerFrameStroke}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner Frame (Very Light Delicate Line) */}
      <rect
        x="13"
        y="13"
        width="74"
        height="74"
        stroke={innerFrameStroke}
        strokeWidth="1.8"
        fill="none"
      />

      {/* Architectural Skyline Towers (Soul Space Signature) */}
      {/* Tower 1 (Left) */}
      <path
        d="M23 80 V69 L34 63 V80 H23Z"
        fill={towerFill}
      />
      {/* Tower 2 (Middle with diagonal louvers) */}
      <path
        d="M36 80 V57 L48 50 V80 H36Z"
        fill={towerFill}
      />
      <path
        d="M37 59 L47 53 M37 64 L47 58 M37 69 L47 63"
        stroke={stripeColor}
        strokeWidth="1.6"
      />
      {/* Tower 3 (Tallest Primary Monolith) */}
      <path
        d="M51 80 V43 L66 30 V80 H51Z"
        fill={towerFill}
      />
      {/* Tower 4 (Right Flank) */}
      <path
        d="M68 80 V35 L75 41 V80 H68Z"
        fill={towerFill}
      />
      {/* Structural Reveal on Tallest Tower */}
      <path
        d="M59 80 V40 L63 37 V80"
        stroke={stripeColor}
        strokeWidth="1.8"
      />

      {/* Architectural beacon at apex */}
      {spark && (
        <path
          d="M74 19 C74 22 77 24 80 24 C77 24 74 26 74 29 C74 26 71 24 68 24 C71 24 74 22 74 19 Z"
          fill={towerFill}
        />
      )}
    </svg>
  );
}

// Minimal, executive welcome message without the redundant training sentence
const INITIAL_WELCOME: ChatMessage = {
  role: 'assistant',
  content: `Good day. I am **Infra**, your architectural concierge for **Soul Space Infrastructure**.

How may I assist your inquiry today?`,
};

const DEFAULT_SUGGESTED_PROMPTS = [
  'Tell me about Aurum Villas',
  'What is the 80-20 concept at Mystic?',
  'ABV Arbor near Race Course',
  'Dot Com PT slab technology',
  'Vastu Shastra science & physics',
  'Schedule a private site visit',
];

export function InfraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(DEFAULT_SUGGESTED_PROMPTS);
  const [actionLink, setActionLink] = useState<{ label: string; url: string } | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Implement background scroll lock while open
  useScrollLock(isOpen);

  // Anchor the user prompt at the VERY TOP of the view when replying or when reply arrives
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend.trim() };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setHasInteracted(true);
    setActionLink(null);

    // Responsive concierge cadence
    setTimeout(() => {
      try {
        const data: InfraResponse = generateInfraResponse(
          textToSend.trim(),
          newHistory.filter(m => m.role !== 'system')
        );
        
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'I am pleased to assist with any further details regarding our portfolio.' },
        ]);

        if (data.suggestedPrompts && data.suggestedPrompts.length > 0) {
          setSuggestedPrompts(data.suggestedPrompts);
        } else {
          setSuggestedPrompts(DEFAULT_SUGGESTED_PROMPTS);
        }

        if (data.actionLink) {
          setActionLink(data.actionLink);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'I apologize for the momentary delay. Our architectural sales desk is directly reachable at **+91 91591 33331**, or you may re-send your inquiry.',
          },
        ]);
        setSuggestedPrompts(['Call Sales Concierge', 'Tell me about Aurum Villas', 'Schedule a site visit']);
      } finally {
        setIsLoading(false);
      }
    }, 320);
  };

  const handleReset = () => {
    setMessages([INITIAL_WELCOME]);
    setSuggestedPrompts(DEFAULT_SUGGESTED_PROMPTS);
    setActionLink(null);
    setInput('');
  };

  /**
   * Executive Minimal Light-Theme Markdown Formatter
   */
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const formattedLine = line.replace(/^[•\-]\s*/, '');

      // Parse bold segments **text**, links [text](url), and phone numbers
      const parseSegments = (str: string) => {
        const parts = [];
        let curr = str;
        let keyCounter = 0;

        while (curr.length > 0) {
          // Check for link [text](url)
          const linkMatch = curr.match(/^\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            parts.push(
              <Link
                key={keyCounter++}
                href={linkMatch[2]}
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 text-[#1A1815] hover:opacity-70 underline underline-offset-2 font-medium transition-opacity"
              >
                {linkMatch[1]}
                <ExternalLink className="w-3 h-3 inline" />
              </Link>
            );
            curr = curr.slice(linkMatch[0].length);
            continue;
          }

          // Check for bold **text**
          const boldMatch = curr.match(/^\*\*(.*?)\*\*/);
          if (boldMatch) {
            parts.push(
              <strong key={keyCounter++} className="font-semibold text-[#1A1815]">
                {boldMatch[1]}
              </strong>
            );
            curr = curr.slice(boldMatch[0].length);
            continue;
          }

          // Check for phone number link
          const phoneMatch = curr.match(/^(\+91\s?[0-9]{5}\s?[0-9]{5})/);
          if (phoneMatch) {
            const rawPhone = phoneMatch[1].replace(/\s+/g, '');
            parts.push(
              <a
                key={keyCounter++}
                href={`tel:${rawPhone}`}
                className="inline-flex items-center gap-1 text-[#1A1815] hover:opacity-70 font-medium underline underline-offset-2"
              >
                {phoneMatch[1]}
              </a>
            );
            curr = curr.slice(phoneMatch[0].length);
            continue;
          }

          // Plain text character
          const nextSpecial = curr.search(/(\[|\*\*|\+91)/);
          if (nextSpecial === -1) {
            parts.push(curr);
            break;
          } else if (nextSpecial === 0) {
            parts.push(curr[0]);
            curr = curr.slice(1);
          } else {
            parts.push(curr.slice(0, nextSpecial));
            curr = curr.slice(nextSpecial);
          }
        }

        return parts;
      };

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 text-[13px] leading-relaxed text-[#38332D]">
            <span className="text-[#1A1815] mt-1 shrink-0 text-xs">◆</span>
            <div className="flex-1">{parseSegments(formattedLine)}</div>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="my-1 text-[13px] leading-relaxed text-[#38332D]">
          {parseSegments(line)}
        </p>
      );
    });
  };

  // Find the index of the latest user message so it gets the ref for anchoring at the top
  const lastUserMessageIndex = messages.map((m) => m.role).lastIndexOf('user');

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING TRIGGER BUTTON (Light Delicate Border, Above WhatsApp)           */}
      {/* ========================================================================= */}
      <div className="fixed bottom-[82px] right-5 sm:bottom-[92px] sm:right-6 z-50 flex items-center select-none print:hidden">
        {/* Subtle Pill Prompt on desktop with light delicate border */}
        {!isOpen && !hasInteracted && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E8E2D8] hover:border-[#D0C6B8] text-[#1A1815] text-xs font-medium shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all cursor-pointer group"
          >
            <span className="text-[#1A1815] transition-colors font-medium">Ask Infra</span>
            <span className="text-[11px] text-[#857D72]">Architectural AI</span>
          </button>
        )}

        {/* Floating Trigger Disc with light delicate border */}
        <button
          id="infra-chatbot-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Infra Architectural Concierge' : 'Open Infra Architectural Concierge'}
          className={`relative flex items-center justify-center w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-full border shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-0 ${
            isOpen
              ? 'bg-[#1A1815] text-[#FAF8F5] border-[#1A1815]'
              : 'bg-[#FAF8F5] hover:bg-[#FFFFFF] text-[#1A1815] border-[#E8E2D8] hover:border-[#D0C6B8]'
          }`}
          title="Infra — Architectural AI Concierge"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-200" />
          ) : (
            <InfraBotLogo className="w-7 h-7 sm:w-8 sm:h-8" />
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CONCIERGE CHAT WINDOW (All Borders Light, Soft Minimal Styling)           */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Infra Architectural Concierge"
          data-lenis-prevent
          className="fixed bottom-[144px] right-4 left-4 sm:left-auto sm:right-6 sm:bottom-[158px] z-50 w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[76vh] flex flex-col rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Minimal Centered Header with light delicate border */}
          <div className="relative px-4 py-3.5 border-b border-[#EFEAE2] bg-[#FAF8F5] flex items-center justify-between">
            {/* Left Action: Reset */}
            <div className="w-8 flex items-center justify-start">
              <button
                onClick={handleReset}
                title="Restart Conversation"
                className="p-1.5 rounded-lg text-[#857D72] hover:text-[#1A1815] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                aria-label="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Center Aligned: Bot Logo + Name "INFRA" (Clean, Centered, Light Delicate Framing) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center mb-0.5">
                <InfraBotLogo className="w-6 h-6" />
              </div>
              <h3 className="font-serif tracking-[0.2em] font-medium text-[#1A1815] text-[15px] leading-tight">
                INFRA
              </h3>
              <p className="text-[10px] text-[#857D72] font-sans tracking-wide uppercase">
                Soul Space Architectural Desk
              </p>
            </div>

            {/* Right Action: Close */}
            <div className="w-8 flex items-center justify-end">
              <button
                onClick={() => setIsOpen(false)}
                title="Close Window"
                className="p-1.5 rounded-lg text-[#857D72] hover:text-[#1A1815] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Message Scrollable Container with Scroll Padding & Light Borders */}
          <div 
            ref={scrollContainerRef}
            data-lenis-prevent
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#FDFBF9] scroll-pt-3 scrollbar-thin scrollbar-thumb-[#EAE4DC] scrollbar-track-transparent"
          >
            {messages.map((msg, idx) => {
              const isLastUser = idx === lastUserMessageIndex;

              return (
                <div
                  key={idx}
                  ref={isLastUser ? lastUserMessageRef : undefined}
                  className={`flex flex-col scroll-mt-3 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
                      msg.role === 'user'
                        ? 'bg-[#F5F0E8] text-[#1A1815] border border-[#E8E2D8] rounded-tr-none'
                        : 'bg-[#FFFFFF] text-[#24211D] border border-[#EFEAE2] rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#F4EFE7]">
                        <span className="text-[10px] tracking-wider uppercase font-semibold text-[#1A1815]">
                          Infra
                        </span>
                      </div>
                    )}
                    {renderFormattedContent(msg.content)}
                  </div>
                </div>
              );
            })}

            {/* Action Link Button if provided */}
            {actionLink && !isLoading && (
              <div className="flex justify-start pl-1 pt-1">
                <Link
                  href={actionLink.url}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1815] hover:bg-[#2C2824] text-[#FAF8F5] font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <span>{actionLink.label}</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            )}

            {/* Minimal Replying Text Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-tl-none bg-[#FFFFFF] border border-[#EFEAE2] px-3.5 py-2 text-xs flex items-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1815]/60 animate-pulse" />
                  <span className="font-sans text-[12px] text-[#756E65] tracking-wide">
                    Infra is replying...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Suggestion Chips with light delicate borders */}
          <div className="px-3.5 py-2 border-t border-[#EFEAE2] bg-[#FAF8F5] overflow-x-auto scrollbar-none flex gap-1.5 items-center">
            {suggestedPrompts.slice(0, 4).map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] bg-[#F5F0E8] hover:bg-[#EFEAE2] text-[#554D43] hover:text-[#1A1815] border border-[#E8E2D8] hover:border-[#D0C6B8] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Minimal Input Bar with light delicate borders */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#EFEAE2] bg-[#FAF8F5] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire with Infra (e.g. Aurum, Vastu, Mystic)..."
              disabled={isLoading}
              className="flex-1 bg-[#FFFFFF] border border-[#E8E2D8] focus:border-[#C4B9AA] focus:ring-1 focus:ring-[#C4B9AA]/20 text-xs sm:text-sm text-[#1A1815] placeholder-[#948C80] rounded-xl px-3.5 py-2.5 shadow-sm focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-[#1A1815] hover:bg-[#2C2824] disabled:opacity-30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5 text-white" />
            </button>
          </form>

          {/* Footer Direct Line Badge with light border */}
          <div className="px-4 py-1.5 bg-[#FAF8F5] border-t border-[#EFEAE2] flex items-center justify-between text-[10px] text-[#756E65]">
            <span>Executive Sales Desk:</span>
            <a
              href="tel:+919159133331"
              className="flex items-center gap-1 text-[#1A1815] hover:underline font-medium"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>+91 91591 33331</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
