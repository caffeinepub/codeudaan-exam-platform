import type { backendInterface } from "@/backend.d";
import { useCamera } from "@/camera/useCamera";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Send,
  Video,
  VideoOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL = questions.length;
const TOTAL_TIME = 7200;

type AnswerMap = Record<number, number>;

const WARNING_MESSAGES = [
  "⚠️ Suspicious activity detected",
  "🚫 Tab switching is not allowed",
  "🎥 Stay focused on the exam",
];

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const STATUS_COLORS: Record<string, string> = {
  current: "bg-neon border-neon text-background neon-glow",
  answered: "bg-neon/20 border-neon/50 text-neon",
  flagged: "bg-warning/20 border-warning/50 text-warning",
  unanswered:
    "bg-surface/60 border-border/60 text-muted-foreground hover:border-neon/40",
};

export default function ExamPage() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("cu_username") ?? "Student";
  const { actor } = useActor();
  const actorRef = useRef<backendInterface | null>(null);
  actorRef.current = actor;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    try {
      const saved = sessionStorage.getItem("cu_answers");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [warnings, setWarnings] = useState(0);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const warningCountRef = useRef(0);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const {
    videoRef,
    startCamera,
    isActive,
    error: camError,
  } = useCamera({
    facingMode: "user",
    width: 320,
    height: 240,
  });

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (!sessionStorage.getItem("cu_username")) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  useEffect(() => {
    sessionStorage.setItem("cu_answers", JSON.stringify(answers));
  }, [answers]);

  const computeScore = useCallback(() => {
    let score = 0;
    for (const q of questions) {
      if (answersRef.current[q.id] === q.correct) score++;
    }
    return score;
  }, []);

  const doSubmit = useCallback(
    async (score: number) => {
      try {
        const a = actorRef.current;
        const email = sessionStorage.getItem("cu_email") ?? "";
        if (a) {
          await a.submitResult(username, email, BigInt(score), BigInt(TOTAL));
        } else {
          sessionStorage.setItem("cu_score", String(score));
        }
      } catch (e) {
        console.error("Submit error:", e);
        sessionStorage.setItem("cu_score", String(score));
      }
      navigate({ to: "/result" });
    },
    [username, navigate],
  );

  const triggerWarning = useCallback(
    (msgIndex: number) => {
      if (submittedRef.current) return;
      warningCountRef.current += 1;
      const count = warningCountRef.current;
      const msg = WARNING_MESSAGES[msgIndex % WARNING_MESSAGES.length];
      setWarnings(count);
      setActiveWarning(`${msg} (${count}/3)`);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = setTimeout(
        () => setActiveWarning(null),
        4000,
      );
      if (count >= 3) {
        submittedRef.current = true;
        navigate({ to: "/terminate" });
      }
    },
    [navigate],
  );

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!submittedRef.current) {
            submittedRef.current = true;
            setIsSubmitting(true);
            doSubmit(computeScore());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [doSubmit, computeScore]);

  // Tab visibility anti-cheat
  useEffect(() => {
    const handler = () => {
      if (document.hidden) triggerWarning(1);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [triggerWarning]);

  // Right-click & copy anti-cheat
  useEffect(() => {
    const noCtx = (e: MouseEvent) => e.preventDefault();
    const noCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("copy", noCopy);
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("copy", noCopy);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setIsSubmitting(true);
    await doSubmit(computeScore());
  }, [doSubmit, computeScore]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / TOTAL) * 100;

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const timerPct = timeLeft / TOTAL_TIME;
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - timerPct);

  function getStatus(
    qId: number,
  ): "current" | "answered" | "flagged" | "unanswered" {
    if (questions[currentIndex].id === qId) return "current";
    if (flagged.has(qId)) return "flagged";
    if (answers[qId] !== undefined) return "answered";
    return "unanswered";
  }

  function toggleFlag(qId: number) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  }

  return (
    <div className="min-h-screen matrix-bg vignette relative flex flex-col select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-surface/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/uploads/chatgpt_image_mar_1_2026_10_27_56_pm-019d313a-f842-7626-816b-b899df228237-1.png"
              alt="CodeUdaan Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <nav
            className="hidden md:flex items-center gap-6 ml-8"
            aria-label="Exam navigation"
          >
            {["Dashboard", "My Exams", "Practice", "Results", "Profile"].map(
              (item) => (
                <span
                  key={item}
                  className={`text-sm cursor-default pb-1 ${
                    item === "My Exams"
                      ? "text-neon nav-link-active font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item}
                </span>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {warnings > 0 && (
              <div className="flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded-full px-3 py-1">
                <AlertTriangle className="w-3 h-3 text-warning" />
                <span className="text-xs text-warning font-medium">
                  {warnings}/3 warnings
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-surface/80 border border-border/60 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-neon/30 border border-neon/50 flex items-center justify-center">
                <span className="text-xs font-bold text-neon">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {username}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-[300px] shrink-0">
          {/* Question Nav */}
          <div className="exam-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Questions
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-neon/50" /> Done
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-warning/50" /> Flag
                </span>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  data-ocid={`exam.item.${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 text-xs font-medium rounded-md border transition-all duration-150 ${STATUS_COLORS[getStatus(q.id)]}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="exam-card p-4 flex flex-col items-center gap-3">
            <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider self-start">
              Time Remaining
            </h3>
            <div className="relative">
              <svg
                width="120"
                height="120"
                className="-rotate-90"
                role="img"
                aria-label={`Time remaining: ${timeStr}`}
              >
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke="oklch(0.22 0.045 264)"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={ringRadius}
                  fill="none"
                  stroke={
                    timeLeft < 600
                      ? "oklch(0.65 0.22 27)"
                      : "oklch(0.79 0.22 142)"
                  }
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashOffset}
                  style={{ transition: "stroke-dashoffset 0.9s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Clock className="w-4 h-4 text-neon mb-1" />
                <span
                  className={`text-base font-bold font-mono ${
                    timeLeft < 600 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {timeStr}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(timerPct * 100)}% remaining
            </p>
          </div>

          {/* Proctoring */}
          <div className="exam-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Live Proctoring
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive
                      ? "bg-monitoring animate-pulse"
                      : "bg-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? "text-monitoring" : "text-muted-foreground"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              {isActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                  aria-label="Live proctoring camera feed"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  {camError ? (
                    <>
                      <VideoOff className="w-6 h-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center px-2">
                        Camera unavailable
                      </p>
                    </>
                  ) : (
                    <>
                      <Video className="w-6 h-6 text-neon/40 animate-pulse" />
                      <p className="text-xs text-muted-foreground">
                        Connecting...
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Monitoring: {isActive ? "Camera Active" : "Awaiting camera"}
            </p>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Progress */}
          <div className="exam-card px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Progress: {answeredCount}/{TOTAL} answered
              </span>
              <span className="text-xs font-semibold text-neon">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface/80 rounded-full overflow-hidden border border-border/40">
              <motion.div
                className="h-full rounded-full bg-neon"
                style={{ boxShadow: "0 0 8px oklch(0.79 0.22 142 / 0.6)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="exam-card p-6 flex-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-neon/10 border border-neon/30 text-neon rounded-full px-3 py-1">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Question {currentIndex + 1} of {TOTAL}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1 border transition-all ${
                    flagged.has(currentQuestion.id)
                      ? "bg-warning/15 border-warning/50 text-warning"
                      : "border-border/50 text-muted-foreground hover:border-warning/40 hover:text-warning"
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
                </button>
              </div>

              {/* Question text */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground leading-relaxed">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.code && (
                  <div className="mt-3 rounded-lg bg-background/80 border border-border/60 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-surface/60">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-neon/60" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Code Snippet
                      </span>
                    </div>
                    <pre className="p-4 text-sm font-mono text-neon/90 overflow-x-auto">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: optIdx,
                        }))
                      }
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150 answer-option ${
                        isSelected
                          ? "selected"
                          : "border-border/50 bg-surface/40"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-neon border-neon text-background"
                            : "border-border/60 text-muted-foreground"
                        }`}
                      >
                        {OPTION_LABELS[optIdx]}
                      </span>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "text-foreground font-medium"
                            : "text-foreground/80"
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Nav Footer */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="exam.secondary_button"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="border-border/60 text-foreground hover:bg-surface hover:border-neon/40"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-xs text-muted-foreground">
                  <CheckSquare className="w-3.5 h-3.5 inline mr-1 text-neon" />
                  {answeredCount} answered
                </span>

                {currentIndex === TOTAL - 1 ? (
                  <Button
                    type="button"
                    data-ocid="exam.submit_button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-neon text-background hover:bg-neon/90 neon-glow font-semibold"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    {isSubmitting ? "Submitting..." : "Submit Exam"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    data-ocid="exam.primary_button"
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(TOTAL - 1, i + 1))
                    }
                    className="bg-neon text-background hover:bg-neon/90"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile submit */}
          <div className="lg:hidden">
            <Button
              type="button"
              data-ocid="exam.submit_button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-neon text-background hover:bg-neon/90 neon-glow font-semibold"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          </div>
        </main>
      </div>

      {/* Warning Toast */}
      <AnimatePresence>
        {activeWarning && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            data-ocid="exam.toast"
            className="fixed bottom-6 right-6 z-50 max-w-xs bg-card border border-warning/50 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-warning/15 border border-warning/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-semibold text-warning">Warning!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeWarning}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
