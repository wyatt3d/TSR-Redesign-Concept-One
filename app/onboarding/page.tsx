"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePreferences } from "@/hooks/use-preferences"
import {
  SOURCES,
  PROPERTY_TYPES,
  SOURCE_CATEGORIES,
  type SourceId,
  type PropertyType,
  type InvestorProfile,
  type DealType,
  type SourceCategory,
} from "@/lib/types"
import Image from "next/image"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  Briefcase,
  TrendingUp,
  Landmark,
  Users,
  Home,
  Hammer,
  ArrowLeftRight,
  Globe,
} from "lucide-react"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
]

const INVESTOR_PROFILES: { id: InvestorProfile; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "institutional_fund", label: "Institutional Fund", description: "Pension, endowment, sovereign wealth", icon: <Landmark className="w-5 h-5" /> },
  { id: "private_equity", label: "Private Equity", description: "CRE-focused PE fund", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "family_office", label: "Family Office", description: "Single or multi-family office", icon: <Users className="w-5 h-5" /> },
  { id: "reit", label: "REIT", description: "Real estate investment trust", icon: <Building2 className="w-5 h-5" /> },
  { id: "syndicator", label: "Syndicator / Sponsor", description: "Raise capital for deals", icon: <Briefcase className="w-5 h-5" /> },
  { id: "developer", label: "Developer", description: "Ground-up or value-add", icon: <Hammer className="w-5 h-5" /> },
  { id: "1031_exchange", label: "1031 Exchange", description: "Tax-deferred exchange buyer", icon: <ArrowLeftRight className="w-5 h-5" /> },
  { id: "individual_investor", label: "Individual Investor", description: "Self-directed investor", icon: <Home className="w-5 h-5" /> },
  { id: "other", label: "Other", description: "Something else entirely", icon: <Globe className="w-5 h-5" /> },
]

const DEAL_TYPES: { id: DealType; label: string }[] = [
  { id: "for_sale", label: "For Sale" },
  { id: "for_lease", label: "For Lease" },
  { id: "auction", label: "Auction" },
  { id: "foreclosure", label: "Foreclosure" },
  { id: "reo", label: "REO / Bank-Owned" },
]

