# payloadcms-openai-textgen

[![npm version](https://img.shields.io/npm/v/payloadcms-openai-textgen)](https://www.npmjs.com/package/payloadcms-openai-textgen)
[![npm downloads](https://img.shields.io/npm/dm/payloadcms-openai-textgen)](https://www.npmjs.com/package/payloadcms-openai-textgen)
[![license](https://img.shields.io/npm/l/payloadcms-openai-textgen)](https://github.com/sgordeychuk/payloadcms-openai-integration/blob/main/LICENSE)

AI text generation plugin for [Payload CMS](https://payloadcms.com/) v3. Adds an "AI Generate" button to the Lexical rich text editor toolbar that opens a drawer where users can enter a prompt and insert AI-generated content directly into the editor.

Uses OpenAI's chat completions API under the hood.

## Features

- Sparkles button in both the fixed and inline Lexical toolbars
- Drawer UI with a prompt textarea
- Generated HTML is parsed and inserted as proper Lexical nodes (headings, lists, paragraphs, etc.)
- Configurable model, max tokens, system prompt, and endpoint path
- Works with OpenAI SDK v4, v5, and v6

## Requirements

- Payload CMS v3
- `@payloadcms/richtext-lexical` v3
- Node.js 18+

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
| `systemPrompt` | `string` | *(built-in CMS prompt)* | Custom system prompt for content generation |
| `apiKey` | `string` | `process.env.OPENAI_API_KEY` | OpenAI API key |
| `endpointPath` | `string` | `'/ai-generate'` | Custom endpoint path |

## How It Works

1. The plugin registers a Payload API endpoint (`POST /api/ai-generate`) that proxies requests to OpenAI
2. The Lexical feature adds a sparkles icon button to both the fixed and inline toolbars
3. Clicking the button opens a drawer with a prompt textarea
4. On submit, the prompt is sent to the endpoint, which calls OpenAI and returns HTML
5. The HTML is parsed and inserted into the editor as Lexical nodes

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

```bash
# Clone the repo
git clone https://github.com/sgordeychuk/payloadcms-openai-integration.git
cd payloadcms-openai-textgen

# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev
```

### Local development with a Payload project

Use `pnpm link` to test changes locally:

```bash
# In this plugin directory
pnpm link --global

# In your Payload project
pnpm link --global payloadcms-openai-textgen
```

## License

[MIT](LICENSE)
