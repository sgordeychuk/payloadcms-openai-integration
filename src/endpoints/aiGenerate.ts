import type { Endpoint } from 'payload'
import OpenAI from 'openai'
import type { AITextGenPluginOptions } from '../types.js'

const DEFAULT_SYSTEM_PROMPT = `You are a helpful content writer for a CMS. Generate well-structured content based on the user prompt.

Rules:
- Return ONLY valid HTML markup. No markdown. No plain text outside of HTML tags.
- Use these tags: <p>, <h2>, <h3>, <h4>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <code>.
- Every paragraph must be wrapped in <p> tags.
- Do NOT include <html>, <head>, <body>, or <div> wrapper tags.
- Do NOT include any preamble, explanation, or code fences.
- Use semantic heading hierarchy: <h2> for main sections, <h3> for subsections.
- Keep the content professional and concise.`

export function createAIGenerateEndpoint(options: AITextGenPluginOptions): Endpoint {
  const {
    model = 'gpt-4o-mini',
    maxTokens = 1024,
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    apiKey,
    endpointPath = '/ai-generate',
  } = options

  let openaiClient: OpenAI | null = null

  return {
    path: endpointPath,
    method: 'post',
    handler: async (req) => {
      if (!req.user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const resolvedApiKey = apiKey ?? process.env.OPENAI_API_KEY
      if (!resolvedApiKey) {
        return Response.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
      }

      let body: { prompt?: string }
      try {
        body = await req.json!()
      } catch {
        return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
      }

      const { prompt } = body
      if (!prompt || typeof prompt !== 'string') {
        return Response.json({ error: 'prompt is required' }, { status: 400 })
      }

      if (!openaiClient) {
        openaiClient = new OpenAI({ apiKey: resolvedApiKey })
      }

      try {
        const completion = await openaiClient.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          max_completion_tokens: maxTokens,
        })

        const text = completion.choices[0]?.message?.content?.trim() ?? ''
        return Response.json({ text })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return Response.json({ error: message }, { status: 500 })
      }
    },
  }
}
