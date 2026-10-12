'use client'

import { useCopyMarkdownFromUrl } from 'common/hooks/useCopyMarkdownFromUrl'
import { askAiUrls } from 'common/markdown-affordance'
import { Chatgpt, Claude } from 'icons'
import { Check, Copy, Sparkles } from 'lucide-react'
import { useId } from 'react'
import { cn } from 'ui'

export interface AiToolsProps {
  pageUrl: string
  markdownUrl: string
  markdownFallback?: () => string
  agentSetupHref: string
  onAgentSetupClick?: () => void
  onMarkdownCopy?: () => void
  onAskAiClick?: (agent: AiAgent) => void
  className?: string
}

export const AiTools = ({
  pageUrl,
  markdownUrl,
  markdownFallback,
  agentSetupHref,
  onAgentSetupClick,
  onMarkdownCopy,
  onAskAiClick,
  className,
}: AiToolsProps) => {
  const { copied, copyMarkdown } = useCopyMarkdownFromUrl()
  const titleId = useId()
  const urls = askAiUrls(pageUrl)

  const handleCopy = async () => {
    const isCopied = await copyMarkdown(markdownUrl, { fallback: markdownFallback })
    if (isCopied) onMarkdownCopy?.()
  }
  const handleChatgptClick = () => onAskAiClick?.('chatgpt')
  const handleClaudeClick = () => onAskAiClick?.('claude')

  return (
    <section className={cn(className)} aria-labelledby={titleId}>
      <h3 id={titleId} className="mb-3 block font-mono text-xs uppercase text-foreground-light">
        AI Tools
      </h3>
      <div className="flex flex-col gap-2">
        <a href={agentSetupHref} onClick={onAgentSetupClick} className={ITEM_CLASS}>
          <Sparkles aria-hidden className="size-3.5" strokeWidth={1.5} />
          Connect your AI agent
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(ITEM_CLASS, 'cursor-pointer text-left')}
        >
          {copied ? (
            <Check aria-hidden className="size-3.5 text-primary" strokeWidth={1.5} />
          ) : (
            <Copy aria-hidden className="size-3.5" strokeWidth={1.5} />
          )}
          {copied ? 'Copied!' : 'Copy as Markdown'}
        </button>
        <span className="sr-only" role="status">
          {copied ? 'Copied to clipboard' : ''}
        </span>
        <a
          href={urls.chatgpt}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleChatgptClick}
          className={ITEM_CLASS}
        >
          <Chatgpt aria-hidden className="size-3.5" />
          Ask ChatGPT
        </a>
        <a
          href={urls.claude}
          target="_blank"
          rel="noreferrer noopener"
          onClick={handleClaudeClick}
          className={ITEM_CLASS}
        >
          <Claude aria-hidden className="size-3.5" />
          Ask Claude
        </a>
      </div>
    </section>
  )
}

const ITEM_CLASS =
  'flex items-center gap-1.5 text-xs text-foreground-lighter transition-colors hover:text-foreground'

export type AiAgent = 'chatgpt' | 'claude'
