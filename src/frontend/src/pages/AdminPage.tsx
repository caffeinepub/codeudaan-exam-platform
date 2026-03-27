import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllResults } from "@/hooks/useQueries";
import {
  Crown,
  Mail,
  RefreshCw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ADMIN_PASSWORD = "codeudaan@Devi";
const TOTAL_QUESTIONS = 50;

function getPerformance(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct >= 80) return "Excellent 🚀";
  if (pct >= 50) return "Good 👍";
  return "Try Again 💡";
}

function getPerformanceColor(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct >= 80) return "text-neon";
  if (pct >= 50) return "text-warning";
  return "text-destructive";
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    data: results = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetAllResults();

  const sorted = [...results].sort((a, b) => Number(b.score) - Number(a.score));

  const totalSubmissions = results.length;
  const highestScore = sorted.length > 0 ? Number(sorted[0].score) : 0;
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + Number(r.score), 0) / results.length,
        )
      : 0;

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen matrix-bg vignette flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="exam-card p-10 w-full max-w-sm flex flex-col gap-6"
          data-ocid="admin.panel"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-neon/15 border border-neon/40 flex items-center justify-center neon-glow">
              <ShieldCheck className="w-7 h-7 text-neon" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">
                Admin Access
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter password to access the admin panel
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              type="password"
              data-ocid="admin.input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-surface/60 border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:border-neon focus:ring-neon/30 h-11"
            />
            {authError && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.error_state"
              >
                {authError}
              </p>
            )}
          </div>

          <Button
            data-ocid="admin.primary_button"
            onClick={handleLogin}
            className="w-full h-11 font-semibold bg-neon text-background hover:bg-neon/90 neon-glow"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Access Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen matrix-bg vignette relative">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/uploads/chatgpt_image_mar_1_2026_10_27_56_pm-019d313a-f842-7626-816b-b899df228237-1.png"
              alt="CodeUdaan Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs font-semibold bg-neon/15 border border-neon/40 text-neon rounded-full px-3 py-1">
              Admin Panel
            </span>
          </div>
          <div className="ml-auto">
            <Button
              data-ocid="admin.secondary_button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-border/60 text-foreground hover:bg-surface hover:border-neon/40 gap-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <div
            className="exam-card p-6 flex items-center gap-4"
            data-ocid="admin.card"
          >
            <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-neon" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Submissions
              </p>
              <p className="text-3xl font-bold text-foreground">
                {totalSubmissions}
              </p>
            </div>
          </div>

          <div className="exam-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-neon" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Highest Score
              </p>
              <p className="text-3xl font-bold text-foreground">
                {highestScore}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /{TOTAL_QUESTIONS}
                </span>
              </p>
            </div>
          </div>

          <div className="exam-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center">
              <Crown className="w-5 h-5 text-neon" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Average Score
              </p>
              <p className="text-3xl font-bold text-foreground">
                {avgScore}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /{TOTAL_QUESTIONS}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="exam-card overflow-hidden"
          data-ocid="admin.table"
        >
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-neon" />
            <h2 className="text-lg font-semibold text-foreground">
              Leaderboard
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              Sorted by score
            </span>
          </div>

          {isLoading ? (
            <div
              className="flex items-center justify-center py-20"
              data-ocid="admin.loading_state"
            >
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 text-neon animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Loading results...
                </p>
              </div>
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3"
              data-ocid="admin.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface/60 border border-border/40 flex items-center justify-center">
                <Users className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No exam submissions yet.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Results will appear here once students complete the exam.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-surface/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                      Percentage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((result, index) => {
                    const score = Number(result.score);
                    const total =
                      Number(result.totalQuestions) || TOTAL_QUESTIONS;
                    const pct = Math.round((score / total) * 100);
                    const medal = MEDALS[index];
                    const isTop3 = index < 3;
                    return (
                      <motion.tr
                        key={`${result.username}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        data-ocid={`admin.row.${index + 1}`}
                        className={`border-b border-border/30 transition-colors hover:bg-surface/40 ${
                          isTop3 ? "bg-neon/3" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <span className="text-lg">
                            {medal ?? (
                              <span className="text-sm font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neon/20 border border-neon/30 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-neon">
                                {result.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {result.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {result.email || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-foreground">
                            {score}
                            <span className="text-xs font-normal text-muted-foreground">
                              /{total}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-surface/80 border border-border/40 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-neon"
                                style={{
                                  width: `${pct}%`,
                                  boxShadow:
                                    "0 0 4px oklch(0.79 0.22 142 / 0.5)",
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`text-sm font-medium ${getPerformanceColor(
                              score,
                              total,
                            )}`}
                          >
                            {getPerformance(score, total)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground/50">
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
