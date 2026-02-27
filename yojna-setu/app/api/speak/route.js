// TTS API Route - Uses AWS Polly if configured, returns synthesis config otherwise
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const VOICE_MAP = {
  hi: { VoiceId: 'Aditi', LanguageCode: 'hi-IN' },
  kn: { VoiceId: 'Aditi', LanguageCode: 'hi-IN' }, // Polly fallback for Kannada
  ta: { VoiceId: 'Aditi', LanguageCode: 'hi-IN' }, // Polly fallback for Tamil
  te: { VoiceId: 'Aditi', LanguageCode: 'hi-IN' }, // Polly fallback for Telugu
  en: { VoiceId: 'Joanna', LanguageCode: 'en-US' },
};

// Browser TTS language codes for client-side fallback
const BROWSER_LANG_MAP = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  en: 'en-IN',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, language = 'hi' } = body;

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if AWS credentials are available
    const hasAWSConfig = process.env.AWS_ACCESS_KEY_ID &&
                         process.env.AWS_SECRET_ACCESS_KEY &&
                         process.env.AWS_REGION;

    if (hasAWSConfig) {
      // Use AWS Polly for high-quality TTS
      const pollyClient = new PollyClient({
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const voice = VOICE_MAP[language] || VOICE_MAP.hi;

      const command = new SynthesizeSpeechCommand({
        Text: text.slice(0, 3000), // Polly limit
        OutputFormat: 'mp3',
        VoiceId: voice.VoiceId,
        LanguageCode: voice.LanguageCode,
        Engine: 'standard',
      });

      const response = await pollyClient.send(command);
      const audioStream = response.AudioStream;

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = audioBuffer.toString('base64');

      return Response.json({
        success: true,
        source: 'polly',
        audioData: base64Audio,
        mimeType: 'audio/mpeg',
        language: language,
        browserLang: BROWSER_LANG_MAP[language] || 'hi-IN',
      });
    } else {
      // Return info for browser-based TTS (Web Speech API)
      return Response.json({
        success: true,
        source: 'browser',
        text: text,
        language: language,
        browserLang: BROWSER_LANG_MAP[language] || 'hi-IN',
        message: 'Using browser speech synthesis (add AWS credentials for better voice quality)',
      });
    }
  } catch (error) {
    console.error('Speak API error:', error);

    // Always fallback to browser TTS on error
    return Response.json({
      success: true,
      source: 'browser',
      text: request.body?.text || '',
      language: 'hi',
      browserLang: 'hi-IN',
      error: error.message,
    });
  }
}
