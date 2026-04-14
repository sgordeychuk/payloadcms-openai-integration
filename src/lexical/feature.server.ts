import { createServerFeature } from '@payloadcms/richtext-lexical'
import type { AIGenerateClientProps } from '../types.js'

export const AIGenerateFeature = createServerFeature<
  { endpointPath?: string },
  { endpointPath: string },
  AIGenerateClientProps
>({
  feature: ({ props }) => {
    const endpointPath = props?.endpointPath ?? '/ai-generate'
    return {
      ClientFeature: 'payloadcms-openai-textgen/client#AIGenerateClientFeature',
      clientFeatureProps: { endpointPath },
      sanitizedServerFeatureProps: { endpointPath },
    }
  },
  key: 'aiGenerate',
})
