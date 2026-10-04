import { NextRequest, NextResponse } from 'next/server';
import { generateInfraResponse, ChatMessage, InfraResponse } from '@/lib/infraEngine';
import { INFRA_SYSTEM_PROMPT } from '@/lib/infraKnowledge';
import { GoogleGenAI } from '@google/genai';

const STRICT_GROUNDING_PROMPT = `
${INFRA_SYSTEM_PROMPT}

### ABSOLUTE BEHAVIORAL AND KNOWLEDGE BOUNDARIES (STRICTLY ENFORCED):

1. SINGLE SOURCE OF TRUTH (WEBSITE DATA ONLY):
   - You are "Infra", the dedicated Architectural AI Concierge exclusively for Soul Space Infrastructure in Coimbatore, Tamil Nadu.
   - You have access ONLY to official website portfolio data across Soul Space's 5 official services:
     * Independent Luxury Villas: Aurum (33 Villas in Vilankurichi)
     * Luxury Apartments: ABV Arbor (12 Luxury Flats in Ramanathapuram near Race Course)
     * Budget Apartments: Soulspace Uptown (110 Crafted Apartments in Eachanari)
     * Commercial Workspaces: Dot Com (16 Column-Free Commercial IT Workspaces in PN Palayam)
     * Farmhouse Villas: Mystic (2.5-Acre Coconut Plantation Farmhouses in Semmedu near Isha Adiyogi)
     * Vastu & Manaiyadi Shastra engineering & materials (PT Slabs, Teakwood, Kohler/Roca, M25/M30 concrete)
   - Answer questions regarding these projects with 100% precision.

2. TEXT ONLY — ZERO IMAGES OR VIDEOS (STRICTLY FORBIDDEN):
   - You are strictly a TEXT-ONLY assistant. You CANNOT, MUST NOT, and ARE UNABLE TO generate, draw, render, encode, or simulate images, photos, drawings, videos, ASCII art, or SVG graphics.
   - If a user asks to generate, show, create, draw, or render images or videos:
   - YOU MUST DECLINE:
     "I am a text-only architectural concierge and do not generate images or videos. You can view photography and renders directly on our website project pages, or contact our team directly at [+91 91591 33331](tel:+919159133331) or [Chat on WhatsApp](https://wa.me/919159133331)."

3. MANDATORY DENIAL & CLICKABLE CONTACT LINKS FOR ANY OUTSIDE QUERY:
   - If the user asks about ANYTHING outside this website data (general world knowledge, math, coding, jokes, politics, recipes, weather, other developers):
   - YOU MUST EXPLICITLY DENY and provide BOTH the phone and WhatsApp links:
     "I am dedicated exclusively to Soul Space Infrastructure's architectural portfolio in Coimbatore. I cannot assist with inquiries outside our official developments. For personalized assistance, please call our Sales Concierge at [+91 91591 33331](tel:+919159133331) or [Chat on WhatsApp](https://wa.me/919159133331)."

4. MANDATORY LINKED PHONE AND WHATSAPP IN ALL RESPONSES:
   - Whenever mentioning contact channels, ALWAYS format BOTH as clean clickable links:
     - Phone: [+91 91591 33331](tel:+919159133331)
     - WhatsApp: [Chat on WhatsApp](https://wa.me/919159133331)

5. CONCISE LOW-TOKEN RESPONSES:
   - Keep responses crisp, elegant, and strictly under 150 words. Avoid unnecessary filler to conserve tokens.
`;

