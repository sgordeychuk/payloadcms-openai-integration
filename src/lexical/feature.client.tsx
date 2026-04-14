'use client'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical'
import { AIGenerateIcon } from './AIGenerateIcon.js'
import { AIGeneratePlugin, OPEN_AI_GENERATE_COMMAND } from './AIGeneratePlugin.js'
import type { AIGenerateClientProps } from '../types.js'

const aiGenerateToolbarGroup = {
  type: 'buttons' as const,
  items: [
    {
      ChildComponent: AIGenerateIcon,
      key: 'aiGenerate',
      label: 'AI Generate',
      onSelect: ({ editor }: { editor: LexicalEditor }) => {
        editor.dispatchCommand(OPEN_AI_GENERATE_COMMAND, undefined)
      },
    },
  ],
  key: 'aiGenerate',
  order: 60,
}

export const AIGenerateClientFeature = createClientFeature<AIGenerateClientProps>({
  plugins: [
    {
      Component: AIGeneratePlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [aiGenerateToolbarGroup],
  },
  toolbarInline: {
    groups: [aiGenerateToolbarGroup],
  },
})
