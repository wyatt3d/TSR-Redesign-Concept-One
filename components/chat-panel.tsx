"use client"

import { useState, useRef, useEffect } from "react"
import {
  X,
  Send,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Play,
  Pause,
  BarChart3,
  Target,
  Bell,
  Filter,
  Lightbulb,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"
import {
  type ChatMessage,
  type ChatActionDispatch,
  type FilterPayload,
  type SuggestedPrompt,
  SUGGESTED_PROMPTS,
  generateMockResponse,
} from "@/lib/chat-types"

interface ChatPanelProps {
  onAction: ChatActionDispatch
  filteredCount: number
  totalCount: number
  onClose: () => void
}

const categoryIcon: Record<string, React.ReactNode> = {
  filter: <Filter className="w-3 h-3" />,
  workflow: <Bell className="w-3 h-3" />,
  insight: <Lightbulb className="w-3 h-3" />,
  analysis: <BarChart3 className="w-3 h-3" />,
}

export function ChatPanel({ onAction, filteredCount, totalCount, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      type: "text",
      content: text.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI response delay, auto-apply filter commands
    setTimeout(() => {
      const responses = generateMockResponse(text)
      setMessages((prev) => [...prev, ...responses])
      setIsTyping(false)
      // Auto-apply any filter commands
      responses.forEach((r) => {
        if (r.type === "filter_command" && r.applied) {
          onAction({ type: "APPLY_FILTERS", filters: r.filters })
        }
      })
    }, 800 + Math.random() * 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Undo: remove the filter response + the user message that triggered it, revert filters
  const handleUndoFilter = (msg: ChatMessage & { type: "filter_command" }) => {
    // Find the user message immediately before this response
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msg.id)
      // Remove the response and the user message before it
      const userIdx = idx > 0 && prev[idx - 1].role === "user" ? idx - 1 : -1
      return prev.filter((_, i) => i !== idx && i !== userIdx)
    })
    onAction({ type: "UNDO_FILTERS" })
  }

  const handleActivateWorkflow = (workflowId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.type === "workflow" && m.workflow.id === workflowId
          ? { ...m, workflow: { ...m.workflow, status: "active" } }
          : m
      )
    )
  }

  return (
    <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#2a7de1] to-[#1a5fb4] rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Analyst</div>
            <div className="text-[10px] text-green-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Ready
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context strip */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500">
        <span className="font-medium text-gray-600">{filteredCount.toLocaleString()}</span> listings visible of{" "}
        <span className="font-medium text-gray-600">{totalCount.toLocaleString()}</span> total
        {filteredCount < totalCount && (
          <span className="text-[#2a7de1] ml-1">&middot; filters active</span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-[#2a7de1]" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Property Intelligence</h3>
            <p className="text-xs text-gray-500 max-w-[280px] mx-auto leading-relaxed">
              I can filter listings, set up alerts, analyze markets, score properties, and compare deals. Try a suggestion below.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <UserBubble content={(msg as any).content} />
            ) : (
              <AssistantMessage msg={msg} onUndoFilter={handleUndoFilter} onActivateWorkflow={handleActivateWorkflow} onAction={onAction} />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>Analyzing...</span>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {messages.length < 4 && (
        <div className="px-4 py-2.5 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Suggestions</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.slice(0, 4).map((sp) => (
              <button
                key={sp.label}
                onClick={() => sendMessage(sp.prompt)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#2a7de1] rounded-lg text-[11px] text-gray-600 hover:text-[#2a7de1] transition-all"
              >
                {categoryIcon[sp.category]}
                {sp.label}
              </button>
            ))}
          </div>
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {SUGGESTED_PROMPTS.slice(4, 8).map((sp) => (
                <button
                  key={sp.label}
                  onClick={() => sendMessage(sp.prompt)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#2a7de1] rounded-lg text-[11px] text-gray-600 hover:text-[#2a7de1] transition-all"
                >
                  {categoryIcon[sp.category]}
                  {sp.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about listings, set up alerts..."
            rows={1}
            className="flex-1 resize-none px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[#2a7de1] focus:outline-none placeholder:text-gray-400"
            style={{ minHeight: 38, maxHeight: 100 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-[#2a7de1] text-white rounded-lg hover:bg-[#2268c4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-[#2a7de1] text-white px-3.5 py-2.5 rounded-2xl rounded-br-md text-sm leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function AssistantMessage({
  msg,
  onUndoFilter,
  onActivateWorkflow,
  onAction,
}: {
  msg: ChatMessage
  onUndoFilter: (msg: ChatMessage & { type: "filter_command" }) => void
  onActivateWorkflow: (id: string) => void
  onAction: ChatActionDispatch
}) {
  switch (msg.type) {
    case "text":
      return <TextCard content={msg.content} />
    case "filter_command":
      return <FilterCard msg={msg} onUndo={() => onUndoFilter(msg)} />
    case "workflow":
      return <WorkflowCard msg={msg} onActivate={() => onActivateWorkflow(msg.workflow.id)} />
    case "insight_card":
      return <InsightCard msg={msg} onAction={onAction} />
    case "score_card":
      return <ScoreCard msg={msg} />
    case "data_card":
      return <DataCard msg={msg} />
    default:
      return <TextCard content={"Something went wrong."} />
  }
}

function TextCard({ content }: { content: string }) {
  // Parse simple markdown into React elements
  const lines = content.split("\n")
  return (
    <div className="max-w-[90%]">
      <div className="bg-gray-50 border border-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-md text-sm text-gray-700 leading-relaxed">
        {lines.map((line, li) => {
          if (!line.trim()) return <br key={li} />
          // Split by bold markers
          const parts = line.split(/\*\*(.*?)\*\*/)
          const rendered = parts.map((part, pi) =>
            pi % 2 === 1 ? <strong key={pi}>{part}</strong> : <span key={pi}>{part}</span>
          )
          // Handle list items
          if (line.trimStart().startsWith("- ")) {
            return <div key={li} className="flex gap-1.5 ml-1"><span className="text-gray-400">•</span><span>{rendered}</span></div>
          }
          return <div key={li}>{rendered}</div>
        })}
      </div>
    </div>
  )
}

function FilterCard({ msg, onUndo }: { msg: ChatMessage & { type: "filter_command" }; onUndo: () => void }) {
  return (
    <div className="max-w-[90%]">
      <div className="border border-blue-200 bg-blue-50/50 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 bg-blue-100/50 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#2a7de1]" />
            <span className="text-xs font-semibold text-[#2a7de1]">Filters Applied</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </div>
        </div>
        <div className="px-3.5 py-3">
          <p className="text-sm text-gray-700 mb-2.5">{msg.content}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {msg.filters.states?.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-blue-100 text-[#2a7de1] text-[11px] font-medium rounded">State: {s}</span>
            ))}
            {msg.filters.dealTypes?.map((d) => (
              <span key={d} className="px-2 py-0.5 bg-blue-100 text-[#2a7de1] text-[11px] font-medium rounded capitalize">{d.replace(/_/g, " ")}</span>
            ))}
            {msg.filters.propertyTypes?.map((p) => (
              <span key={p} className="px-2 py-0.5 bg-blue-100 text-[#2a7de1] text-[11px] font-medium rounded capitalize">{p.replace(/_/g, " ")}</span>
            ))}
            {msg.filters.priceMax && (
              <span className="px-2 py-0.5 bg-blue-100 text-[#2a7de1] text-[11px] font-medium rounded">
                Under ${(msg.filters.priceMax / 1000000).toFixed(0)}M
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{msg.resultCount}</span> listings match
            </div>
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-xs text-gray-600 font-medium rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Undo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowCard({ msg, onActivate }: { msg: ChatMessage & { type: "workflow" }; onActivate: () => void }) {
  const wf = msg.workflow
  const isActive = wf.status === "active"
  return (
    <div className="max-w-[90%]">
      <div className="border border-green-200 bg-green-50/50 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-green-100/50 border-b border-green-200">
          <Bell className="w-3.5 h-3.5 text-green-700" />
          <span className="text-xs font-semibold text-green-700">Automation</span>
          <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded ${
            isActive ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"
          }`}>
            {wf.status === "proposed" ? "Draft" : wf.status === "active" ? "Active" : "Paused"}
          </span>
        </div>
        <div className="px-3.5 py-3 space-y-2">
          <div className="text-sm font-semibold text-gray-900">{wf.name}</div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-14 flex-shrink-0 font-medium">Trigger</span>
              <span>{wf.trigger}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-14 flex-shrink-0 font-medium">Action</span>
              <span>{wf.action}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-14 flex-shrink-0 font-medium">Schedule</span>
              <span>{wf.schedule}</span>
            </div>
          </div>
          {!isActive && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onActivate}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-3 h-3" />
                Activate
              </button>
              <button className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 font-medium rounded-lg hover:bg-gray-50">
                Edit
              </button>
            </div>
          )}
          {isActive && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Automation is live
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InsightCard({ msg, onAction }: { msg: ChatMessage & { type: "insight_card" }; onAction: ChatActionDispatch }) {
  return (
    <div className="max-w-[95%]">
      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 border-b border-gray-200">
          <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">{msg.title}</span>
        </div>
        <div className="px-3.5 py-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {msg.metrics.map((m, i) => (
              <div key={i} className="px-2.5 py-2 bg-gray-50 rounded-lg">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">{m.label}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-bold text-gray-900">{m.value}</span>
                  {m.delta !== undefined && (
                    <span className={`text-[10px] font-semibold ${m.delta > 0 ? "text-green-600" : "text-red-500"}`}>
                      {m.delta > 0 ? "+" : ""}{m.delta}%
                    </span>
                  )}
                  {m.severity === "high" && <AlertTriangle className="w-3 h-3 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
          {msg.bullets && (
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              {msg.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {b.type === "warning" && <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />}
                  {b.type === "positive" && <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />}
                  {b.type === "neutral" && <div className="w-3 h-3 rounded-full bg-gray-300 mt-0.5 flex-shrink-0" />}
                  <span className="text-gray-600">{b.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ msg }: { msg: ChatMessage & { type: "score_card" } }) {
  const scoreColor = msg.score >= 80 ? "text-green-600 bg-green-50 border-green-200" :
    msg.score >= 60 ? "text-[#2a7de1] bg-blue-50 border-blue-200" :
    "text-amber-600 bg-amber-50 border-amber-200"

  return (
    <div className="max-w-[95%]">
      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 border-b border-gray-200">
          <Target className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">Investment Score</span>
        </div>
        <div className="px-3.5 py-3">
          {/* Score + address */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center ${scoreColor}`}>
              <span className="text-lg font-bold leading-none">{msg.score}</span>
              <span className="text-[9px] opacity-70">/100</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{msg.address}</div>
              <div className="text-xs text-gray-500">Scored against institutional criteria</div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 mb-3">
            {msg.breakdown.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 w-20 flex-shrink-0">{b.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2a7de1]"
                    style={{ width: `${(b.score / b.max) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 w-7 text-right">{b.score}</span>
              </div>
            ))}
          </div>

          {/* Flags */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            {msg.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {f.type === "warning" ? (
                  <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-gray-600">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DataCard({ msg }: { msg: ChatMessage & { type: "data_card" } }) {
  return (
    <div className="max-w-[95%]">
      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 border-b border-gray-200">
          <BarChart3 className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">Comparison</span>
        </div>
        <div className="px-3.5 py-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 text-left font-medium text-gray-500">Property</th>
                <th className="py-2 text-right font-medium text-gray-500">Price</th>
                <th className="py-2 text-right font-medium text-gray-500">Cap</th>
                <th className="py-2 text-right font-medium text-gray-500">Source</th>
              </tr>
            </thead>
            <tbody>
              {msg.listings.map((l, i) => (
                <tr key={i} className={`border-b border-gray-50 ${l.highlight ? "bg-blue-50/50" : ""}`}>
                  <td className="py-2">
                    <div className="font-medium text-gray-900">{l.address}</div>
                    <div className="text-gray-400">{l.propertyType}</div>
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-900">{l.price}</td>
                  <td className="py-2 text-right text-green-600 font-medium">{l.capRate || "—"}</td>
                  <td className="py-2 text-right text-gray-500">{l.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3.5 py-2.5 border-t border-gray-100">
          <p className="text-xs text-gray-600">{msg.content}</p>
        </div>
      </div>
    </div>
  )
}
