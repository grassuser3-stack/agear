
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useLocation } from "wouter";
import { getClientById } from "@/lib/data";
import {
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Check,
  Keyboard,
  PenLine,
  ArrowRight,
  Zap,
  Shield,
  BarChart2,
  Mail,
  CheckCircle2,
  Maximize2,
  Edit2,
  GripVertical,
  Lightbulb,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TranscriptEntry {
  id: string;
  speaker: "FA" | "Client" | "AI" | "Note";
  text: string;
  timestamp: string;
}

const ISP_FEATURES = [
  "Explain that ISP enhances MediShield Life coverage and does not replace it",
  "Clarify hospital coverage level and healthcare choices (Private / Government ward options)",
  "Explain deductible, co-insurance and potential out-of-pocket costs",
  "Highlight premium costs, future increases and affordability",
  "Explain policy terms, exclusions and coverage limitations",
];

const PDPA_CLAUSES = [
  "I consent to the recording of this meeting for quality assurance and compliance purposes.",
  "I understand the recording will be securely stored and deleted after 30 days.",
  "I acknowledge that I can request to pause the recording at any time.",
  "I consent to the use of this recording for advisor training and performance review.",
  "I have been informed of my rights under the Personal Data Protection Act (PDPA).",
];

const SCENARIO_1: TranscriptEntry[] = [
  { id: "s1-1", speaker: "FA", text: "Chase, thanks for making time today. How's Anne doing?", timestamp: "00:10" },
  { id: "s1-2", speaker: "Client", text: "She's great! 6 months old now, starting to smile more. Linda's doing well too.", timestamp: "00:28" },
  { id: "s1-3", speaker: "FA", text: "That's wonderful. So in our previous meeting you were curious about getting an Integrated Shield Plan, let me share more about that today.", timestamp: "00:45" },
  { id: "s1-4", speaker: "Client", text: "Yes, what exactly are the benefits of Integrated Shield Plan to me and my 2 kids? I want to understand what we're actually getting.", timestamp: "01:10" },
];

const SCENARIO_2: TranscriptEntry[] = [
  { id: "s2-1", speaker: "FA", text: "Now, regarding your portfolio — the new MAS regulations that came into effect last month mean we should review your ILP allocation.", timestamp: "05:30" },
  { id: "s2-2", speaker: "Client", text: "What changed exactly?", timestamp: "05:45" },
  { id: "s2-3", speaker: "FA", text: "The new rules allow advisors to recommend up to 35% in alternative assets for accredited investors.", timestamp: "06:05" },
];

const SCENARIO_3: TranscriptEntry[] = [
  { id: "s3-1", speaker: "FA", text: "Let me show you how the ISP works for your family situation.", timestamp: "05:00" },
];

const DEFAULT_AGENDA_ITEMS = [
  {
    id: "isp",
    title: "Introduce ISP options for family of 3",
    time: "~15 min",
    priority: "high",
    talkingPoints: [
      "Current coverage vs family needs",
      "Integrated Shield Plan benefits for Chase, spouse, and Anne",
      "Premium comparison: Standard vs Enhanced",
      "Riders and add-ons available",
      "Claim process and support",
    ],
  },
  {
    id: "education",
    title: "Review Investment Linked Policies",
    time: "~10 min",
    priority: "high",
    talkingPoints: [
      "Review the current fund allocation and performance since the last review.",
      "Discuss whether the client's financial goals, or risk tolerance have changed.",
      "Consider rebalancing or switching funds if appropriate.",
    ],
  },
  {
    id: "will",
    title: "Discuss will drafting referral",
    time: "~5 min",
    priority: "medium",
    talkingPoints: [
      "Importance of updated will with young child",
      "Guardianship considerations for Anne",
      "Estate planning basics",
      "Referral to legal partner",
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio rebalancing review",
    time: "~10 min",
    priority: "medium",
    talkingPoints: [
      "Current asset allocation review",
      "Risk profile assessment",
      "Rebalancing recommendations",
      "Market outlook and strategy",
      "Implementation timeline",
    ],
  },
  {
    id: "qa",
    title: "Q&A and next steps",
    time: "~20 min",
    priority: "low",
    talkingPoints: [
      "Address any outstanding questions",
      "Confirm action items and timeline",
      "Schedule follow-up if needed",
      "Collect feedback on meeting",
    ],
  },
];

export default function LiveMeeting() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const client = getClientById(id);
  
  // Parse ticked agenda from URL
  const getTickedAgendaItems = () => {
    const params = new URLSearchParams(window.location.search);
    const agendaParam = params.get('agenda');
    if (agendaParam) {
      const tickedIds = agendaParam.split(',');
      return DEFAULT_AGENDA_ITEMS.filter((item: any) => tickedIds.includes(item.id));
    }
    return DEFAULT_AGENDA_ITEMS.slice(0, 2);
  };

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [faNote, setFaNote] = useState("");
  const [complianceAlert, setComplianceAlert] = useState(false);
  const [showComplianceDetail, setShowComplianceDetail] = useState(false);
  const [complianceUnderstood, setComplianceUnderstood] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tabKey, setTabKey] = useState("Tab");
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [scenario1Done, setScenario1Done] = useState(false);
  const [scenario2Done, setScenario2Done] = useState(false);
  const [scenario3Done, setScenario3Done] = useState(false);
  const [showPDPAModal, setShowPDPAModal] = useState(false);
  const [pdpaStep, setPdpaStep] = useState<"clauses" | "email" | "sent">("clauses");
  const [clientEmail, setClientEmail] = useState("");
  const [pdpaConsent, setPdpaConsent] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));
  const [pdpaFontSize, setPdpaFontSize] = useState(14);
  const [showISPPopup, setShowISPPopup] = useState(false);
  const [ispFeatures, setIspFeatures] = useState<Set<number>>(new Set());
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [detectedProducts, setDetectedProducts] = useState<Set<string>>(new Set());
  const [savedProductInfo, setSavedProductInfo] = useState<string | null>(null);
  const [displayAgenda, setDisplayAgenda] = useState(getTickedAgendaItems());
  const [expandedAgendaId, setExpandedAgendaId] = useState<string | null>(null);
  const [editingAgendaId, setEditingAgendaId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTalkingPoints, setEditingTalkingPoints] = useState<string[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [clickedGuide, setClickedGuide] = useState<number | null>(null);

  const handleEditAgenda = (item: typeof DEFAULT_AGENDA_ITEMS[0]) => {
    setEditingAgendaId(item.id);
    setEditingTitle(item.title);
    setEditingTalkingPoints([...item.talkingPoints]);
  };

  const handleSaveAgendaEdit = () => {
    if (!editingAgendaId) return;
    setDisplayAgenda(displayAgenda.map((item: any) =>
      item.id === editingAgendaId
        ? { ...item, title: editingTitle, talkingPoints: editingTalkingPoints }
        : item
    ));
    setEditingAgendaId(null);
  };

  const handlePDPAToggle = (idx: number) => {
    const newConsent = new Set(pdpaConsent);
    if (newConsent.has(idx)) {
      newConsent.delete(idx);
    } else {
      newConsent.add(idx);
    }
    setPdpaConsent(newConsent);
  };

  const handleSaveISPInfo = () => {
    setSavedProductInfo("ISP");
    setShowISPPopup(false);
    toast.success("ISP information added to sidebar", { duration: 2000 });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const detectProducts = (text: string) => {
    const products = ["ISP", "Integrated Shield Plan", "MediShield", "Retirement"];
    products.forEach((product) => {
      if (text.toLowerCase().includes(product.toLowerCase())) {
        setDetectedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.add(product);
          return newSet;
        });
        if (product === "ISP" || product === "Integrated Shield Plan") {
          setShowISPPopup(true);
        }
      }
    });
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Tab key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === tabKey || (tabKey === "Tab" && e.key === "Tab")) {
        if (document.activeElement === inputRef.current) {
          e.preventDefault();
          setShowAIChat(!showAIChat);
        }
      }
      if (e.key === "Escape") {
        setShowISPPopup(false);
        setShowAIChat(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tabKey, showAIChat]);

  // Timer
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const AI_ISP_RESPONSE = `ISP (Integrated Shield Plan) = MediShield Life upgraded.\n\nFor a married man with a newborn, pitch it like this:\n\n• Protects family cashflow: hospital bills won't wipe out savings meant for baby, household, or mortgage.\n\n• Lower out-of-pocket: better coverage limits vs MediShield Life alone, so less "bill shock" (still subject to deductible/co-insurance).\n\n• More choice: access to higher ward class/private options (depending on plan), so you're not forced into decisions based purely on cost.\n\n• Peace of mind for spouse: if you're hospitalised, your family isn't juggling a newborn and financial stress.`;

  const runScenario1 = () => {
    if (scenario1Done) return;
    setScenario1Done(true);
    setIsRecording(true);
    setElapsedSeconds(0);

    let index = 0;
    const interval = setInterval(() => {
      if (index < SCENARIO_1.length) {
        const entry = SCENARIO_1[index];
        setTranscript((prev) => [...prev, entry]);
        detectProducts(entry.text);
        index++;
        // Reveal AI Guide after client's final message asking about ISP
        if (index === SCENARIO_1.length) {
          setTimeout(() => setShowAIGuide(true), 600);
        }
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const runScenario2 = () => {
    if (scenario2Done) return;
    setScenario2Done(true);
    setIsRecording(true);
    setElapsedSeconds(1350); // Jump to 22:30

    let index = 0;
    const interval = setInterval(() => {
      if (index < SCENARIO_2.length) {
        const entry = SCENARIO_2[index];
        setTranscript((prev) => [...prev, entry]);
        detectProducts(entry.text);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setComplianceAlert(true);
        }, 500);
      }
    }, 1200);
  };

  const TAB_QUESTION = "How do I explain the benefits of ISP to a married man with 1 recent newborn";

  const runScenario3 = () => {
    if (scenario3Done) return;
    setScenario3Done(true);
    setIsRecording(true);
    setAiChatMessages([]);
    setAiChatInput("");

    // Activate AI chat mode
    setShowAIChat(true);

    // Simulate FA typing the question character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setAiChatInput(TAB_QUESTION.slice(0, charIndex));
      if (charIndex >= TAB_QUESTION.length) {
        clearInterval(typeInterval);
        // After typing is done, "send" the message
        setTimeout(() => {
          setAiChatMessages([{ role: "user", text: TAB_QUESTION }]);
          setAiChatInput("");
          // Show AI response after a short delay
          setTimeout(() => {
            setAiChatMessages((prev) => [...prev, { role: "ai", text: AI_ISP_RESPONSE }]);
          }, 900);
        }, 500);
      }
    }, 35);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Client not found</p>
      </div>
    );
  }

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return <>{text}</>;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return <>{parts.map((p, i) => p.toLowerCase() === searchQuery.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{p}</mark>
      : p
    )}</>;
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#1A325A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/pre-meeting/${id}`)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold">{client.name} · Meeting Notes</h1>
            <p className="text-sm text-blue-100">Fri, 3 Jul · {formatTime(elapsedSeconds)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowSearch(s => !s); setSearchQuery(""); setTimeout(() => searchInputRef.current?.focus(), 50); }}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium", showSearch ? "bg-white text-[#1A325A] border-white" : "border-white/30 text-white hover:bg-white/10")}
          >
            <Search size={14} />
            Search
          </button>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isRecording ? (
              <>
                <Mic size={16} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <MicOff size={16} />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/post-meeting/c1")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg font-medium transition-colors"
          >
            <span>End Meeting</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Scenario buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-2 flex-wrap">
        <button
          onClick={runScenario1}
          disabled={scenario1Done}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 text-xs font-medium transition-colors disabled:opacity-50"
        >
          ▶️ Integrated Shield Plan
        </button>
        <button
          onClick={runScenario3}
          disabled={scenario3Done}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-xs font-medium transition-colors disabled:opacity-50"
        >
          ▶️ Tab Key AI
        </button>
        <button
          onClick={runScenario2}
          disabled={scenario2Done}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-medium transition-colors disabled:opacity-50"
        >
          ▶️ Compliance Check
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript section (60%) */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          {/* Search bar */}
          {showSearch && (
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2 slide-down">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search transcript…"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {searchQuery && (
                <span className="text-xs text-gray-400 shrink-0">
                  {transcript.filter(e => e.text.toLowerCase().includes(searchQuery.toLowerCase())).length} result(s)
                </span>
              )}
              <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Transcript area */}
          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {transcript.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-sm">Transcript will appear here when recording starts</p>
              </div>
            ) : (
              transcript.map((entry) => {
                const dimmed = searchQuery.trim() && !entry.text.toLowerCase().includes(searchQuery.toLowerCase());
                return (
                <div key={entry.id} className={cn("flex gap-3 transition-opacity", (entry.speaker === "AI" || entry.speaker === "Note") && "flex-col", dimmed && "opacity-25")}>
                  {entry.speaker === "Note" ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 w-full">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold tracking-widest text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full uppercase">Note</span>
                        <span className="text-xs text-amber-500">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{highlightText(entry.text)}</p>
                    </div>
                  ) : entry.speaker === "AI" ? (
                    <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          AI
                        </div>
                        <span className="text-xs font-semibold text-purple-700">AI Assistant</span>
                        <span className="text-xs text-gray-400">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">{highlightText(entry.text)}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            entry.speaker === "FA" ? "bg-[#1A325A]" : "bg-gray-400"
                          )}
                        >
                          {entry.speaker === "FA" ? "FA" : "C"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2.5 w-full",
                            entry.speaker === "FA"
                              ? "bg-[#1A325A] text-white"
                              : "bg-gray-200 text-gray-900"
                          )}
                        >
                          <p className="text-sm">{highlightText(entry.text)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{entry.timestamp}</p>
                      </div>
                    </>
                  )}
                </div>
                );
              })
            )}
          </div>

          {/* Compliance Alert Modal */}
          {complianceAlert && !complianceUnderstood && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-red-600">⚠️ Regulations Changed!</h2>
                </div>
                <p className="text-sm text-gray-700">
                  New MAS regulations effective this month. Ensure compliance with updated ILP allocation rules.
                </p>
                {showComplianceDetail && (
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs">
                      <p className="font-semibold text-red-700 mb-1">What was said (incorrect):</p>
                      <p className="text-red-800 italic">"…up to 35% in alternative assets…"</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                      <p className="font-semibold text-green-700 mb-1">Correct information:</p>
                      <p className="text-green-900">MAS Notice FAA-N16 (May 2026): Cap is <strong>25%</strong> for accredited investors.</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowComplianceDetail(!showComplianceDetail)}
                    className="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    {showComplianceDetail ? "Hide" : "Read More"}
                  </button>
                  <button
                    onClick={() => {
                      setComplianceUnderstood(true);
                      setComplianceAlert(false);
                    }}
                    className="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ISP Popup Modal */}
          {showISPPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1A325A]">Integrated Shield Plan (ISP)</h2>
                    <button
                      onClick={() => setShowISPPopup(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Chart in rounded container */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-4">
                    <img
                      src="/isp-chart.png"
                      alt="Hospitalisation bill coverage based on coverage levels"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-3">
                      Source:{" "}
                      <a
                        href="https://plannerbee.co/best-integrated-shield-insurance/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Plannerbee
                      </a>
                    </p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Key Points to Cover:</p>
                    <ul className="space-y-3">
                      {ISP_FEATURES.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-4 h-4 rounded-full bg-indigo-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setShowISPPopup(false)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveISPInfo}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                    >
                      + Add to Sidebar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FA Note input or AI Chat */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            {!showAIChat ? (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={faNote}
                    onChange={(e) => setFaNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (faNote.trim()) {
                          setTranscript((prev) => [...prev, { id: `note-${Date.now()}`, speaker: "Note", text: faNote.trim(), timestamp: formatTime(elapsedSeconds) }]);
                          setFaNote("");
                        }
                      }
                    }}
                    placeholder="Add your notes here... (Press Tab for AI suggestions)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    rows={3}
                  />
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">Enter to send · Shift+Enter for new line</p>
                </div>
                <button
                  onClick={() => {
                    if (faNote.trim()) {
                      setTranscript((prev) => [...prev, { id: `note-${Date.now()}`, speaker: "Note", text: faNote.trim(), timestamp: formatTime(elapsedSeconds) }]);
                      setFaNote("");
                    }
                  }}
                  className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Note
                </button>
              </div>
            ) : (
              <div className="flex flex-col bg-white rounded-xl border-2 border-purple-300 shadow-lg overflow-hidden">
                {/* AI Chat header */}
                <div className="flex items-center justify-between px-4 py-2 bg-purple-600 text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    <span className="text-sm font-semibold">AI Assistant</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse" />
                  </div>
                  <button
                    onClick={() => { setShowAIChat(false); setAiChatMessages([]); setAiChatInput(""); }}
                    className="text-purple-200 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-purple-700 transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-52 min-h-[100px]">
                  {aiChatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-16 text-gray-400">
                      <p className="text-sm">Ask AI for help explaining products...</p>
                    </div>
                  ) : (
                    aiChatMessages.map((msg, idx) => (
                      <div key={idx} className={cn("flex gap-2", msg.role === "user" && "justify-end")}>
                        {msg.role === "ai" && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            AI
                          </div>
                        )}
                        <div className={cn(
                          "rounded-xl px-3 py-2 text-sm whitespace-pre-wrap max-w-[85%]",
                          msg.role === "user"
                            ? "bg-[#1A325A] text-white rounded-tr-none"
                            : "bg-purple-50 border border-purple-200 text-purple-900 rounded-tl-none"
                        )}>
                          <p>{msg.text}</p>
                        </div>
                        {msg.role === "user" && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A325A] flex items-center justify-center text-white text-xs font-bold">
                            FA
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add to transcript button — shown when AI has replied */}
                {aiChatMessages.length > 0 && aiChatMessages[aiChatMessages.length - 1].role === "ai" && (
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => {
                        const aiResponse = aiChatMessages[aiChatMessages.length - 1].text;
                        setTranscript((prev) => [...prev, { id: `ai-${Date.now()}`, speaker: "AI", text: aiResponse, timestamp: formatTime(elapsedSeconds) }]);
                        setShowAIChat(false);
                        setAiChatMessages([]);
                        setAiChatInput("");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus size={14} /> Add AI response to transcript
                    </button>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-purple-200 p-3 flex gap-2 bg-purple-50">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder="Ask AI anything about this meeting..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && aiChatInput.trim()) {
                        const userMsg = aiChatInput;
                        setAiChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                        setAiChatInput("");
                        setTimeout(() => {
                          let aiResponse = "I can help with that. Could you give me a bit more context?";
                          if (userMsg.toLowerCase().includes("isp") || userMsg.toLowerCase().includes("integrated shield") || userMsg.toLowerCase().includes("newborn") || userMsg.toLowerCase().includes("married")) {
                            aiResponse = AI_ISP_RESPONSE;
                          }
                          setAiChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                        }, 800);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  <button
                    onClick={() => {
                      if (!aiChatInput.trim()) return;
                      const userMsg = aiChatInput;
                      setAiChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                      setAiChatInput("");
                      setTimeout(() => {
                        let aiResponse = "I can help with that. Could you give me a bit more context?";
                        if (userMsg.toLowerCase().includes("isp") || userMsg.toLowerCase().includes("integrated shield") || userMsg.toLowerCase().includes("newborn") || userMsg.toLowerCase().includes("married")) {
                          aiResponse = AI_ISP_RESPONSE;
                        }
                        setAiChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                      }, 800);
                    }}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Guide section (40%) */}
        <div className="w-2/5 flex flex-col bg-gray-50 border-l border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Agenda section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Agenda</h3>
              <div className="space-y-1.5">
                {displayAgenda.map((item) => (
                  <div key={item.id} className="bg-yellow-50 border border-yellow-200 rounded">
                    <button
                      onClick={() => setExpandedAgendaId(expandedAgendaId === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between p-2 hover:bg-yellow-100 transition-colors"
                    >
                      <div className="text-left flex-1">
                        <p className="text-xs font-semibold text-yellow-900">{item.title}</p>
                      </div>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-yellow-700 transition-transform flex-shrink-0",
                          expandedAgendaId === item.id && "rotate-180"
                        )}
                      />
                    </button>
                    {expandedAgendaId === item.id && (
                      <div className="border-t border-yellow-200 p-2">
                        <p className="text-xs font-semibold text-yellow-900 mb-2">Talking Points</p>
                        <div className="space-y-1">
                          {item.talkingPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-700 mt-1 flex-shrink-0" />
                              <span className="text-xs text-yellow-800 leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Information section */}
            {savedProductInfo === "ISP" && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Information</h3>
                <div className="space-y-3">
                  {/* Chart with expand icon */}
                  <div className="relative group rounded-lg overflow-hidden border border-blue-100 bg-white cursor-pointer"
                    onClick={() => setEnlargedImage("/isp-chart.png")}
                  >
                    <img
                      src="/isp-chart.png"
                      alt="ISP Coverage Levels"
                      className="w-full"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-md p-1 shadow-sm">
                        <Maximize2 size={14} className="text-blue-700" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors" />
                  </div>

                  {/* ISP features */}
                  <div className="text-xs bg-white rounded p-3 border border-blue-100">
                    <p className="font-semibold text-blue-900 mb-2">Integrated Shield Plan (ISP)</p>
                    <div className="space-y-1.5">
                      {ISP_FEATURES.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1 flex-shrink-0" />
                          <span className="text-blue-800 text-xs leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* AI Guide — only appears after client asks about ISP */}
            {showAIGuide && (
              <div className="bg-white rounded-lg border border-indigo-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Guide</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>
                <div className="space-y-2">

                  {/* Suggestion 1: Question for the client */}
                  <button
                    onClick={() => {
                      setClickedGuide(1);
                      setFaNote("What hospital class do you and your family currently prefer — private, Class A, or B1? And do you have any existing coverage gaps we should address?");
                    }}
                    className={cn(
                      "w-full text-left rounded-lg p-3 border transition-all",
                      clickedGuide === 1
                        ? "bg-indigo-100 border-indigo-400"
                        : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300"
                    )}
                  >
                    <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Ask client</p>
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      "What hospital class do you and your family currently prefer — private, Class A, or B1? And do you have any existing coverage gaps we should address?"
                    </p>
                  </button>

                  {/* Suggestion 2: Ask AI for elaboration */}
                  <button
                    onClick={() => {
                      setClickedGuide(2);
                      setShowAIChat(true);
                      setAiChatMessages([]);
                      const q = "Can you elaborate on the difference between MediShield Life and ISP coverage limits, in simple terms for a client?";
                      setAiChatInput(q);
                    }}
                    className={cn(
                      "w-full text-left rounded-lg p-3 border transition-all",
                      clickedGuide === 2
                        ? "bg-purple-100 border-purple-400"
                        : "bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                    )}
                  >
                    <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-1">Ask AI to elaborate</p>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      "What's the difference between MediShield Life and ISP coverage limits, in simple terms?"
                    </p>
                  </button>

                  {/* Suggestion 3: Bring up to client */}
                  <button
                    onClick={() => {
                      setClickedGuide(3);
                      setFaNote("One thing worth considering is an ISP rider — it can eliminate your co-insurance and deductible entirely, so you'd have full coverage with no out-of-pocket surprises.");
                    }}
                    className={cn(
                      "w-full text-left rounded-lg p-3 border transition-all",
                      clickedGuide === 3
                        ? "bg-emerald-100 border-emerald-400"
                        : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                    )}
                  >
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">Suggest to client</p>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Bring up ISP riders that eliminate co-insurance and deductibles entirely — great option for a young family wanting zero out-of-pocket surprises.
                    </p>
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDPA Modal */}
      {showPDPAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {pdpaStep === "clauses" && (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A325A]">Recording Consent (PDPA)</h2>
                    <p className="text-sm text-gray-600 mt-0.5">Please review and consent to the following clauses:</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-gray-400 mr-1">Text size</span>
                    <button
                      onClick={() => setPdpaFontSize(s => Math.max(11, s - 1))}
                      className="w-7 h-7 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center"
                    >−</button>
                    <span className="w-6 text-center text-xs text-gray-500">{pdpaFontSize}</span>
                    <button
                      onClick={() => setPdpaFontSize(s => Math.min(22, s + 1))}
                      className="w-7 h-7 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {PDPA_CLAUSES.map((clause, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pdpaConsent.has(idx)}
                        onChange={() => handlePDPAToggle(idx)}
                        className="mt-1 shrink-0"
                      />
                      <span style={{ fontSize: `${pdpaFontSize}px` }} className="text-gray-700 leading-relaxed">{clause}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPDPAModal(false)}
                    className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPdpaStep("email")}
                    disabled={pdpaConsent.size < PDPA_CLAUSES.length}
                    className="flex-1 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {pdpaStep === "email" && (
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#1A325A]">Client Email</h2>
                <p className="text-sm text-gray-600">Enter the client's email to send the consent document:</p>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setPdpaStep("clauses")}
                    className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPdpaStep("sent")}
                    disabled={!clientEmail}
                    className="flex-1 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {pdpaStep === "sent" && (
              <div className="p-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-[#1A325A]">Consent Sent!</h2>
                <p className="text-sm text-gray-600">The consent document has been sent to {clientEmail}</p>
                <button
                  onClick={() => {
                    setShowPDPAModal(false);
                    setPdpaStep("clauses");
                    setClientEmail("");
                  }}
                  className="w-full px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enlarged image portal — renders outside any overflow:hidden ancestor */}
      {enlargedImage && createPortal(
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "60px 24px 24px" }}
          onClick={() => setEnlargedImage(null)}
        >
          <div
            style={{ position: "relative", maxWidth: "860px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEnlargedImage(null)}
              style={{ position: "absolute", top: "-38px", right: 0, display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
            >
              <X size={16} /> Close
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged chart"
              style={{ width: "100%", borderRadius: "12px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
