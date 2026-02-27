import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { getSchemeSummaryForAI } from '../../../lib/schemes';

// Claude model on AWS Bedrock — billed to your AWS credits
// claude-3-5-haiku is fast + cheap; switch to claude-3-5-sonnet for higher quality
const BEDROCK_MODEL = 'anthropic.claude-3-5-haiku-20241022-v1:0';

const getClient = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }
  return new AnthropicBedrock({
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
  });
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
5. Tell them exactly how to apply (documents needed, where to go)

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

    if (!client) {
      return Response.json({
        error: 'AWS credentials not configured. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to .env.local',
        setup_instructions: 'Go to AWS Console → IAM → Create user with BedrockFullAccess + PollyAccess policies',
      }, { status: 503 });
    }

    const schemesJson = JSON.stringify(getSchemeSummaryForAI(), null, 2);
    const systemPrompt = SYSTEM_PROMPT(schemesJson);

    const response = await client.messages.create({
      model: BEDROCK_MODEL,
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

    // Helpful error messages for common Bedrock issues
    const msg = error.message || '';
    let userFacingError = 'Failed to process request';

    if (msg.includes('AccessDeniedException') || msg.includes('not authorized')) {
      userFacingError = 'AWS IAM permissions error. Make sure your IAM user has AmazonBedrockFullAccess policy.';
    } else if (msg.includes('ResourceNotFoundException') || msg.includes('model')) {
      userFacingError = `Model not available in your region. Try changing AWS_REGION to us-east-1 in .env.local`;
    } else if (msg.includes('ExpiredTokenException') || msg.includes('InvalidSignature')) {
      userFacingError = 'AWS credentials invalid or expired. Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.';
    }

    return Response.json({
      error: userFacingError,
      details: error.message,
    }, { status: 500 });
  }
}