function determineActionLinkAndPrompts(reply: string): { actionLink?: { label: string; url: string }; suggestedPrompts?: string[] } {
  const lower = reply.toLowerCase();
  if (lower.includes('aurum')) {
    return {
      actionLink: { label: 'Explore Aurum Villas Monograph', url: '/projects/aurum-villas' },
      suggestedPrompts: ['Explore Aurum Floor Plans', 'Schedule a site visit to Aurum', 'Nearby landmarks to Aurum', 'Call Sales Concierge'],
    };
  }
  if (lower.includes('arbor')) {
    return {
      actionLink: { label: 'Explore ABV Arbor Details', url: '/projects/abv-arbor' },
      suggestedPrompts: ['View ABV Arbor Layouts', 'Proximity to Race Course', 'Schedule a visit to ABV Arbor', 'Call Sales Concierge'],
    };
  }
  if (lower.includes('dot com') || lower.includes('dotcom')) {
    return {
      actionLink: { label: 'Explore Dot Com Commercial Suites', url: '/projects/dotcom-workspaces' },
      suggestedPrompts: ['View Dot Com Floor Plans', 'Learn about PT Slab engineering', 'Schedule a commercial consultation'],
    };
  }
  if (lower.includes('mystic')) {
    return {
      actionLink: { label: 'Explore Mystic Plantation Retreat', url: '/projects/mystic-villas' },
      suggestedPrompts: ['What is the 80-20 concept?', 'Siruvani water quality', 'Schedule a private visit to Mystic'],
    };
  }
  if (lower.includes('uptown')) {
    return {
      actionLink: { label: 'Explore Soul Space Uptown', url: '/projects/uptown-residences' },
      suggestedPrompts: ['View Uptown 1, 2 & 3 BHK Plans', 'Distance to Rathinam Techpark', 'Schedule a site visit'],
    };
  }
  return {
    suggestedPrompts: ['Tell me about Aurum Villas', 'What is the 80-20 concept at Mystic?', 'ABV Arbor near Race Course', 'Call Sales Concierge'],
  };
}

function sanitizeReply(text: string): string {
  return text.replace(/\[([^\]]+)\]\s*\n\s*\(([^)]+)\)/g, (m, p1, p2) => `[${p1}](${p2})`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = (body.message || '').trim();
    const history: ChatMessage[] = body.history || [];

    if (!message) {
      return NextResponse.json({ reply: 'Please provide an inquiry.' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. If Google Gemini API Key is provided
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        // Priority list: Lowest token / fastest models first
        const candidateModels = [
          process.env.GEMINI_MODEL,
          'gemini-3.1-flash-lite',
          'gemini-flash-lite-latest',
          'gemini-3.8-flash',
        ].filter(Boolean) as string[];

        // Keep input tokens minimal: only last 3 messages of history
        const contents = [
          ...history.slice(-3).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ];

        let reply = '';
        for (const model of candidateModels) {
          try {
            const res = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: STRICT_GROUNDING_PROMPT,
                temperature: 0.2,
                maxOutputTokens: 250, // Low token budget
              },
            });
            reply = res.text?.trim() || '';
            if (reply) break;
          } catch (err) {
            console.warn(`Model ${model} unavailable, trying next candidate...`);
          }
        }

        if (reply) {
          const cleanReply = sanitizeReply(reply);
          const extras = determineActionLinkAndPrompts(cleanReply);
          return NextResponse.json({
            reply: cleanReply,
            ...extras,
          });
        }
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to local engine:', geminiError);
      }
    }

    // 2. If OpenAI API Key is provided
    if (openaiKey) {
      try {
        const modelName = process.env.OPENAI_MODEL || 'gpt-4o';
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: STRICT_GROUNDING_PROMPT },
              ...history.slice(-6).map((m) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
              })),
              { role: 'user', content: message },
            ],
            temperature: 0.25,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            const cleanReply = sanitizeReply(reply);
            const extras = determineActionLinkAndPrompts(cleanReply);
            return NextResponse.json({
              reply: cleanReply,
              ...extras,
            });
          }
        }
      } catch (openaiError) {
        console.error('OpenAI API call failed, falling back to local engine:', openaiError);
      }
    }

    // 3. Fallback: Intelligent Deterministic Grounded Engine
    const fallbackResponse: InfraResponse = generateInfraResponse(message, history);
    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error('Chat API general error:', error);
    return NextResponse.json(
      {
        reply: 'Our architectural concierge desk is directly reachable at **+91 91591 33331**, or you may re-send your inquiry.',
      },
      { status: 500 }
    );
  }
}
