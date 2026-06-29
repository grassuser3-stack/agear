import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { todos } from "@/lib/data";
import { ChevronLeft, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TodosPage() {
  const [, navigate] = useLocation();
  const [todoList, setTodoList] = useState(todos);

  const toggleTodo = (id: string) => {
    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const open = todoList.filter((t) => !t.done);
  const completed = todoList.filter((t) => t.done);

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-[800px]">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1E3A5F] mb-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#1A325A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            To-Do List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {open.length} open · {completed.length} completed
          </p>
        </div>

        {/* Open tasks */}
        {open.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Open Tasks</h2>
            {open.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all",
                  todo.priority === "high"
                    ? "bg-red-50 border-red-100"
                    : todo.priority === "medium"
                    ? "bg-amber-50 border-amber-100"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-0.5 text-gray-300 hover:text-[#1E3A5F] transition-colors"
                >
                  <Circle size={18} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{todo.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{todo.clientName || 'General'}</p>
                  <p className="text-xs text-gray-400 mt-1">Due {todo.dueDate || 'TBD'}</p>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full shrink-0",
                    todo.priority === "high"
                      ? "bg-red-200 text-red-700"
                      : todo.priority === "medium"
                      ? "bg-amber-200 text-amber-700"
                      : "bg-gray-200 text-gray-700"
                  )}
                >
                  {todo.priority}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Completed tasks */}
        {completed.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</h2>
            {completed.map((todo) => (
              <div
                key={todo.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-0.5 text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <CheckCircle2 size={18} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 line-through">{todo.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{todo.clientName || 'General'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
