'use client'

import { Feedback } from '~/components/Feedback'
import { useSendTelemetryEvent } from '~/lib/telemetry'
import { isFeatureEnabled } from 'common'
import { usePathname } from 'next/navigation'
import { cn } from 'ui'
import { AiTools, type AiAgent } from 'ui-patterns/AiTools'
import { ExpandableVideo } from 'ui-patterns/ExpandableVideo'
import { TocSection } from 'ui-patterns/Toc'

import { useTocAnchors } from '../features/docs/GuidesMdx.state'

interface TOCHeader {
  id?: string
  text: string
  link: string
  level: number
}

const GuidesSidebar = ({
  className,
  video,
  videoTitle,
  hideToc,
}: {
  className?: string
  video?: string
  videoTitle?: string
  hideToc?: boolean
}) => {
  const pathname = usePathname()
  const sendTelemetryEvent = useSendTelemetryEvent()
  const { toc } = useTocAnchors()
  const showFeedback = isFeatureEnabled('feedback:docs')
  const tocVideoPreview = `https://img.youtube.com/vi/${video}/0.jpg`

  const handleAgentSetupClick = () => sendTelemetryEvent({ action: 'agent_setup_clicked' })
  const handleMarkdownCopy = () =>
    sendTelemetryEvent({ action: 'copy_as_markdown_clicked', properties: { pageType: 'guide' } })
  const handleAskAiClick = (agent: AiAgent) =>
    sendTelemetryEvent({ action: 'ask_ai_clicked', properties: { agent, pageType: 'guide' } })

  return (
    <div className={cn('thin-scrollbar overflow-y-auto h-fit', 'px-px', className)}>
      <div className="w-full relative border-l flex flex-col gap-6 lg:gap-8 px-2 h-fit">
        {video && (
          <div className="relative pl-5">
            <ExpandableVideo imgUrl={tocVideoPreview} videoId={video} videoTitle={videoTitle} />
          </div>
        )}
        {showFeedback && (
          <div className="pl-5">
            <Feedback key={pathname} />
          </div>
        )}
        <div className="pl-5">
          <AiTools
            key={pathname}
            pageUrl={`https://supabase.com/docs${pathname}`}
            markdownUrl={`/docs${pathname}.md`}
            markdownFallback={getArticleHtml}
            agentSetupHref="/docs/guides/ai-tools"
            onAgentSetupClick={handleAgentSetupClick}
            onMarkdownCopy={handleMarkdownCopy}
            onAskAiClick={handleAskAiClick}
          />
        </div>
        {!hideToc && toc.length !== 0 && <TocSection items={toc} />}
      </div>
    </div>
  )
}

const getArticleHtml = () => document.getElementById('sb-docs-guide-main-article')?.innerHTML ?? ''

export default GuidesSidebar
export { GuidesSidebar }
export type { TOCHeader }
