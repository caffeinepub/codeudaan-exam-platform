import { Button } from "@/components/ui/button";
import { AlertOctagon, Mail, ShieldX } from "lucide-react";
import { motion } from "motion/react";

function openSupport() {
  window.location.href = "mailto:support@codeudaan.com";
}

export default function TerminatePage() {
  return (
    <div className="min-h-screen matrix-bg vignette relative flex flex-col">
      {/* Red ambient glow */}
      <div
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 27) 0%, transparent 70%)",
        }}
      />

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

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="max-w-lg w-full text-center"
          data-ocid="terminate.card"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/40 flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: "0 0 30px oklch(0.65 0.22 27 / 0.3)" }}
          >
            <ShieldX className="w-12 h-12 text-destructive" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-destructive mb-3"
          >
            Exam Terminated 🚫
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8"
          >
            Your exam has been terminated due to suspicious activity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="exam-card p-6 mb-6 text-left"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-4 h-4 text-destructive" />
              <h2 className="text-sm font-semibold text-foreground">
                Violation Summary
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                You exceeded the maximum allowed warnings (3/3)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                Suspicious activity was detected during the examination
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                This incident has been logged and recorded
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-destructive font-medium">
              ⛔ Re-attempt is not permitted after termination.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="button"
              data-ocid="terminate.button"
              variant="outline"
              className="border-border/60 text-muted-foreground hover:text-foreground hover:border-neon/40"
              onClick={openSupport}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </motion.div>
        </motion.div>
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
