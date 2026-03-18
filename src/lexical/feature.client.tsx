'use client'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { AIGenerateIcon } from './AIGenerateIcon.js'
import { AIGeneratePlugin, OPEN_AI_GENERATE_COMMAND } from './AIGeneratePlugin.js'

export const AIGenerateClientFeature = createClientFeature({
  plugins: [
    {
      Component: AIGeneratePlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      {
        type: 'buttons' as const,
        items: [
          {
            ChildComponent: AIGenerateIcon,
            key: 'aiGenerate',
            label: 'AI Generate',
            onSelect: ({ editor }) => {
              editor.dispatchCommand(OPEN_AI_GENERATE_COMMAND, undefined)
            },
          },
        ],
        key: 'aiGenerate',
        order: 60,
      },
    ],
  },
  toolbarInline: {
    groups: [
      {
        type: 'buttons' as const,
        items: [
          {
            ChildComponent: AIGenerateIcon,
            key: 'aiGenerate',
            label: 'AI Generate',
            onSelect: ({ editor }) => {
              editor.dispatchCommand(OPEN_AI_GENERATE_COMMAND, undefined)
            },
          },
        ],
        key: 'aiGenerate',
        order: 60,
      },
    ],
  },
})
