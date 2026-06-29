import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { appointments } from "@/lib/data";
import { ChevronLeft, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const [, navigate] = useLocation();

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Layout>
      <div className="p-6 space-y-4 max-w-[1000px]">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1E3A5F] mb-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Appointments
          </h1>
        </div>

        {/* Appointments list */}
        <div className="space-y-2">
          {sorted.map((appt) => (
            <div
              key={appt.id}
              onClick={() => appt.date === "2026-07-03" && navigate(`/pre-meeting/${appt.clientId}`)}
              className={cn(
                "p-4 bg-white rounded-lg border transition-all",
                appt.date === "2026-07-03"
                  ? "border-[#1E3A5F]/20 hover:shadow-md cursor-pointer"
                  : "border-gray-100"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-800">{appt.clientName}</p>
                    {appt.isNext && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Next Up
                      </span>
                    )}
                    {appt.date === "2026-07-03" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{appt.type}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(appt.date).toLocaleDateString("en-SG", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {appt.time} · {appt.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} /> {appt.location}
                    </span>
                  </div>
                </div>
                {appt.date === "2026-07-03" && <ChevronRight size={16} className="text-gray-300 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
