// NIC — Client Profile Page
// Design: Warm Intelligence — navy authority, cream warmth, indigo AI
// Shows: background info, meeting history, AI conversation starters, important dates

import { useParams, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { getClientById, formatAUM, getAgeLabel, getDaysUntil, appointments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Sparkles,
  Calendar,
  Clock,
  Heart,
  Star,
  AlertCircle,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Cake,
  GraduationCap,
  ArrowRight,
  Lightbulb,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TODAY = "2026-07-03";

const aiConversationStarters = [
  {
    id: 1,
    text: "How's Anne doing? She must be about 6 months old now — has she started smiling more?",
    context: "Anne was born Jan 3, 2026 — she's 6 months old today",
    type: "personal",
    icon: Heart,
  },
  {
    id: 2,
    text: "Congratulations on the Senior Director promotion! How's the new role treating you?",
    context: "Chase was recently promoted to Senior Director at DBS",
    type: "career",
    icon: TrendingUp,
  },
  {
    id: 3,
    text: "Your wedding anniversary is coming up on August 12th — any plans to celebrate?",
    context: "Wedding anniversary in 50 days",
    type: "personal",
    icon: Heart,
  },
  {
    id: 4,
    text: "Last time we spoke, you mentioned looking at a second property in Q3 — has that progressed?",
    context: "Noted in Mar 2026 meeting",
    type: "financial",
    icon: TrendingUp,
  },
  {
    id: 5,
    text: "With Anne here now, have you had a chance to think about starting her education fund?",
    context: "Education endowment was a key action item from last meeting",
    type: "financial",
    icon: Shield,
  },
];

const aiAgendaSuggestions = [
  { label: "Review ISP upgrade options for family of 3 (Chase, Linda, Anne)", agendaId: "isp" },
  { label: "Review Investment Linked Policies", agendaId: "education" },
  { label: "Discuss will drafting referral — follow up from March", agendaId: "will" },
  { label: "Update on second property investment plans", agendaId: "property" },
  { label: "Review current portfolio allocation given new income level", agendaId: "portfolio" },
];

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const client = getClientById(id);
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>("m1");
  const [copiedStarter, setCopiedStarter] = useState<number | null>(null);
  const [checkedAgenda, setCheckedAgenda] = useState<Set<string>>(new Set(["isp", "education"]));

  if (!client) {
    return (
      <Layout>
        <div className="p-8 text-center text-gray-500">Client not found.</div>
      </Layout>
    );
  }

  const nextAppt = appointments.find((a) => a.clientId === id && a.date >= TODAY);
  const isNextMeeting = nextAppt?.isNext;

  const upcomingDates = client.backgroundInfo.importantDates
    .map((d) => ({ ...d, daysUntil: getDaysUntil(d.date) }))
    .filter((d) => d.daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const dateIcon = (type: string) => {
    if (type === "birthday") return Cake;
    if (type === "anniversary") return Heart;
    if (type === "graduation") return GraduationCap;
    return Calendar;
  };

  const handleCopyStarter = (id: number) => {
    setCopiedStarter(id);
    setTimeout(() => setCopiedStarter(null), 2000);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Back + header */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A325A] transition-colors mt-1"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1A325A] flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {client.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {client.name}
                    </h1>
                    {isNextMeeting && (
                      <span className="flex items-center gap-1.5 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Meeting today at {nextAppt?.time}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{client.occupation}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {client.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-[#1A325A]/10 text-[#1A325A] px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-4">
                {[
                  { label: "Policies", value: client.policies, color: "text-[#1A325A]" },
                  { label: "AUM", value: formatAUM(client.aum), color: "text-emerald-600" },
                  { label: "Last Met", value: new Date(client.lastMeeting).toLocaleDateString("en-SG", { month: "short", day: "numeric", year: "numeric" }), color: "text-gray-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-right">
                    <p className={cn("text-lg font-bold", color)}>{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>



        {/* Main grid */}
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-5">

          {/* ── Col 1: Background Info ── */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Background</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{client.backgroundInfo.summary}</p>
            </div>

            {/* Family */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users size={12} /> Family
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {client.backgroundInfo.family.map((member, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{member.relation}</p>
                    <p className="text-xs text-gray-600 font-medium mt-1">
                      {member.dob ? getAgeLabel(member.dob) : (member.age ? `${member.age} years old` : '')}
                    </p>
                    {member.notes && (
                      <p className="text-xs text-gray-400 mt-1.5 italic">{member.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle size={12} /> Key Concerns
              </h3>
              <ul className="space-y-1.5">
                {client.backgroundInfo.concerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Advisor Notes</h3>
              <ul className="space-y-2">
                {client.backgroundInfo.notes.map((note, i) => (
                  <li key={i} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Col 2: AI Conversation Starters + Dates ── */}
          <div className="space-y-4">
            {/* AI Conversation Starters */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 shadow-sm border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <h3 className="text-sm font-semibold text-indigo-700">Talking Points</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              </div>
              <p className="text-xs text-indigo-500 mb-3">Personalised based on background info & upcoming dates</p>

              <div className="space-y-2.5">
                {aiConversationStarters.map((starter) => {
                  const Icon = starter.icon;
                  return (
                    <div
                      key={starter.id}
                      className="bg-white rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all duration-150 group"
                    >
                      <div className="flex items-start gap-2">
                        <Icon size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 leading-snug">"{starter.text}"</p>
                          <p className="text-[10px] text-indigo-400 mt-1.5 italic">{starter.context}</p>
                        </div>
                        <button
                          onClick={() => handleCopyStarter(starter.id)}
                          className="shrink-0 text-[10px] text-indigo-400 hover:text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedStarter === starter.id ? "✓" : "Use"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Important Dates */}
            {upcomingDates.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar size={12} /> Upcoming Dates
                </h3>
                <div className="space-y-2.5">
                  {upcomingDates.map((date, i) => {
                    const Icon = dateIcon(date.type);
                    const isClose = date.daysUntil <= 14;
                    return (
                      <div key={i} className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg",
                        isClose ? "bg-amber-50 border border-amber-100" : "bg-gray-50"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          isClose ? "bg-amber-100" : "bg-gray-100"
                        )}>
                          <Icon size={14} className={isClose ? "text-amber-600" : "text-gray-500"} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{date.label}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(date.date).toLocaleDateString("en-SG", { month: "long", day: "numeric" })}
                          </p>
                        </div>
                        <span className={cn(
                          "text-xs font-semibold",
                          isClose ? "text-amber-600" : "text-gray-400"
                        )}>
                          {date.daysUntil === 0 ? "Today!" : `${date.daysUntil}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interests */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Star size={12} /> Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {client.backgroundInfo.interests.map((interest, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3: Meeting History ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} /> Meeting History
              </h3>
              <span className="text-xs text-gray-400">{client.meetingHistory.length} meetings</span>
            </div>

            <div className="space-y-3">
              {client.meetingHistory.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(meeting.date).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-xs text-gray-400">{meeting.duration} · {meeting.topics.slice(0, 2).join(", ")}</p>
                    </div>
                    {expandedMeeting === meeting.id ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>

                  {expandedMeeting === meeting.id && (
                    <div className="px-4 pb-4 border-t border-gray-50 space-y-3">
                      <p className="text-sm text-gray-600 leading-relaxed pt-3">{meeting.summary}</p>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">Topics Covered</p>
                        <div className="flex flex-wrap gap-1.5">
                          {meeting.topics.map((t, i) => (
                            <span key={i} className="text-xs bg-[#1E3A5F]/10 text-[#1E3A5F] px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1.5">Action Items</p>
                        <ul className="space-y-1">
                          {meeting.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                              <ArrowRight size={11} className="text-amber-500 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Agenda Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 shadow-sm border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} className="text-indigo-500" />
                <h3 className="text-xs font-semibold text-indigo-700">AI Suggested Agenda</h3>
              </div>
              <ul className="space-y-2">
                {aiAgendaSuggestions.map((item, i) => {
                  const checked = checkedAgenda.has(item.agendaId);
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer"
                      onClick={() => {
                        const next = new Set(checkedAgenda);
                        if (next.has(item.agendaId)) next.delete(item.agendaId);
                        else next.add(item.agendaId);
                        setCheckedAgenda(next);
                      }}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"}`}>
                        {checked && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={checked ? "text-gray-800 font-medium" : "text-gray-500"}>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
              <Button
                onClick={() => {
                  const ids = Array.from(checkedAgenda).join(",");
                  navigate(`/pre-meeting/${id}?selected=${ids}`);
                }}
                size="sm"
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                Full Pre-Meeting Prep <ArrowRight size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
