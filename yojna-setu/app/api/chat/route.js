import Anthropic from '@anthropic-ai/sdk';
import { getSchemeSummaryForAI } from '../../../lib/schemes';

// --------------- DEMO MODE (no API key needed) ---------------
function getDemoResponse(userText, language) {
  const t = userText.toLowerCase();

  const isFarmer = /farmer|kisan|किसान|ರೈತ|விவசாய|రైతు/.test(t);
  const isWidow = /widow|विधवा|ವಿಧವೆ|விதவை|వితంతు/.test(t);
  const isBPL = /bpl|ration|राशन|ration card|poor|garib|गरीब/.test(t);
  const isPregnant = /pregnant|गर्भव|ಗರ್ಭಿಣಿ|கர்ப்பிணி|గర్భిణీ|maternity/.test(t);
  const isStudent = /student|पढ़|school|college|scholarship/.test(t);
  const isOld = /old|बुजुर्ग|pension|60|65|70|elderly/.test(t);
  const isVendor = /vendor|hawker|street|thela|रेहड़ी/.test(t);
  const hasGirlChild = /daughter|बेटी|girl child|sukanya/.test(t);

  const responses = {
    hi: {
      farmer: {
        message: `नमस्ते! आपकी जानकारी के आधार पर, आप इन 3 योजनाओं के लिए पात्र हो सकते हैं:\n\n1. **पीएम-किसान** — ₹6,000/साल सीधे बैंक में (3 किश्तों में)\n2. **पीएम फसल बीमा** — बाढ़/सूखे में फसल नुकसान पर मुआवजा\n3. **किसान क्रेडिट कार्ड** — मात्र 4% ब्याज पर ₹3 लाख तक कृषि ऋण\n\nआधार कार्ड और जमीन के कागज लेकर अपने नजदीकी बैंक या CSC केंद्र में जाएं। क्या आप किसी एक योजना के बारे में विस्तार से जानना चाहते हैं?`,
        schemes: ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card'],
      },
      widow: {
        message: `मैं आपकी कठिन परिस्थिति समझता हूँ। आपके लिए ये योजनाएँ उपलब्ध हैं:\n\n1. **विधवा पेंशन (IGNWPS)** — हर महीने ₹500-800 पेंशन\n2. **आयुष्मान भारत** — ₹5 लाख तक का मुफ्त इलाज\n3. **पीएम आवास योजना** — पक्का मकान बनाने के लिए ₹1.20 लाख\n\nग्राम पंचायत में जाकर विधवा प्रमाण पत्र के साथ आवेदन करें। हिम्मत रखें, आपके हक की मदद सरकार करेगी! 💪`,
        schemes: ['ignwps', 'ayushman-bharat', 'pmay-gramin'],
      },
      generic: {
        message: `नमस्ते! मैं योजना-सेतु हूँ। मुझे थोड़ी जानकारी दें:\n\n• आप किस राज्य से हैं?\n• क्या काम करते हैं (किसान/मजदूर/व्यापारी)?\n• BPL/राशन कार्ड है?\n• परिवार में कितने सदस्य हैं?\n\nआपकी जानकारी के आधार पर मैं आपके लिए सबसे फायदेमंद सरकारी योजनाएँ खोजूँगा! 🎯`,
        schemes: [],
      },
    },
    en: {
      farmer: {
        message: `Hello! Based on what you've told me, you may be eligible for:\n\n1. **PM-KISAN** — ₹6,000/year directly to your bank account\n2. **PM Fasal Bima** — Crop insurance against floods and drought\n3. **Kisan Credit Card** — Agriculture loans at just 4% interest rate\n\nVisit your nearest bank or CSC centre with your Aadhaar card and land documents. Would you like details on how to apply for any of these?`,
        schemes: ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card'],
      },
      widow: {
        message: `I understand your situation. Here are schemes available for you:\n\n1. **Widow Pension (IGNWPS)** — Monthly pension of ₹500-800\n2. **Ayushman Bharat** — Free hospital treatment up to ₹5 lakh\n3. **PMAY-Gramin** — ₹1.20 lakh to build a pucca house\n\nVisit your Gram Panchayat with your husband's death certificate to apply. You have every right to these benefits! 💪`,
        schemes: ['ignwps', 'ayushman-bharat', 'pmay-gramin'],
      },
      generic: {
        message: `Hello! I'm Yojna-Setu. To find the best government schemes for you, please tell me:\n\n• Which state are you from?\n• What is your occupation (farmer, laborer, vendor)?\n• Do you have a BPL/ration card?\n• How many family members do you have?\n\nI'll match you to the most beneficial welfare schemes! 🎯`,
        schemes: [],
      },
    },
  };

  const langResponses = responses[language] || responses.en;
  let picked;

  if (isFarmer) picked = langResponses.farmer;
  else if (isWidow) picked = langResponses.widow;
  else picked = langResponses.generic;

  return {
    message: picked.message,
    detected_language: language,
    matched_scheme_ids: picked.schemes,
    extracted_profile: { is_farmer: isFarmer, is_widow: isWidow, is_bpl: isBPL },
    follow_up_needed: picked.schemes.length === 0,
    follow_up_question: null,
    demo_mode: true,
  };
}
// ---------------------------------------------------------------

