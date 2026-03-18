import type { Config, Plugin } from 'payload'
import type { AITextGenPluginOptions } from './types.js'
import { createAIGenerateEndpoint } from './endpoints/aiGenerate.js'

export function aiTextGenPlugin(options: AITextGenPluginOptions = {}): Plugin {
  return (incomingConfig: Config): Config => {
    const endpoint = createAIGenerateEndpoint(options)

    return {
      ...incomingConfig,
      endpoints: [...(incomingConfig.endpoints ?? []), endpoint],
    }
  }
}