const STEPS = [
  { id: "profile", label: "Your Profile", num: 1 },
  { id: "property", label: "Property Types", num: 2 },
  { id: "sources", label: "Listing Sources", num: 3 },
  { id: "deals", label: "Deal Criteria", num: 4 },
  { id: "geography", label: "Geography", num: 5 },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { preferences, setPreferences } = usePreferences()
  const [step, setStep] = useState(0)

  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(preferences.investorProfile)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(preferences.propertyTypes)
  const [selectedSources, setSelectedSources] = useState<SourceId[]>(
    preferences.sources.length > 0 ? preferences.sources : SOURCES.map((s) => s.id)
  )
  const [dealTypes, setDealTypes] = useState<DealType[]>(
    preferences.dealTypes.length > 0 ? preferences.dealTypes : DEAL_TYPES.map((d) => d.id)
  )
  const [states, setStates] = useState<string[]>(preferences.states)
  const [priceMin, setPriceMin] = useState(preferences.priceRange.min?.toString() ?? "")
  const [priceMax, setPriceMax] = useState(preferences.priceRange.max?.toString() ?? "")

  const toggleProperty = (id: PropertyType) => {
    setPropertyTypes((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  const toggleSource = (id: SourceId) => {
    setSelectedSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const toggleCategory = (category: SourceCategory) => {
    const catSourceIds = SOURCES.filter((s) => s.category === category).map((s) => s.id)
    const allSelected = catSourceIds.every((id) => selectedSources.includes(id))
    if (allSelected) {
      setSelectedSources((prev) => prev.filter((id) => !catSourceIds.includes(id)))
    } else {
      setSelectedSources((prev) => [...new Set([...prev, ...catSourceIds])])
    }
  }

  const toggleDeal = (id: DealType) => {
    setDealTypes((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  const toggleState = (st: string) => {
    setStates((prev) => prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st])
  }

  const selectAllStates = () => {
    setStates(states.length === US_STATES.length ? [] : [...US_STATES])
  }

  const finish = () => {
    setPreferences({
      completedOnboarding: true,
      investorProfile,
      propertyTypes,
      sources: selectedSources,
      dealTypes,
      states,
      priceRange: {
        min: priceMin ? parseInt(priceMin) : null,
        max: priceMax ? parseInt(priceMax) : null,
      },
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/images/tsr-logo.png"
            alt="TaxSale Resources"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
          <button
            onClick={finish}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Step indicators */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    i === step
                      ? "bg-[#2a7de1] text-white"
                      : i < step
                      ? "bg-blue-50 text-[#2a7de1]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < step ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px ${i < step ? "bg-[#2a7de1]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Step 1: Investor Profile */}
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">What kind of investor are you?</h1>
              <p className="text-gray-500 mb-8">This helps us prioritize the right listings and data for your workflow.</p>
              <div className="grid grid-cols-3 gap-3">
                {INVESTOR_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setInvestorProfile(profile.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      investorProfile === profile.id
                        ? "border-[#2a7de1] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className={`mt-0.5 ${investorProfile === profile.id ? "text-[#2a7de1]" : "text-gray-400"}`}>
                      {profile.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{profile.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{profile.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Property Types */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">What property types interest you?</h1>
              <p className="text-gray-500 mb-8">Select all that apply. You can change this anytime.</p>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => toggleProperty(pt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      propertyTypes.includes(pt.id)
                        ? "border-[#2a7de1] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      propertyTypes.includes(pt.id) ? "bg-[#2a7de1] border-[#2a7de1]" : "border-gray-300"
                    }`}>
                      {propertyTypes.includes(pt.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{pt.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPropertyTypes(propertyTypes.length === PROPERTY_TYPES.length ? [] : PROPERTY_TYPES.map((p) => p.id))}
                className="mt-4 text-sm text-[#2a7de1] hover:underline"
              >
                {propertyTypes.length === PROPERTY_TYPES.length ? "Deselect all" : "Select all"}
              </button>
            </div>
          )}

          {/* Step 3: Sources */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Which listing sources do you want?</h1>
              <p className="text-gray-500 mb-8">
                We aggregate from {SOURCES.length} sources. Toggle categories or individual sources.
              </p>
              <div className="space-y-6">
                {(Object.keys(SOURCE_CATEGORIES) as SourceCategory[]).map((cat) => {
                  const catSources = SOURCES.filter((s) => s.category === cat)
                  const allSelected = catSources.every((s) => selectedSources.includes(s.id))
                  const someSelected = catSources.some((s) => selectedSources.includes(s.id))
                  return (
                    <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            allSelected ? "bg-[#2a7de1] border-[#2a7de1]" : someSelected ? "bg-blue-100 border-[#2a7de1]" : "border-gray-300"
                          }`}>
                            {allSelected && <Check className="w-3 h-3 text-white" />}
                            {someSelected && !allSelected && <div className="w-2 h-0.5 bg-[#2a7de1] rounded" />}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold text-gray-900">{SOURCE_CATEGORIES[cat].label}</div>
                            <div className="text-xs text-gray-500">{SOURCE_CATEGORIES[cat].description}</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {catSources.filter((s) => selectedSources.includes(s.id)).length}/{catSources.length}
                        </span>
                      </button>
                      <div className="border-t border-gray-100 px-5 py-3 flex flex-wrap gap-2">
                        {catSources.map((source) => (
                          <button
                            key={source.id}
                            onClick={() => toggleSource(source.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              selectedSources.includes(source.id)
                                ? "border-transparent text-white"
                                : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"
                            }`}
                            style={selectedSources.includes(source.id) ? { backgroundColor: source.color } : {}}
                          >
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: selectedSources.includes(source.id) ? "rgba(255,255,255,0.5)" : source.color }}
                            />
                            {source.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Deal Criteria */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">What types of deals?</h1>
              <p className="text-gray-500 mb-8">Filter by deal type and price range.</p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Deal Types</h3>
                  <div className="flex flex-wrap gap-3">
                    {DEAL_TYPES.map((dt) => (
                      <button
                        key={dt.id}
                        onClick={() => toggleDeal(dt.id)}
                        className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          dealTypes.includes(dt.id)
                            ? "border-[#2a7de1] bg-blue-50/50 text-[#2a7de1]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {dt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="text"
                        placeholder="No minimum"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ""))}
                        className="pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm w-48 focus:border-[#2a7de1] focus:outline-none"
                      />
                    </div>
                    <span className="text-gray-400 text-sm">to</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="text"
                        placeholder="No maximum"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ""))}
                        className="pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm w-48 focus:border-[#2a7de1] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Geography */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Where are you looking?</h1>
              <p className="text-gray-500 mb-6">Select target states. Leave empty to see all markets.</p>
              <button
                onClick={selectAllStates}
                className="mb-4 text-sm text-[#2a7de1] hover:underline"
              >
                {states.length === US_STATES.length ? "Deselect all" : "Select all states"}
              </button>
              <div className="grid grid-cols-8 gap-2">
                {US_STATES.map((st) => (
                  <button
                    key={st}
                    onClick={() => toggleState(st)}
                    className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      states.includes(st)
                        ? "border-[#2a7de1] bg-[#2a7de1] text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-xs text-gray-400">
            Step {step + 1} of {STEPS.length}
          </div>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#2a7de1] text-white text-sm font-medium rounded-lg hover:bg-[#2268c4] transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#2a7de1] text-white text-sm font-medium rounded-lg hover:bg-[#2268c4] transition-colors"
            >
              <Check className="w-4 h-4" />
              Launch Portal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
