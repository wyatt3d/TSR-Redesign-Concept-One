import { SourceId, PropertyType, DealType } from "./types"

// ─── Message Types (Discriminated Union) ────────────────────────
interface MessageBase {
  id: string
  role: "user" | "assistant"
  timestamp: number
  status?: "streaming" | "complete" | "error"
}

export interface TextMessage extends MessageBase {
  type: "text"
  content: string
}

export interface FilterCommandMessage extends MessageBase {
  type: "filter_command"
  content: string
  filters: Partial<FilterPayload>
  resultCount: number
  applied: boolean
}

export interface WorkflowMessage extends MessageBase {
  type: "workflow"
  content: string
  workflow: {
    id: string
    name: string
    trigger: string
    action: string
    schedule: string
    status: "proposed" | "active" | "paused"
  }
}

export interface InsightCardMessage extends MessageBase {
  type: "insight_card"
  content: string
  title: string
  metrics: { label: string; value: string; delta?: number; severity?: "low" | "medium" | "high" }[]
  bullets?: { type: "warning" | "positive" | "neutral"; text: string }[]
}

export interface ScoreCardMessage extends MessageBase {
  type: "score_card"
  content: string
  address: string
  score: number
  breakdown: { label: string; score: number; max: number }[]
  flags: { type: "warning" | "positive"; text: string }[]
}

export interface DataCardMessage extends MessageBase {
  type: "data_card"
  content: string
  listings: {
    address: string
    price: string
    capRate: string | null
    source: string
    propertyType: string
    highlight?: boolean
  }[]
}

export type ChatMessage =
  | TextMessage
  | FilterCommandMessage
  | WorkflowMessage
  | InsightCardMessage
  | ScoreCardMessage
  | DataCardMessage

// ─── Filter Payload ─────────────────────────────────────────────
export interface FilterPayload {
  sources: SourceId[]
  propertyTypes: PropertyType[]
  dealTypes: DealType[]
  states: string[]
  priceMin: number | null
  priceMax: number | null
}

// ─── Chat Action Dispatch ───────────────────────────────────────
export type ChatAction =
  | { type: "APPLY_FILTERS"; filters: Partial<FilterPayload> }
  | { type: "UNDO_FILTERS" }
  | { type: "ACTIVATE_WORKFLOW"; workflowId: string }
  | { type: "SEND_FOLLOWUP"; prompt: string }

export type ChatActionDispatch = (action: ChatAction) => void

// ─── Suggested Prompts ──────────────────────────────────────────
export interface SuggestedPrompt {
  label: string
  prompt: string
  category: "filter" | "workflow" | "insight" | "analysis"
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { label: "Tax foreclosures under $1M in FL", prompt: "Show me only tax foreclosure listings in Florida under $1 million", category: "filter" },
  { label: "What risks in this county?", prompt: "What should I be concerned about when investing in the county I'm currently browsing? Include redemption periods, environmental risks, and market trends.", category: "insight" },
  { label: "Compare top 3 by cap rate", prompt: "Compare the top 3 listings currently visible by cap rate, price, and days on market", category: "analysis" },
  { label: "Alert me on new Miami-Dade auctions", prompt: "Set up a daily email alert for new tax foreclosure or government auction listings in Miami-Dade County sent to team@company.com", category: "workflow" },
  { label: "Only show multifamily + industrial", prompt: "Filter to only show multifamily and industrial properties across all sources", category: "filter" },
  { label: "Score this property", prompt: "Score the currently selected listing against typical institutional criteria and flag any deal-breakers", category: "analysis" },
  { label: "Market snapshot for this area", prompt: "Give me a market snapshot for the area currently visible on the map — median prices, inventory, and trends", category: "insight" },
  { label: "Push new Crexi listings to email", prompt: "Create an automation that emails me whenever a new commercial listing from Crexi appears matching my current filters", category: "workflow" },
]

// ─── Mock Response Generator ────────────────────────────────────
let msgId = 100

function makeId() {
  return `msg-${++msgId}`
}

