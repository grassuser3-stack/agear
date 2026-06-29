// NIC — Home Dashboard (Simplified)
// Focus: Clean entry point to DURING and AFTER meeting flows

import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { clients, appointments, formatAUM, getImportantDatesThisWeek } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  ChevronRight,
  Calendar,
  Users,
  ArrowRight,
  Heart,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TODAY = "2026-07-03";

export default function Home() {
  const [, navigate] = useLocation();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const todayAppts = appointments.filter((a) => a.date === TODAY);
  const nextAppt = todayAppts.find((a) => a.isNext);
  const importantDates = getImportantDatesThisWeek();

  const handleCopyMessage = (message: string, idx: number) => {
    navigator.clipboard.writeText(message);
    setCopiedIdx(idx);
    toast.success("Message copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Good morning, Faith.
          </h1>
          <p className="text-gray-500 mt-1">
            {nextAppt ? (
              <>
                Your next meeting is <span className="font-semibold text-[#1E3A5F]">{nextAppt.clientName}</span> at{" "}
                <span className="font-semibold text-[#1E3A5F]">{nextAppt.time}</span> today.
              </>
            ) : (
              "No meetings scheduled for today."
            )}
          </p>
        </div>

        {/* Next Meeting — Big CTA */}
        {nextAppt && (
          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#162d4a] rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/60 uppercase tracking-wider font-medium">Next Meeting</p>
                <h2 className="text-2xl font-bold mt-2">{nextAppt.clientName}</h2>
                <p className="text-white/80 mt-1">{nextAppt.type}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {nextAppt.time} · {nextAppt.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {nextAppt.location}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/pre-meeting/${nextAppt.clientId}`)}
                  className="bg-white text-[#1E3A5F] hover:bg-gray-100 font-semibold gap-2"
                >
                  Prepare for Meeting <ArrowRight size={14} />
                </Button>
                <Button
                  onClick={() => navigate(`/client/${nextAppt.clientId}`)}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold gap-2"
                >
                  View Client Info <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* Clients */}
          <div
            onClick={() => navigate("/clients")}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#1E3A5F]/20 transition-all duration-150 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={18} className="text-blue-600" />
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1E3A5F]" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Clients</p>
            <p className="text-xs text-gray-400 mt-2">
              AUM: <span className="font-semibold text-emerald-600">{formatAUM(clients.reduce((s, c) => s + c.aum, 0))}</span>
            </p>
          </div>

          {/* Appointments */}
          <div
            onClick={() => navigate("/appointments")}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-[#1E3A5F]/20 transition-all duration-150 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Calendar size={18} className="text-amber-600" />
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1E3A5F]" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{todayAppts.length}</p>
            <p className="text-sm text-gray-500 mt-1">Today's Meetings</p>
            <p className="text-xs text-gray-400 mt-2">
              {todayAppts.length > 0 ? `Next: ${nextAppt?.time}` : "No meetings"}
            </p>
          </div>

          {/* Important Dates This Week */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <Heart size={18} className="text-rose-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Important Dates</p>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {importantDates.length > 0 ? (
                importantDates.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-rose-200 pl-3 py-2 text-xs">
                    <p className="font-medium text-gray-800">
                      {item.client.name}
                    </p>
                    <p className="text-gray-600 mt-0.5">
                      {item.date.label}
                    </p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {item.daysUntil === 0 ? "Today" : `in ${item.daysUntil} day${item.daysUntil > 1 ? "s" : ""}`}
                    </p>
                    
                    {item.date.message && (
                      <div className="mt-2 space-y-1.5">
                        <button
                          onClick={() => handleCopyMessage(item.date.message!, idx)}
                          className={cn(
                            "w-full text-[11px] px-2 py-1 rounded flex items-center justify-center gap-1 transition-colors",
                            copiedIdx === idx
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                          )}
                        >
                          <Copy size={10} /> {copiedIdx === idx ? "Copied!" : "Copy message"}
                        </button>
                      </div>
                    )}

                    {item.date.giftSuggestions && item.date.giftSuggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.date.giftSuggestions.map((gift, gIdx) => (
                          <a
                            key={gIdx}
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[10px] text-blue-600 hover:text-blue-700 hover:underline truncate"
                            title={gift.reason}
                          >
                            {gift.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No important dates this week</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}
