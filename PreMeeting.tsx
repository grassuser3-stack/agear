// Focus: AI agenda with expandable talking points, editable items, track ticked items for meeting notes

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { getClientById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Edit2,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function PreMeeting() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const client = getClientById(id);

  const [agendaItems, setAgendaItems] = useState(DEFAULT_AGENDA_ITEMS);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [tickedItems, setTickedItems] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editTalkingPoints, setEditTalkingPoints] = useState<string[]>([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPriority, setNewPriority] = useState("medium");

  if (!client) return null;

  const handleToggleTick = (itemId: string) => {
    const newTicked = new Set(tickedItems);
    if (newTicked.has(itemId)) {
      newTicked.delete(itemId);
    } else {
      newTicked.add(itemId);
    }
    setTickedItems(newTicked);
  };

  const handleToggleAll = () => {
    if (tickedItems.size === agendaItems.length) {
      setTickedItems(new Set());
    } else {
      const allIds = new Set(agendaItems.map(item => item.id));
      setTickedItems(allIds);
    }
  };

  const handleStartEdit = (item: typeof agendaItems[0]) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditTime(item.time);
    setEditTalkingPoints([...item.talkingPoints]);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    setAgendaItems(agendaItems.map(item =>
      item.id === editingId
        ? { ...item, title: editTitle, time: editTime, talkingPoints: editTalkingPoints }
        : item
    ));
    setEditingId(null);
  };

  const handleAddNewAgenda = () => {
    if (!newTitle.trim()) return;
    const newId = `custom-${Date.now()}`;
    setAgendaItems([
      ...agendaItems,
      {
        id: newId,
        title: newTitle,
        time: newTime || "~10 min",
        priority: newPriority as "high" | "medium" | "low",
        talkingPoints: [],
      },
    ]);
    setNewTitle("");
    setNewTime("");
    setNewPriority("medium");
    setShowAddNew(false);
  };

  const handleStartMeeting = () => {
    const tickedList = Array.from(tickedItems);
    navigate(`/meeting/${id}?agenda=${tickedList.join(",")}`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-5 max-w-[1000px]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A325A]"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Pre-Meeting Preparation
            </h1>
            <p className="text-sm text-gray-500">
              {client.name} · Fri, 3 Jul · 10:30 AM · 60 min
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          {/* Main content */}
          <div className="space-y-4">
            {/* AI Agenda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Sparkles size={11} className="text-indigo-500" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-700">AI-Suggested Agenda</h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>
                <button
                  onClick={handleToggleAll}
                  className="text-xs px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
                >
                  {tickedItems.size === agendaItems.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-2.5">
                {agendaItems.map((item) => (
                  <div key={item.id}>
                    {/* Main item */}
                    {editingId === item.id ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase">Time</label>
                          <input
                            type="text"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Talking Points</label>
                          <div className="space-y-2">
                            {editTalkingPoints.map((point, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={point}
                                  onChange={(e) => {
                                    const newPoints = [...editTalkingPoints];
                                    newPoints[idx] = e.target.value;
                                    setEditTalkingPoints(newPoints);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm"
                                />
                                <button
                                  onClick={() => setEditTalkingPoints(editTalkingPoints.filter((_, i) => i !== idx))}
                                  className="p-2 hover:bg-red-100 rounded text-red-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => setEditTalkingPoints([...editTalkingPoints, ""])}
                              className="text-xs px-3 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium"
                            >
                              + Add Talking Point
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          item.priority === "high"
                            ? "bg-red-50 border-red-100 hover:bg-red-100/50"
                            : item.priority === "medium"
                            ? "bg-amber-50 border-amber-100 hover:bg-amber-100/50"
                            : "bg-gray-50 border-gray-100 hover:bg-gray-100/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={tickedItems.has(item.id)}
                          onChange={() => handleToggleTick(item.id)}
                          className="mt-0.5 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                        </div>
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          className="shrink-0 p-1 hover:bg-white/50 rounded transition-colors"
                        >
                          <ChevronDown
                            size={14}
                            className={cn(
                              "text-gray-400 transition-transform",
                              expandedItem === item.id && "rotate-180"
                            )}
                          />
                        </button>
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit2 size={14} className="text-blue-500" />
                        </button>
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                            item.priority === "high"
                              ? "bg-red-200 text-red-700"
                              : item.priority === "medium"
                              ? "bg-amber-200 text-amber-700"
                              : "bg-gray-200 text-gray-700"
                          )}
                        >
                          {item.priority}
                        </span>
                      </div>
                    )}

                    {/* Expanded talking points */}
                    {expandedItem === item.id && editingId !== item.id && (
                      <div className="mt-2 ml-3 pl-3 border-l-2 border-gray-200 space-y-1.5">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Talking Points
                        </p>
                        <ul className="space-y-1">
                          {item.talkingPoints.map((point, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add new agenda */}
                {!showAddNew ? (
                  <button
                    onClick={() => setShowAddNew(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Plus size={14} /> Add Agenda Item
                  </button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Title</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., Discuss life insurance needs"
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">Time</label>
                        <input
                          type="text"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          placeholder="~10 min"
                          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase">Priority</label>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewAgenda}
                        className="flex-1 px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddNew(false)}
                        className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-4">
                Total estimated time: ~60 minutes
              </p>
            </div>

            {/* Create Meeting Notes button */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                onClick={handleStartMeeting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2 font-semibold py-3 text-base"
              >
                Create Meeting Notes <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Right sidebar: Quick info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Client Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">AUM</p>
                  <p className="text-lg font-bold text-green-600">{client.aum}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Policies</p>
                  <p className="text-lg font-bold text-gray-800">{client.policies} active</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Last Met</p>
                  <p className="text-sm text-gray-700">{client.lastMeeting}</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-semibold text-indigo-900 mb-1">AI Ready</p>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    Live transcription, AI suggestions, and compliance checks are enabled for this meeting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
