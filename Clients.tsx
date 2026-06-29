import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { clients, formatAUM } from "@/lib/data";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<"aum" | "policies" | "name">("aum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...clients].sort((a, b) => {
    let result = 0;
    if (sortBy === "aum") result = a.aum - b.aum;
    else if (sortBy === "policies") result = a.policies - b.policies;
    else result = a.name.localeCompare(b.name);
    return sortDir === "asc" ? result : -result;
  });

  const filtered = sorted.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A325A] mb-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Clients
            </h1>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A325A]/20"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {["aum", "policies", "name"].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  if (sortBy === opt) {
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy(opt as any);
                    setSortDir("desc");
                  }
                }}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium transition-all",
                  sortBy === opt
                    ? "bg-white text-[#1A325A] shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {opt === "aum"
                  ? `AUM ${sortBy === opt ? (sortDir === "asc" ? "↑" : "↓") : "↓"}`
                  : opt === "policies"
                  ? `Policies ${sortBy === opt ? (sortDir === "asc" ? "↑" : "↓") : "↓"}`
                  : `${sortDir === "asc" ? "A–Z" : "Z–A"}`}
              </button>
            ))}
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-2">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-100 hover:border-[#1A325A]/20 hover:shadow-md transition-all overflow-hidden"
            >
              <div
                onClick={() => navigate(`/client/${client.id}`)}
                className="flex items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#1A325A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {client.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800">{client.name}</p>
                    <p className="text-xs text-gray-500 truncate">{client.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{formatAUM(client.aum)}</p>
                    <p className="text-xs text-gray-400">AUM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{client.policies}</p>
                    <p className="text-xs text-gray-400">Policies</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === client.id ? null : client.id);
                    }}
                    className="text-xs font-medium text-[#1A325A] hover:text-[#964B36] transition-colors shrink-0 px-2 py-1 rounded hover:bg-gray-50"
                  >
                    {expandedId === client.id ? "Less" : "More"}
                  </button>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </div>
              </div>
              {expandedId === client.id && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                      <p className="text-gray-800 break-all">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                      <p className="text-gray-800">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Last Meeting</p>
                      <p className="text-gray-800">{new Date(client.lastMeeting).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
