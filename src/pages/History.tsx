import { AppLayout } from "@/components/layout/AppLayout";
import { GlowCard } from "@/components/ui/glow-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";

const historyData = [
  {
    id: "1",
    title: "Market Analysis: SaaS for Developers 2026",
    status: "completed" as const,
    agents: ["Researcher", "Analyst", "Validator", "Synthesizer"],
    duration: "3m 24s",
    date: "2026-01-30",
    time: "14:32",
    confidence: 94
  },
  {
    id: "2",
    title: "Competitive Landscape: AI Code Assistants",
    status: "completed" as const,
    agents: ["Researcher", "Analyst"],
    duration: "2m 15s",
    date: "2026-01-30",
    time: "11:45",
    confidence: 87
  },
  {
    id: "3",
    title: "Risk Assessment: Cloud Migration Strategy",
    status: "completed" as const,
    agents: ["Analyst", "Validator", "Synthesizer"],
    duration: "4m 12s",
    date: "2026-01-29",
    time: "16:20",
    confidence: 91
  },
  {
    id: "4",
    title: "Product Roadmap Validation Q3 2026",
    status: "failed" as const,
    agents: ["Researcher", "Validator"],
    duration: "1m 45s",
    date: "2026-01-29",
    time: "09:15",
    confidence: 0
  },
  {
    id: "5",
    title: "Market Entry Analysis: APAC Region",
    status: "completed" as const,
    agents: ["Researcher", "Analyst", "Validator"],
    duration: "5m 02s",
    date: "2026-01-28",
    time: "15:30",
    confidence: 89
  },
  {
    id: "6",
    title: "Pricing Strategy Optimization",
    status: "completed" as const,
    agents: ["Analyst", "Synthesizer"],
    duration: "2m 48s",
    date: "2026-01-28",
    time: "10:00",
    confidence: 92
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = historyData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Task History</h1>
            <p className="text-muted-foreground">
              Review past runs and replay task executions
            </p>
          </div>
          <Link to="/new-task">
            <Button className="btn-primary-glow gap-2">
              New Task
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlowCard>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm text-muted-foreground">
              <div className="col-span-5">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            <div className="divide-y divide-border">
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-4 hover:bg-secondary/20 -mx-6 px-6 transition-colors cursor-pointer"
                >
                  <div className="grid md:grid-cols-12 gap-4 items-center">
                    {/* Task */}
                    <div className="md:col-span-5">
                      <h3 className="font-medium mb-1 truncate">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{item.agents.length} agents</span>
                        {item.status === "completed" && (
                          <>
                            <span>•</span>
                            <span className="text-success">{item.confidence}% confidence</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Duration */}
                    <div className="md:col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {item.duration}
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2 text-sm text-muted-foreground">
                      <div>{item.date}</div>
                      <div className="text-xs">{item.time}</div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex justify-end gap-2">
                      <Link to={`/output`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          View
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No tasks found matching your search.</p>
              </div>
            )}
          </GlowCard>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {historyData.length} tasks
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
