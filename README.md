# poc-streaming-nestjs-openai

This proof of concept exposes a minimal NestJS server that calls the OpenAI
Chat Completions API and streams the response using Server-Sent Events (SSE).
It demonstrates how to receive streamed chunks from OpenAI without setting up
WebSockets.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Provide an OpenAI API key
   ```bash
   export OPENAI_API_KEY=your-key
   ```

3. Build and start the server
   ```bash
   npm run build
   npm start
   ```

The server listens on port `3000` by default.

## Usage

Send a request to `/openai/chat` with a `prompt` query parameter. The endpoint
responds with a stream of SSE events containing the raw data lines from the
OpenAI API.

Example using `curl`:

```bash
curl -N http://localhost:3000/openai/chat?prompt=Hello
```

Each SSE event contains a JSON fragment from OpenAI. The stream ends when the
API sends the `[DONE]` signal.
