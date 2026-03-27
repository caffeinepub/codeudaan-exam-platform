import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  ChevronRight,
  Clock,
  Code2,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const rules = [
  {
    icon: BookOpen,
    title: "50 MCQ Questions",
    desc: "24 Java + 26 HTML questions covering core concepts",
  },
  {
    icon: Clock,
    title: "2 Hours Duration",
    desc: "You have 120 minutes to complete the exam",
  },
  {
    icon: Camera,
    title: "Camera Monitoring",
    desc: "Webcam access required for live proctoring",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    desc: "Tab switching and copying are strictly monitored",
  },
  {
    icon: AlertTriangle,
    title: "Warning System",
    desc: "3 warnings = exam terminated immediately",
  },
];

export default function StartPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleStart() {
    const trimmed = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmed) {
      setError("Please enter your full name to continue.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    sessionStorage.setItem("cu_username", trimmed);
    sessionStorage.setItem("cu_email", trimmedEmail);
    sessionStorage.removeItem("cu_answers");
    sessionStorage.removeItem("cu_warnings");
    navigate({ to: "/exam" });
  }

  return (
    <div className="min-h-screen matrix-bg vignette relative overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="pointer-events-none fixed top-0 left-1/3 w-96 h-96 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.79 0.22 142) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-1/4 w-80 h-80 rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.18 264) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon/20 border border-neon/40 flex items-center justify-center neon-glow">
              <Code2 className="w-4 h-4 text-neon" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-neon neon-text">Code</span>
              <span className="text-foreground">Udaan</span>
            </span>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-muted-foreground bg-surface/60 border border-border/60 rounded-full px-3 py-1">
              Exam Platform
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            <span className="text-xs text-neon font-medium tracking-wider uppercase">
              Live Proctored Exam
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">CodeUdaan </span>
            <span className="text-neon neon-text">Exam Platform</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Test your knowledge in Java & HTML with our professionally proctored
            assessment system.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Name + Email Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="exam-card p-8 flex flex-col gap-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Start Your Exam
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your details as they appear in your registration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground/80"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  data-ocid="start.input"
                  placeholder="e.g. Arjun Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  className="bg-surface/60 border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:border-neon focus:ring-neon/30 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground/80"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  data-ocid="start.input"
                  placeholder="e.g. arjun@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  className="bg-surface/60 border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:border-neon focus:ring-neon/30 h-11"
                />
              </div>

              {error && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="start.error_state"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="bg-surface/60 border border-warning/30 rounded-lg p-4">
              <p className="text-xs text-warning font-medium mb-1">
                ⚠️ Before you begin:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Allow camera access when prompted</li>
                <li>Do not switch tabs or minimize the window</li>
                <li>Ensure stable internet connection</li>
                <li>Do not right-click or copy during exam</li>
              </ul>
            </div>

            <Button
              data-ocid="start.primary_button"
              onClick={handleStart}
              className="w-full h-11 font-semibold text-base bg-neon text-background hover:bg-neon/90 neon-glow transition-all duration-200"
            >
              Start Exam
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Rules Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="exam-card p-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Exam Guidelines
            </h2>
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0 mt-0.5">
                    <rule.icon className="w-4 h-4 text-neon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {rule.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rule.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
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
