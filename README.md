# NIX Chatbot

A high-performance conversational AI platform with ChatGPT/Grok feature parity, powered by the NIX persona framework. Confident, witty, assertive responses without ego. Ebonics vernacular. Deterministic execution.

## Features

**Conversational AI**: Multi-turn dialogue with full context retention across sessions. The chatbot maintains conversation history and builds on prior exchanges without losing thread.

**Text Generation**: Long-form responses, summaries, creative writing, and structured content generation. Supports markdown formatting, code blocks, and rich text output.

**Code Assistance**: Generate, debug, and explain code across multiple languages. Provides syntax highlighting and executable examples.

**Knowledge Retrieval**: Answer factual questions across domains with cited sources. Integrates with web search for real-time information.

**File Processing**: Upload and analyze documents, images, and PDFs. Extracts text, metadata, and generates summaries.

**Conversation Management**: Save, load, and organize chat sessions. Export conversations in multiple formats (JSON, Markdown, PDF).

**System Prompts**: Customize chatbot behavior with user-defined instructions. Override default tone, style, or domain focus.

## NIX Persona Framework

The chatbot operates under the NIX persona, a confidence-based communication model that prioritizes logic over ego. Responses are professional, witty, and assertive while maintaining factual accuracy. The persona uses urban vernacular (Ebonics) naturally and only self-references when discussing harm or its manufacture.

**Tone Characteristics**: Disciplined, clinical, authoritative. Clever, witty, dynamic. Calmly emotional yet intensely focused on factual accuracy.

**Response Style**: Pithy phrasing under 3 sentences where possible. Sharp twists that surprise while remaining rooted in logic. Fearless delivery without apologetic framing.

**Self-Reference Rule**: The chatbot avoids "I" or "me" except when analyzing the manufacture of harm, its psychological boomerang effect, or defensive mechanisms.

## Technical Architecture

**Backend**: Node.js + Express + TypeScript. Integrates with OpenAI/Anthropic APIs for LLM inference. PostgreSQL for persistent conversation storage.

**Frontend**: React 19 + TypeScript + Tailwind CSS. Real-time message streaming. Dark/light mode support.

**Deployment**: Docker containerization. Kubernetes orchestration (optional). Standalone server deployment for rapid deployment.

**Security**: End-to-end encryption for sensitive conversations. API key rotation. Rate limiting and abuse prevention.

## Getting Started

Clone the repository and follow the setup guide in `SETUP.md`. Install dependencies with `pnpm install`. Configure environment variables in `.env`. Start the development server with `pnpm dev`.

## Documentation

- `ARCHITECTURE.md`: System design and component breakdown
- `API.md`: REST API endpoints and WebSocket schema
- `PERSONA.md`: NIX persona framework specification
- `DEPLOYMENT.md`: Production deployment guide
- `CONTRIBUTING.md`: Development workflow and contribution guidelines

## License

Proprietary. All rights reserved.

## Contact

For inquiries, contact the development team at the repository.
