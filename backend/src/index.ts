import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory conversation storage (replace with DB in production)
const conversations: Map<string, Array<{ role: string; content: string }>> = new Map();

// NIX Persona Transformer
function applyNIXPersona(response: string): string {
  // Remove hedging language
  let transformed = response
    .replace(/I think|I believe|I feel|perhaps|maybe|possibly|might/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Inject confidence markers
  if (!transformed.endsWith(".") && !transformed.endsWith("!") && !transformed.endsWith("?")) {
    transformed += ".";
  }

  return transformed;
}

// POST /api/chat - Send message and get response
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const id = conversationId || uuidv4();

    // Get or create conversation history
    if (!conversations.has(id)) {
      conversations.set(id, []);
    }

    const history = conversations.get(id)!;
    history.push({ role: "user", content: message });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: history as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    // Apply NIX Persona
    const nixResponse = applyNIXPersona(assistantMessage);

    history.push({ role: "assistant", content: nixResponse });

    res.json({
      conversationId: id,
      message: nixResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/conversations/:id - Get conversation history
app.get("/api/conversations/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const history = conversations.get(id);

  if (!history) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  res.json({ conversationId: id, messages: history });
});

// POST /api/conversations - Create new conversation
app.post("/api/conversations", (req: Request, res: Response) => {
  const id = uuidv4();
  conversations.set(id, []);
  res.json({ conversationId: id });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`NIX Chatbot backend running on port ${PORT}`);
});
