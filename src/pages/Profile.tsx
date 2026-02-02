import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  Settings,
  LogOut,
} from "lucide-react";

const runHistory = [
  {
    id: "1",
    prompt: "Analyze whether we should launch a SaaS for developers in 2026",
    template: "Startup Workforce",
    status: "completed",
    duration: "2m 34s",
    date: "2 hours ago",
  },
  {
    id: "2",
    prompt: "Evaluate competitive landscape for AI code assistants",
    template: "Startup Workforce",
    status: "completed",
    duration: "3m 12s",
    date: "Yesterday",
  },
  {
    id: "3",
    prompt: "Risk assessment for cloud migration strategy",
    template: "Startup Workforce",
    status: "completed",
    duration: "4m 05s",
    date: "3 days ago",
  },
  {
    id: "4",
    prompt: "Market analysis for developer productivity tools",
    template: "Startup Workforce",
    status: "completed",
    duration: "2m 48s",
    date: "1 week ago",
  },
];

export default function Profile() {
  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-light tracking-tight mb-1">Profile</h1>
          <p className="text-sm text-muted-foreground font-light">
            Manage your account and view run history
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-medium">Demo User</h2>
                  <p className="text-sm text-muted-foreground">Free Plan</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">demo@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined January 2026</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-4 p-6 rounded-xl border border-border bg-card/50"
            >
              <h3 className="text-sm font-medium mb-4">Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-light">24</p>
                  <p className="text-xs text-muted-foreground">Total Runs</p>
                </div>
                <div>
                  <p className="text-2xl font-light">3.2m</p>
                  <p className="text-xs text-muted-foreground">Avg. Duration</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Run History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Run History</h3>
                <Link to="/history">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {runHistory.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light truncate mb-1">{run.prompt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{run.template}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {run.duration}
                        </span>
                        <span>·</span>
                        <span>{run.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
