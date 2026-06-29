
import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TranscriptEntry {
  id: string;
  speaker: "FA" | "Client" | "AI";
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
  { id: "s1-1", speaker: "FA", text: "Hi Chase, thanks for meeting with me today. I wanted to discuss your family's insurance coverage, particularly the Integrated Shield Plan.", timestamp: "00:15" },
  { id: "s1-2", speaker: "Client", text: "Sure, I'm interested to learn more. What exactly are the benefits of Integrated Shield Plan to me and my 2 kids?", timestamp: "00:45" },
  { id: "s1-3", speaker: "FA", text: "Great question. Let me explain...", timestamp: "01:10" },
];

const SCENARIO_2: TranscriptEntry[] = [
  { id: "s2-1", speaker: "FA", text: "Based on our discussion, I recommend increasing your coverage limits to protect against inflation.", timestamp: "22:30" },
  { id: "s2-2", speaker: "Client", text: "That sounds good. What's the next step?", timestamp: "22:45" },
];

const SCENARIO_3: TranscriptEntry[] = [
  { id: "s3-1", speaker: "FA", text: "Let me show you how the ISP works for your family situation.", timestamp: "05:00" },
];

const DEFAULT_AGENDA_ITEMS = [
  {
    id: "isp",
    title: "Review ISP options for family of 3",
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
    title: "Present education endowment illustration",
    time: "~10 min",
    priority: "high",
    talkingPoints: [
      "Anne's education timeline and costs",
      "Endowment vs investment-linked options",
      "Maturity benefits and flexibility",
      "Tax implications",
      "Comparison with other savings vehicles",
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

  const runScenario1 = () => {
    if (scenario1Done) return;
    setScenario1Done(true);
    setIsRecording(true);
    setTranscript([]);
    setDetectedProducts(new Set());
    setElapsedSeconds(0);

    let index = 0;
    const interval = setInterval(() => {
      if (index < SCENARIO_1.length) {
        const entry = SCENARIO_1[index];
        setTranscript((prev) => [...prev, entry]);
        detectProducts(entry.text);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const runScenario2 = () => {
    if (scenario2Done) return;
    setScenario2Done(true);
    setIsRecording(true);
    setTranscript([]);
    setElapsedSeconds(1350); // Jump to 22:30
    setDetectedProducts(new Set());

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

  const runScenario3 = () => {
    if (scenario3Done) return;
    setScenario3Done(true);
    setIsRecording(true);
    setTranscript([]);
    setDetectedProducts(new Set());
    setElapsedSeconds(0);

    let index = 0;
    const interval = setInterval(() => {
      if (index < SCENARIO_3.length) {
        const entry = SCENARIO_3[index];
        setTranscript((prev) => [...prev, entry]);
        detectProducts(entry.text);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Client not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-[#1A325A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
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
          onClick={runScenario2}
          disabled={scenario2Done}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-medium transition-colors disabled:opacity-50"
        >
          ▶️ Compliance Check
        </button>
        <button
          onClick={runScenario3}
          disabled={scenario3Done}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-xs font-medium transition-colors disabled:opacity-50"
        >
          ▶️ Tab Key AI
        </button>
        <button
          onClick={() => setShowPDPAModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-700 text-xs font-medium transition-colors"
        >
          🔒 PDPA Consent
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Transcript section (60%) */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
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
              transcript.map((entry) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                        entry.speaker === "FA"
                          ? "bg-[#1A325A]"
                          : entry.speaker === "Client"
                          ? "bg-gray-400"
                          : "bg-indigo-500"
                      )}
                    >
                      {entry.speaker === "FA" ? "FA" : entry.speaker === "Client" ? "C" : "AI"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2.5 max-w-xs",
                        entry.speaker === "FA"
                          ? "bg-[#1A325A] text-white"
                          : entry.speaker === "Client"
                          ? "bg-gray-200 text-gray-900"
                          : "bg-purple-200 text-purple-900"
                      )}
                    >
                      <p className="text-sm">{entry.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{entry.timestamp}</p>
                  </div>
                </div>
              ))
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
                  Recent regulatory updates require enhanced due diligence for ISP recommendations. Please review the latest guidelines before proceeding.
                </p>
                {showComplianceDetail && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 text-xs text-gray-700">
                    <p><strong>Key Changes:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Enhanced CDD required for all new ISP applications</li>
                      <li>Additional documentation for family coverage</li>
                      <li>Updated anti-money laundering checks</li>
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowComplianceDetail(!showComplianceDetail)}
                    className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
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
              <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#1A325A]">Integrated Shield Plan (ISP)</h2>
                    <button
                      onClick={() => setShowISPPopup(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* ISP Chart */}
                  <div className="space-y-2">
                    <img
                      src="https://cdn.manus.im/webdev-static-assets/pasted_file_tYRPt9_image.png"
                      alt="ISP Coverage Levels"
                      className="w-full rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-600">
                      Source: <a href="https://plannerbee.co/best-integrated-shield-insurance/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Planner Bee</a>
                    </p>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Key Points to Cover:</p>
                    <div className="space-y-2">
                      {ISP_FEATURES.map((feature, idx) => (
                        <label key={idx} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ispFeatures.has(idx)}
                            onChange={() => {
                              const newFeatures = new Set(ispFeatures);
                              if (newFeatures.has(idx)) {
                                newFeatures.delete(idx);
                              } else {
                                newFeatures.add(idx);
                              }
                              setIspFeatures(newFeatures);
                            }}
                            className="mt-1"
                          />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowISPPopup(false)}
                      className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveISPInfo}
                      className="flex-1 px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
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
                    placeholder="Add your notes here... (Press Tab for AI suggestions)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={() => {
                    if (faNote.trim()) {
                      setTranscript((prev) => [...prev, { id: `note-${Date.now()}`, speaker: "FA", text: faNote, timestamp: formatTime(elapsedSeconds) }]);
                      setFaNote("");
                    }
                  }}
                  className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Note
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-64 bg-white rounded-lg border border-gray-200">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {aiChatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Ask AI for help explaining products...</p>
                    </div>
                  ) : (
                    aiChatMessages.map((msg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                          msg.role === "user" ? "bg-[#1A325A]" : "bg-indigo-500"
                        )}>
                          {msg.role === "user" ? "FA" : "AI"}
                        </div>
                        <div className={cn(
                          "rounded-lg px-3 py-2 max-w-xs text-sm whitespace-pre-wrap",
                          msg.role === "user"
                            ? "bg-[#1A325A] text-white"
                            : "bg-indigo-100 text-indigo-900"
                        )}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-200 p-3 flex gap-2">
                  <input
                    type="text"
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    placeholder="Ask AI..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && aiChatInput.trim()) {
                        const userMsg = aiChatInput;
                        setAiChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                        setAiChatInput("");
                        
                        setTimeout(() => {
                          let aiResponse = "I can help with that.";
                          if (userMsg.toLowerCase().includes("isp") || userMsg.toLowerCase().includes("integrated shield")) {
                            aiResponse = "ISP (Integrated Shield Plan) = MediShield Life upgraded.\n\nFor a married man with a newborn, pitch it like this:\n\n• Protects family cashflow: hospital bills won't wipe out savings meant for baby, household, or mortgage.\n\n• Lower out-of-pocket: better coverage limits vs MediShield Life alone, so less \"bill shock\" (still subject to deductible/co-insurance).\n\n• More choice: access to higher ward class/private options (depending on plan), so you're not forced into decisions based purely on cost.\n\n• Peace of mind for spouse: if you're hospitalised, your family isn't juggling a newborn and financial stress.";
                          }
                          setAiChatMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
                        }, 800);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => {
                      if (aiChatMessages.length > 0 && aiChatMessages[aiChatMessages.length - 1].role === "ai") {
                        const aiResponse = aiChatMessages[aiChatMessages.length - 1].text;
                        setTranscript((prev) => [...prev, { id: `ai-${Date.now()}`, speaker: "AI", text: aiResponse, timestamp: formatTime(elapsedSeconds) }]);
                        setShowAIChat(false);
                        setAiChatMessages([]);
                      }
                    }}
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Add to Notes
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
                {getTickedAgendaItems().map((item: any) => (
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
                      <div className="border-t border-yellow-200 p-2 bg-yellow-25">
                        <p className="text-xs font-semibold text-yellow-900 mb-2">Talking Points</p>
                        <div className="space-y-1">
                          {item.talkingPoints.map((point: string, idx: number) => (
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
                <div className="space-y-2">
                  <div className="text-xs bg-white rounded p-2 border border-blue-100">
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

            {/* AI Guide talking points */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles size={10} className="text-indigo-500" />
                </div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">AI Guide</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-900">Ask client about current coverage gaps and family healthcare needs</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-900">Would you like an elaboration on the premium comparison between Standard and Enhanced plans?</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p className="text-xs text-indigo-900">Consider mentioning the claim process and how quickly reimbursements are processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDPA Modal */}
      {showPDPAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {pdpaStep === "clauses" && (
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#1A325A]">Recording Consent (PDPA)</h2>
                <p className="text-sm text-gray-600">Please review and consent to the following clauses:</p>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {PDPA_CLAUSES.map((clause, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pdpaConsent.has(idx)}
                        onChange={() => handlePDPAToggle(idx)}
                        className="mt-1"
                      />
                      <span className="text-xs text-gray-700">{clause}</span>
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
    </div>
  );
}
