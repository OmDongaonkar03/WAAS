import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlowCard } from "@/components/ui/glow-card";
import { AgentCard } from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Search,
  Brain,
  Shield,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const availableAgents = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Gathers signals, data, and relevant information from various sources",
    icon: Search,
    color: "#3B82F6"
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Reasons through trade-offs, patterns, and strategic considerations",
    icon: Brain,
    color: "#8B5CF6"
  },
  {
    id: "validator",
    name: "Validator",
    description: "Checks assumptions, identifies risks, and validates logic",
    icon: Shield,
    color: "#10B981"
  },
  {
    id: "synthesizer",
    name: "Synthesizer",
    description: "Combines insights and produces refined, actionable conclusions",
    icon: Sparkles,
    color: "#F59E0B"
  },
];

const templates = [
  { label: "Market Analysis", prompt: "Analyze the market opportunity for..." },
  { label: "Competitive Research", prompt: "Compare and analyze competitors in..." },
  { label: "Risk Assessment", prompt: "Evaluate the risks and opportunities of..." },
  { label: "Product Validation", prompt: "Validate the product-market fit for..." },
];

export default function NewTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>({
    researcher: true,
    analyst: true,
    validator: true,
    synthesizer: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggleAgent = (agentId: string, enabled: boolean) => {
    setEnabledAgents(prev => ({ ...prev, [agentId]: enabled }));
  };

  const handleSubmit = () => {
    if (!taskPrompt.trim()) {
      toast({
        title: "Task required",
        description: "Please enter a task description.",
        variant: "destructive"
      });
      return;
    }

    const activeAgents = Object.values(enabledAgents).filter(Boolean).length;
    if (activeAgents === 0) {
      toast({
        title: "Agents required",
        description: "Please enable at least one agent.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Task started!",
        description: `${activeAgents} agents are now working on your task.`,
      });
      navigate("/timeline");
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Create New Task</h1>
          <p className="text-muted-foreground">
            Define your task and select which agents should collaborate on it
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Task Input */}
            <GlowCard>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Market Analysis Q3 2026"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Task Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want your AI workforce to analyze, research, or solve..."
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    className="min-h-[150px] bg-secondary/50 border-border/50 focus:border-primary resize-none"
                  />
                </div>

                {/* Quick Templates */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Quick Templates
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => (
                      <Button
                        key={template.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setTaskPrompt(template.prompt)}
                        className="text-xs"
                      >
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Agent Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Select Agents</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span>Toggle agents on/off based on your needs</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {availableAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    name={agent.name}
                    description={agent.description}
                    icon={agent.icon}
                    enabled={enabledAgents[agent.id]}
                    onToggle={(enabled) => handleToggleAgent(agent.id, enabled)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-24">
              <GlowCard>
                <h2 className="text-lg font-semibold mb-4">Run Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Agents</span>
                    <span className="font-medium">
                      {Object.values(enabledAgents).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Duration</span>
                    <span className="font-medium">2-4 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Iterations</span>
                    <span className="font-medium">Auto</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Active Workflow</h3>
                  <div className="space-y-2">
                    {availableAgents
                      .filter(a => enabledAgents[a.id])
                      .map((agent, index) => (
                        <div key={agent.id} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-secondary">
                            {index + 1}
                          </span>
                          <span style={{ color: agent.color }}>{agent.name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <Button 
                  className="w-full btn-primary-glow gap-2"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader w-4 h-4" />
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Run
                    </>
                  )}
                </Button>
              </GlowCard>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