export function generateMockResponse(userPrompt: string): ChatMessage[] {
  const lower = userPrompt.toLowerCase()

  // Filter commands
  if (lower.includes("show me") || lower.includes("filter to") || lower.includes("only show")) {
    const msgs: ChatMessage[] = []

    if (lower.includes("tax foreclosure") || lower.includes("foreclosure")) {
      const filters: Partial<FilterPayload> = { dealTypes: ["foreclosure", "auction"] }
      if (lower.includes("florida") || lower.includes(" fl")) filters.states = ["FL"]
      if (lower.includes("under $1") || lower.includes("under 1m")) filters.priceMax = 1000000
      msgs.push({
        id: makeId(), role: "assistant", timestamp: Date.now(), type: "filter_command",
        content: `Filtered to ${lower.includes("florida") ? "Florida " : ""}tax foreclosures${lower.includes("under") ? " under $1M" : ""}. Here's what matches your criteria.`,
        filters,
        resultCount: 23,
        applied: false,
      })
    } else if (lower.includes("multifamily") || lower.includes("industrial")) {
      const types: PropertyType[] = []
      if (lower.includes("multifamily")) types.push("multifamily")
      if (lower.includes("industrial")) types.push("industrial")
      if (lower.includes("warehouse")) types.push("warehouse")
      msgs.push({
        id: makeId(), role: "assistant", timestamp: Date.now(), type: "filter_command",
        content: `Filtered to ${types.join(" & ")} properties across all active sources.`,
        filters: { propertyTypes: types },
        resultCount: 45,
        applied: false,
      })
    } else {
      msgs.push({
        id: makeId(), role: "assistant", timestamp: Date.now(), type: "filter_command",
        content: "Updated your filters based on that request.",
        filters: {},
        resultCount: 87,
        applied: false,
      })
    }
    return msgs
  }

  // Workflow creation
  if (lower.includes("alert") || lower.includes("push") || lower.includes("automation") || lower.includes("email") || lower.includes("notify")) {
    const isEmail = lower.includes("email")
    const isMiami = lower.includes("miami")
    const isCrexi = lower.includes("crexi")
    return [{
      id: makeId(), role: "assistant", timestamp: Date.now(), type: "workflow",
      content: "I've drafted this automation for you. Activate it when you're ready.",
      workflow: {
        id: `wf-${Date.now()}`,
        name: isMiami ? "Miami-Dade Auction Alerts" : isCrexi ? "New Crexi Listings" : "Custom Alert",
        trigger: isMiami
          ? "New tax foreclosure or government auction in Miami-Dade County"
          : isCrexi
          ? "New commercial listing from Crexi matching current filters"
          : "New listings matching your current filter criteria",
        action: isEmail ? "Email to team@company.com" : "Email digest",
        schedule: lower.includes("daily") ? "Daily at 8:00 AM ET" : lower.includes("weekly") ? "Weekly on Mondays" : "Daily at 8:00 AM ET",
        status: "proposed",
      },
    }]
  }

  // Risk / County analysis
  if (lower.includes("risk") || lower.includes("concern") || lower.includes("worried") || lower.includes("county")) {
    return [{
      id: makeId(), role: "assistant", timestamp: Date.now(), type: "insight_card",
      title: "County Risk Analysis",
      content: "Here's what to watch for in this market.",
      metrics: [
        { label: "Redemption Period", value: "2 years", severity: "high" },
        { label: "Avg Days to Clear Title", value: "127 days", severity: "medium" },
        { label: "Foreclosure Volume (YoY)", value: "+34%", delta: 34, severity: "medium" },
        { label: "Median Home Value", value: "$187K", delta: -2.1, severity: "low" },
        { label: "Property Tax Rate", value: "1.82%", severity: "low" },
        { label: "Environmental Risk", value: "Moderate", severity: "medium" },
      ],
      bullets: [
        { type: "warning", text: "2-year right of redemption — capital is locked for extended period" },
        { type: "warning", text: "Phase I environmental assessment recommended for industrial parcels" },
        { type: "positive", text: "Strong rent growth corridor — 8.2% YoY in multifamily" },
        { type: "positive", text: "Below state average vacancy rates" },
        { type: "neutral", text: "County reassessment scheduled for 2027 — may impact basis" },
      ],
    }]
  }

  // Score request
  if (lower.includes("score")) {
    return [{
      id: makeId(), role: "assistant", timestamp: Date.now(), type: "score_card",
      content: "Investment scoring based on institutional criteria.",
      address: "1420 NW 3rd Ave, Miami, FL 33136",
      score: 78,
      breakdown: [
        { label: "Location", score: 82, max: 100 },
        { label: "Financials", score: 74, max: 100 },
        { label: "Risk", score: 65, max: 100 },
        { label: "Upside", score: 91, max: 100 },
      ],
      flags: [
        { type: "warning", text: "2-yr redemption period locks capital" },
        { type: "warning", text: "Environmental Phase I needed" },
        { type: "positive", text: "Below-market price per unit by 22%" },
        { type: "positive", text: "Strong rent growth corridor — 8.2% YoY" },
      ],
    }]
  }

  // Compare
  if (lower.includes("compare") || lower.includes("top 3") || lower.includes("top three")) {
    return [{
      id: makeId(), role: "assistant", timestamp: Date.now(), type: "data_card",
      content: "Here are the top 3 visible listings ranked by cap rate.",
      listings: [
        { address: "340 W Flagler St, Miami", price: "$890,000", capRate: "7.4%", source: "Crexi", propertyType: "Multifamily", highlight: true },
        { address: "1420 NW 3rd Ave, Miami", price: "$1,200,000", capRate: "6.8%", source: "Tax Foreclosure", propertyType: "Multifamily" },
        { address: "900 Brickell Ave, Miami", price: "$2,100,000", capRate: "5.2%", source: "LoopNet", propertyType: "Office" },
      ],
    }]
  }

  // Market snapshot
  if (lower.includes("market") || lower.includes("snapshot") || lower.includes("trend")) {
    return [{
      id: makeId(), role: "assistant", timestamp: Date.now(), type: "insight_card",
      title: "Market Snapshot — Current Viewport",
      content: "Overview of the market you're currently browsing.",
      metrics: [
        { label: "Median List Price", value: "$1.4M", delta: 8.3 },
        { label: "Avg Cap Rate", value: "6.2%", delta: -0.4 },
        { label: "Avg Days on Market", value: "47 days", delta: -12 },
        { label: "Active Listings", value: "342" },
        { label: "New This Week", value: "28", delta: 15 },
        { label: "Foreclosure Rate", value: "2.1%", delta: 0.3, severity: "medium" },
      ],
      bullets: [
        { type: "positive", text: "Inventory rising — more opportunities appearing" },
        { type: "positive", text: "Cap rates compressing less here than national average" },
        { type: "neutral", text: "Insurance costs up 18% YoY — factor into underwriting" },
      ],
    }]
  }

  // Default text response
  return [{
    id: makeId(), role: "assistant", timestamp: Date.now(), type: "text",
    content: `I can help with that. Here's what I'd recommend:\n\n- Use the **filter panel** on the left to narrow by source and property type\n- Ask me to **compare listings**, **analyze risk** for a county, or **set up alerts**\n- I can **score properties** against institutional criteria\n\nTry asking: *"What risks should I know about in this county?"* or *"Compare the top 3 by cap rate"*`,
  }]
}
