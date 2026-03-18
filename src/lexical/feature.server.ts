import { createServerFeature } from '@payloadcms/richtext-lexical'

export const AIGenerateFeature = createServerFeature({
  feature: {
    ClientFeature: 'payloadcms-openai-textgen/client#AIGenerateClientFeature',
  },
  key: 'aiGenerate',
})
