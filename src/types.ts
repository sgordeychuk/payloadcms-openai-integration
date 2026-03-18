export interface AITextGenPluginOptions {
  /** OpenAI model to use (default: 'gpt-4o-mini') */
  model?: string
  /** Maximum tokens for the response (default: 1024) */
  maxTokens?: number
  /** Custom system prompt for the AI */
  systemPrompt?: string
  /** OpenAI API key (default: process.env.OPENAI_API_KEY) */
  apiKey?: string
  /** Custom endpoint path (default: '/ai-generate') */
  endpointPath?: string
}
