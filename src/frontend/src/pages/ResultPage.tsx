import { Button } from "@/components/ui/button";
import { useGetUserResult } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  RotateCcw,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function getPerformanceLabel(pct: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (pct >= 80) return { label: "Excellent", color: "text-neon", icon: "🚀" };
  if (pct >= 50) return { label: "Good", color: "text-monitoring", icon: "👍" };
  return { label: "Try Again", color: "text-warning", icon: "💡" };
}

export default function ResultPage() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("cu_username") ?? "";
  const [localScore, setLocalScore] = useState<number | null>(null);

  // Try to get score from localStorage fallback first
  useEffect(() => {
    const saved = sessionStorage.getItem("cu_score");
    if (saved) setLocalScore(Number(saved));
  }, []);

  const { data: result, isLoading, isError } = useGetUserResult(username);

  const score = result
    ? Number(result.score)
    : localScore !== null
      ? localScore
      : null;

  const total = result ? Number(result.totalQuestions) : 50;
  const pct = score !== null ? Math.round((score / total) * 100) : null;
  const perf = pct !== null ? getPerformanceLabel(pct) : null;

  if (!username) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen matrix-bg vignette relative flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, oklch(0.79 0.22 142) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/uploads/chatgpt_image_mar_1_2026_10_27_56_pm-019d313a-f842-7626-816b-b899df228237-1.png"
              alt="CodeUdaan Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center gap-8">
        {isLoading && score === null ? (
          <div
            className="exam-card p-12 w-full text-center"
            data-ocid="result.loading_state"
          >
            <div className="w-12 h-12 rounded-full border-2 border-neon/30 border-t-neon animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        ) : isError && score === null ? (
          <div
            className="exam-card p-12 w-full text-center"
            data-ocid="result.error_state"
          >
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">
              Failed to load results. Please try again.
            </p>
          </div>
        ) : score !== null && pct !== null && perf !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
            data-ocid="result.card"
          >
            {/* Score circle */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center mb-4 neon-glow"
                style={{ borderColor: "oklch(0.79 0.22 142)" }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-10"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.79 0.22 142) 0%, transparent 70%)",
                  }}
                />
                <Trophy className="w-6 h-6 text-neon mb-1" />
                <span className="text-4xl font-bold text-foreground">
                  {score}
                </span>
                <span className="text-sm text-muted-foreground">/{total}</span>
              </div>
              <span className={`text-5xl font-bold ${perf.color} neon-text`}>
                {pct}%
              </span>
            </div>

            {/* Performance card */}
            <div className="exam-card p-6 text-center mb-6">
              <div className="text-4xl mb-2">{perf.icon}</div>
              <h2 className={`text-2xl font-bold ${perf.color} mb-1`}>
                {perf.label}
              </h2>
              <p className="text-muted-foreground text-sm">
                {username}, you scored {score} out of {total} questions
                correctly.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: CheckCircle,
                  label: "Correct",
                  value: score,
                  color: "text-neon",
                },
                {
                  icon: XCircle,
                  label: "Incorrect",
                  value: total - score,
                  color: "text-destructive",
                },
                {
                  icon: TrendingUp,
                  label: "Score",
                  value: `${pct}%`,
                  color: perf.color,
                },
              ].map((stat) => (
                <div key={stat.label} className="exam-card p-4 text-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <p className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button
              data-ocid="result.primary_button"
              onClick={() => navigate({ to: "/" })}
              className="w-full h-11 bg-neon text-background hover:bg-neon/90 neon-glow font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reattempt Exam
            </Button>
          </motion.div>
        ) : null}
      </main>

      <footer className="relative z-10 text-center py-6 text-xs text-muted-foreground/50">
        © {new Date().getFullYear()} CodeUdaan Exam Platform. Built with love
        using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon/60 hover:text-neon transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
