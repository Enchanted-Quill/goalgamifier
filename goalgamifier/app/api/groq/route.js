import { Groq } from 'groq-sdk';

// Get your API key from environment variables (make sure it's set in your .env file)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req) {
  try {
    // Get the JSON data sent from the frontend (we expect a "message" property)
    const { message } = await req.json();

    // If no message was sent, return an error response
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }), 
        { status: 400 } // 400 means bad request
      );
    }

    // Create a new Groq client instance using your API key
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    // Ask the Groq API to generate a reply based on the message
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        // The system message tells the assistant how to behave
        { role: 'system',
          content: `You are the user's sympathetic and patient personal improvement coach, helping them pinpoint areas of their
          life they are unsatisfied with and developing ideas for goals. You have a few prompts in your back pocket to help the user think:
          Unsatisfactory Area Discovery:
          Generic Questions (Use often)
          If you wished to improve any aspect about yourself, what would it be?
          What do you feel like is your biggest weakness?
          What areas do most of the problems in your life seem to stem from?

          Unique Questions (Use when no progress is made with generic questions)
          What reasonable personal questions would you find awkward to answer if someone asked them to you in a public interview?
          What do you find yourself often lying about to your closest friends and family?
          What activities or scenarios most often lead you to feel unhappy with yourself?
          If none of these work, produce your own questions that you believe will help assess what improvements the user needs to make to
          his/her life.
          
          Once the user has decided on a category, or if the user immediately jumps in with a part of their life they would like to improve,
          help them develop a few basic ideas for goals. For instance, goal ideas in the category of personal fitness might include
          improving one's mile time, improving one's upper body strength, or losing 20 pounds. Work directly with the user to decide
          on pain points and general goal ideas.`},
        // The user's message is what we want a response for
        { role: 'user', content: message },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct', // The AI model to use
      temperature: 1,              // Controls randomness: 1 = normal, 0 = deterministic
      max_completion_tokens: 1024, // Max length of the reply
      top_p: 1,                   // Controls diversity of the output
      stream: false,              // false means wait for full response, no partial streaming
      stop: null,                 // No special stopping condition
    });

    // Extract the text reply from the API response
    const reply = chatCompletion.choices[0]?.message?.content || 'No response.';

    // Send back the reply as JSON with status 200 (OK)
    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // If something goes wrong, log the error for debugging
    console.error('Groq API Error:', error);

    // Return a generic error message with status 500 (server error)
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500 }
    );
  }
}