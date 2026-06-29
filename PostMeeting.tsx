// NIC — Post-Meeting
// Focus: Follow-up, summaries, and prominent auto-detect panel

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { getClientById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Sparkles,
  Send,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  Shield,
  MessageSquare,
  Star,
  BarChart2,
  ArrowRight,
  Info,
  Brain,
  Target,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const followUpMessage = `Hi Chase,

Thank you for making time to meet with me today — it was great catching up and hearing about how Anne is doing!

As discussed, here's a summary of what we covered:

1. **Integrated Shield Plan (ISP)** — I'll be sending over a detailed comparison of the Standard and Enhanced tiers for you, Linda, and Anne. The Enhanced plan offers private hospital access with a rider that eliminates co-insurance.

2. **Education Endowment for Anne** — I'll prepare a full illustration for an 18-year plan targeting S$200,000 at maturity. I'll have this ready by end of week.

3. **Portfolio Review** — Your current allocation remains well-positioned given your new income level.

Please don't hesitate to reach out if you have any questions. Looking forward to our next session!

Warm regards,
Faith Ang`;

const clientSummary = `**Meeting Summary — 3 July 2026**

**Topics Discussed:**
- Integrated Shield Plan options for family of 3
- Education endowment planning for Anne
- Portfolio review and rebalancing

**Decisions Made:**
- Interested in Enhanced ISP tier for family
- Education endowment: 18-year plan, S$200K target
- Portfolio to remain as is for now

**Next Steps:**
- Faith to send ISP comparison (by 5 Jul)
- Faith to prepare education endowment illustration (by 6 Jul)
- Next meeting: Q3 2026`;

const faSummary = `**FA Internal Notes**

**Client Sentiment:** Very positive, engaged. Clearly values family planning.

**Key Observations:**
- Income increase post-promotion is significant
- Chase is analytical — responds well to charts and data
- Linda's return-to-work timeline unclear — follow up next meeting
- Second property interest mentioned again

**Compliance:** All checks passed ✓`;

const trendData = [
  { meeting: "Nov '25", compliance: 88, service: 82, overall: 85 },
  { meeting: "Mar '26", compliance: 85, service: 88, overall: 87 },
  { meeting: "Jul '26", compliance: 72, service: 90, overall: 81 },
];

const habitsData = [
  { type: "positive", text: "Excellent rapport-building — clients consistently rate this highly" },
  { type: "positive", text: "Strong use of visual aids and charts during explanations" },
  { type: "positive", text: "Always follows up within 48 hours" },
  { type: "watch", text: "Compliance slip: incorrect regulation figure cited (corrected in-meeting)" },
  { type: "improve", text: "Consider allocating more time to portfolio review section" },
];

const aiDetectedUpdates = [
  { field: "Family", update: "Anne confirmed 6 months old (born Jan 3, 2026)", added: false },
  { field: "Career", update: "Chase confirmed as Senior Director at DBS Bank", added: false },
  { field: "Plans", update: "Second property interest reconfirmed for Q3 2026", added: false },
  { field: "Concerns", update: "Linda's return-to-work timeline remains unclear", added: false },
];

export default function PostMeeting() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const client = getClientById(id);

  const [copiedFollowUp, setCopiedFollowUp] = useState(false);
  const [copiedClientSummary, setCopiedClientSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"followup" | "client" | "fa" | "growth">("followup");
  const [updatesApproved, setUpdatesApproved] = useState<string[]>([]);

  if (!client) return null;

  const handleCopy = (text: string, type: "followup" | "client") => {
    navigator.clipboard.writeText(text);
    if (type === "followup") {
      setCopiedFollowUp(true);
      setTimeout(() => setCopiedFollowUp(false), 2000);
    } else {
      setCopiedClientSummary(true);
      setTimeout(() => setCopiedClientSummary(false), 2000);
    }
  };

  const approveUpdate = (field: string) => {
    setUpdatesApproved((prev) => [...prev, field]);
  };

  const complianceScore = 72;
  const serviceScore = 90;
  const overallScore = 81;

  const scoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-500";
  };

  const scoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-50 border-emerald-200";
    if (score >= 70) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/meeting/${id}`)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A325A]"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Post-Meeting Wrap-Up
            </h1>
            <p className="text-sm text-gray-500">{client.name} · 3 Jul 2026 · 60 minutes</p>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Compliance", score: complianceScore, icon: Shield, note: "Regulation slip detected" },
            { label: "Service Quality", score: serviceScore, icon: Star, note: "Excellent rapport" },
            { label: "Overall", score: overallScore, icon: Target, note: "Good session" },
          ].map(({ label, score, icon: Icon, note }) => (
            <div key={label} className={cn("rounded-xl p-4 border shadow-sm", scoreBg(score))}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={scoreColor(score)} />
                  <span className="text-xs font-semibold text-gray-600">{label}</span>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className={cn("text-3xl font-bold", scoreColor(score))}>{score}</span>
                <span className="text-sm text-gray-400 mb-1">/100</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{note}</p>
            </div>
          ))}
        </div>

        {/* Main grid: Tabs + Auto-detect panel */}
        <div className="grid grid-cols-[1fr_380px] gap-5">
          {/* Left: Tabs */}
          <div className="space-y-4">
            {/* Tab navigation */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
              {[
                { id: "followup", label: "Follow-up Message", icon: MessageSquare },
                { id: "client", label: "Client Summary", icon: MessageSquare },
                { id: "fa", label: "FA Notes", icon: Brain },
                { id: "growth", label: "Growth", icon: TrendingUp },
              ].map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeTab === tabId
                      ? "bg-white text-[#1E3A5F] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "followup" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={13} className="text-amber-600" />
                    <h3 className="text-sm font-semibold text-gray-700">ISP Comparison (from meeting)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { plan: "Standard", monthly: 125, coverage: 85 },
                      { plan: "Enhanced", monthly: 185, coverage: 95 }
                    ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="plan" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="monthly" fill="#964B36" name="Monthly Premium" />
                      <Bar dataKey="coverage" fill="#C9AF80" name="Coverage %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-gray-700">AI-Generated Follow-up</span>
                    </div>
                    <button
                      onClick={() => handleCopy(followUpMessage, "followup")}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-all"
                    >
                      {copiedFollowUp ? <><Check size={11} className="text-emerald-500" /> Copied</> : <><Copy size={11} /> Copy</>}
                    </button>
                  </div>
                  <div className="p-5">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{followUpMessage}</pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "client" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Client Summary</span>
                  <button
                    onClick={() => handleCopy(clientSummary, "client")}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-all"
                  >
                    {copiedClientSummary ? <><Check size={11} className="text-emerald-500" /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                </div>
                <div className="p-5">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{clientSummary}</pre>
                </div>
              </div>
            )}

            {activeTab === "fa" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Internal FA Notes</span>
                </div>
                <div className="p-5">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{faSummary}</pre>
                </div>
              </div>
            )}

            {activeTab === "growth" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Score Trends</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="meeting" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[60, 100]} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="compliance" fill="#6366F1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="service" fill="#10B981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="overall" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Habits & Patterns</h3>
                  <div className="space-y-2">
                    {habitsData.map((habit, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2.5 p-2.5 rounded-lg border",
                          habit.type === "positive" ? "bg-emerald-50 border-emerald-100" :
                          habit.type === "watch" ? "bg-amber-50 border-amber-100" :
                          "bg-blue-50 border-blue-100"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]",
                          habit.type === "positive" ? "bg-emerald-200 text-emerald-700" :
                          habit.type === "watch" ? "bg-amber-200 text-amber-700" :
                          "bg-blue-200 text-blue-700"
                        )}>
                          {habit.type === "positive" ? "✓" : habit.type === "watch" ? "!" : "→"}
                        </div>
                        <p className={cn(
                          "text-xs leading-relaxed",
                          habit.type === "positive" ? "text-emerald-800" :
                          habit.type === "watch" ? "text-amber-800" :
                          "text-blue-800"
                        )}>
                          {habit.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Auto-detect panel */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 shadow-sm border border-indigo-100 h-fit">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-indigo-700">AI Detected Updates</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs text-indigo-600 mb-3">
              AI found new info to add to {client.name}'s profile
            </p>

            <div className="space-y-2.5">
              {aiDetectedUpdates.map((update, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-indigo-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">{update.field}</span>
                      <p className="text-xs text-gray-700 mt-0.5 leading-snug">{update.update}</p>
                    </div>
                    {!updatesApproved.includes(update.field) ? (
                      <button
                        onClick={() => approveUpdate(update.field)}
                        className="shrink-0 text-[10px] bg-indigo-500 text-white px-2 py-1 rounded-md font-medium hover:bg-indigo-600 transition-colors"
                      >
                        Add
                      </button>
                    ) : (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => aiDetectedUpdates.forEach((u) => approveUpdate(u.field))}
              className="w-full mt-3 text-xs text-indigo-600 font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <Check size={11} /> Approve all
            </button>

            <div className="mt-4 pt-4 border-t border-indigo-100 space-y-2">
              <Button
                onClick={() => navigate(`/client/${id}`)}
                className="w-full bg-[#1E3A5F] hover:bg-[#162d4a] text-white gap-2 text-xs"
              >
                View Profile <ArrowRight size={12} />
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full border-indigo-200 text-gray-600 hover:bg-indigo-50 text-xs"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