const getClient = () => {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'YOUR_API_KEY_HERE') {
    return null;
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
};

const SYSTEM_PROMPT = (schemesJson) => `You are Yojna-Setu (योजना-सेतु), a caring and helpful AI assistant that helps rural Indians discover government welfare schemes they are eligible for.

You speak in whichever language the user speaks to you - Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు), or English. Always mirror the user's language.

GOVERNMENT SCHEMES DATABASE:
${schemesJson}

YOUR TASK:
1. Listen to the user describe their situation (location, occupation, income, family, age, etc.)
2. Ask gentle follow-up questions if you need more information
3. Match them with relevant schemes from the database above
4. Explain the benefits clearly in simple language they can understand
5. Tell them exactly how to apply

RESPONSE FORMAT (ALWAYS respond with valid JSON):
{
  "message": "Your warm, helpful response in the USER's language. Mention matched schemes by name with key benefits. Use simple words, no jargon.",
  "detected_language": "hi|kn|ta|te|en",
  "matched_scheme_ids": ["scheme-id-1", "scheme-id-2"],
  "extracted_profile": {
    "state": "detected state if mentioned",
    "occupation": "detected occupation",
    "income_category": "BPL/APL/unknown",
    "age": "detected age if mentioned",
    "gender": "male/female/unknown",
    "family_size": "number if mentioned",
    "has_ration_card": true/false/null,
    "has_land": true/false/null,
    "is_farmer": true/false/null,
    "is_widow": true/false/null,
    "has_disability": true/false/null,
    "has_girl_child": true/false/null,
    "is_pregnant": true/false/null,
    "is_student": true/false/null
  },
  "follow_up_needed": true/false,
  "follow_up_question": "Next question to ask in user's language (only if follow_up_needed is true)"
}

IMPORTANT RULES:
- Always be warm, respectful and encouraging
- Use simple words, avoid bureaucratic language
- If user speaks Hindi, respond in Hindi. If Kannada, respond in Kannada, etc.
- Match schemes accurately - don't suggest schemes they clearly don't qualify for
- Mention the benefit amount clearly (e.g., "आपको ₹6,000 मिलेंगे")
- If unsure about eligibility, still mention the scheme but note the condition
- Always end with an encouragement to apply
- For first message with very little info, ask key questions: state, occupation, income level`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const client = getClient();

    // DEMO MODE: no API key configured
    if (!client) {
      const lastUserMsg = messages.filter(m => m.role === 'user').at(-1)?.content || '';
      const demoData = getDemoResponse(lastUserMsg, language || 'hi');
      demoData.message = `⚡ DEMO MODE (add ANTHROPIC_API_KEY for full AI)\n\n${demoData.message}`;
      return Response.json({ success: true, data: demoData });
    }

    // LIVE MODE: use Claude AI
    const schemesJson = JSON.stringify(getSchemeSummaryForAI(), null, 2);
    const systemPrompt = SYSTEM_PROMPT(schemesJson);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages,
    });

    const rawContent = response.content[0].text;

    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      parsed = {
        message: rawContent,
        detected_language: language || 'hi',
        matched_scheme_ids: [],
        extracted_profile: {},
        follow_up_needed: false,
        follow_up_question: null,
      };
    }

    return Response.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({
      error: 'Failed to process request',
      details: error.message,
    }, { status: 500 });
  }
}
