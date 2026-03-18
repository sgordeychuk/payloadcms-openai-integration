# payloadcms-openai-textgen

AI text generation plugin for [Payload CMS](https://payloadcms.com/) v3. Adds an "AI Generate" button to the Lexical rich text editor toolbar that opens a drawer where users can enter a prompt and insert AI-generated content.

Uses OpenAI's chat completions API under the hood.

## Installation

```bash
pnpm add payloadcms-openai-textgen
```

Set the `OPENAI_API_KEY` environment variable (or pass `apiKey` in plugin options).

## Usage

```ts
// payload.config.ts
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { aiTextGenPlugin, AIGenerateFeature } from 'payloadcms-openai-textgen'

export default buildConfig({
  // 1. Register the plugin (adds the API endpoint)
  plugins: [
    aiTextGenPlugin({
      model: 'gpt-4o-mini', // optional, default: 'gpt-4o-mini'
    }),
  ],
  // 2. Add the feature to the Lexical editor
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      AIGenerateFeature(),
    ],
  }),
  // ... rest of config
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | `'gpt-4o-mini'` | OpenAI model to use |
| `maxTokens` | `number` | `1024` | Maximum tokens for the response |
| `systemPrompt` | `string` | *(built-in CMS prompt)* | Custom system prompt |
| `apiKey` | `string` | `process.env.OPENAI_API_KEY` | OpenAI API key |
| `endpointPath` | `string` | `'/ai-generate'` | Custom endpoint path |

## How It Works

1. The plugin adds a Payload API endpoint (`POST /api/ai-generate`) that proxies requests to OpenAI
2. The Lexical feature adds a sparkles icon button to both the fixed and inline toolbars
3. Clicking the button opens a drawer with a prompt textarea
4. The generated HTML content is parsed and inserted into the editor as Lexical nodes

## License

MIT
