'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from '@payloadcms/richtext-lexical/lexical'
import { $generateNodesFromDOM } from '@payloadcms/richtext-lexical/lexical/html'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { useLexicalDrawer } from '@payloadcms/richtext-lexical/client'
import { Drawer, useDrawerSlug } from '@payloadcms/ui'
import type { AIGenerateClientProps } from '../types.js'

export const OPEN_AI_GENERATE_COMMAND: LexicalCommand<void> = createCommand(
  'OPEN_AI_GENERATE_COMMAND',
)

export const AIGeneratePlugin: React.FC<{ clientProps: AIGenerateClientProps }> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const endpointPath = clientProps?.endpointPath ?? '/ai-generate'

  const drawerSlug = useDrawerSlug('ai-generate')
  const { toggleDrawer, closeDrawer } = useLexicalDrawer(drawerSlug, true)

  useEffect(() => {
    return editor.registerCommand(
      OPEN_AI_GENERATE_COMMAND,
      () => {
        toggleDrawer()
        requestAnimationFrame(() => {
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 100)
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, toggleDrawer])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch(`/api${endpointPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate text')
        setIsGenerating(false)
        return
      }

      const generatedText = (data.text as string).trim()

      // Close drawer first — useLexicalDrawer restores selection automatically
      closeDrawer()

      // Insert content after selection is restored
      setTimeout(() => {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return

          // Detect if the response contains HTML tags
          const hasHtml = /<[a-z][\s\S]*?>/i.test(generatedText)

          if (!hasHtml) {
            selection.insertText(generatedText)
            return
          }

          // Strip code fences if the LLM wrapped HTML in ```html ... ```
          let html = generatedText
          const codeFenceMatch = html.match(/^```(?:html)?\s*\n([\s\S]*?)\n```\s*$/)
          if (codeFenceMatch) {
            html = codeFenceMatch[1]
          }

          // Parse HTML and convert to Lexical nodes
          const parser = new DOMParser()
          const dom = parser.parseFromString(html, 'text/html')
          const nodes = $generateNodesFromDOM(editor, dom)

          selection.insertNodes(nodes)
        })
      }, 50)

      setPrompt('')
    } catch {
      setError('Network error — could not reach the server')
    } finally {
      setIsGenerating(false)
    }
  }, [editor, closeDrawer, prompt, endpointPath])

  return (
    <Drawer slug={drawerSlug} title="AI Text Generator">
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="ai-prompt"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            Enter your prompt
          </label>
          <textarea
            ref={textareaRef}
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the text you want to generate..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-150)',
              backgroundColor: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>
        {error && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--theme-error-500)',
              marginBottom: '16px',
            }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          type="button"
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--theme-success-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            opacity: isGenerating || !prompt.trim() ? 0.7 : 1,
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Text'}
        </button>
      </div>
    </Drawer>
  )
}
