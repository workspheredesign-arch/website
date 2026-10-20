import React, { useState } from "react";
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Mail,
} from "lucide-react";

export default function ContactModal({
  isOpen,
  onClose,
  preselectedProject,
  calculatorBrief,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(
    preselectedProject?.category || "Branding & Graphics",
  );
  const [timeline, setTimeline] = useState("2-4 weeks");
  const [message, setMessage] = useState(() => {
    if (calculatorBrief)
      return `Hello WorkSphere Atelier!\n\nI configured a tailored scope using your interactive planner:\n${calculatorBrief}\n\nLet's discuss onboarding and delivery dates.`;
    if (preselectedProject)
      return `Hello WorkSphere! I'm interested in commissioning a project similar to "${preselectedProject.title}".`;
    return "";
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Sync if calculatorBrief changes
  React.useEffect(() => {
    if (calculatorBrief) {
      setMessage(
        `Hello WorkSphere Atelier!\n\nI configured a tailored scope using your interactive planner:\n${calculatorBrief}\n\nLet's discuss onboarding and delivery dates.`,
      );
    } else if (preselectedProject) {
      setMessage(
        `Hello WorkSphere! I'm interested in commissioning a project similar to "${preselectedProject.title}".`,
      );
    }
  }, [calculatorBrief, preselectedProject]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "inquiry",
          "bot-field": "",
          name,
          email,
          service,
          timeline,
          message,
          project: preselectedProject?.title || "",
        }).toString(),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch (err) {
      setError(
        "Something went wrong. Please try again or email worksphere.design@gmail.com.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg z-10 bg-white dark:bg-[#0D0E13] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F1521] p-1 flex items-center justify-center border border-sky-500/20 shadow-xs">
              <img
                src="./logo-emblem-transparent.png"
                alt="WorkSphere"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-gray-900 dark:text-white">
              Work<span className="text-[#38BDF8]">Sphere</span> Commission
              Inquiry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Inquiry Dispatched!
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 max-w-sm mx-auto leading-relaxed">
              Thank you {name || "there"}! The WorkSphere design team will
              review your project brief and reply within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2 rounded-xl text-xs font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            >
              Back to Showcase
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Your Name / Studio
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@studio.com"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Primary Discipline
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#111217] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Branding & Graphics">
                    Branding & Graphics
                  </option>
                  <option value="UI/UX & Interactive">
                    UI/UX & Interactive
                  </option>
                  <option value="Vector Art">Vector Art & Illustration</option>
                  <option value="Print & Packaging">Print & Packaging</option>
                  <option value="Motion & Video">Motion & Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#111217] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Immediate (< 2 weeks)">
                    Immediate (&lt; 2 weeks)
                  </option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="Flexible / Retainer">
                    Flexible / Retainer
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 font-medium">
                Brief / Scope
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the project goals, deliverables required, software specifications..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}
            
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gray-900 hover:bg-black text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? "Sending…" : "Submit Project Inquiry"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
