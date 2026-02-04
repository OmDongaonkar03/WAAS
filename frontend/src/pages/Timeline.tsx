import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Circle,
  Loader2,
} from "lucide-react";

interface ProcessStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed";
  duration?: string;
}

const initialSteps: ProcessStep[] = [
  { id: "1", label: "Initializing task", status: "pending" },
  { id: "2", label: "Gathering data & signals", status: "pending" },
  { id: "3", label: "Processing information", status: "pending" },
  { id: "4", label: "Analyzing patterns", status: "pending" },
  { id: "5", label: "Validating findings", status: "pending" },
  { id: "6", label: "Synthesizing results", status: "pending" },
  { id: "7", label: "Generating output", status: "pending" },
];

const streamingContent = [
  { delay: 0, content: "Starting analysis..." },
  { delay: 2000, content: "\n\n## Initial Data Collection\n\nScanning relevant sources for market data, competitor information, and developer sentiment..." },
  { delay: 4000, content: "\n\n**Key findings so far:**\n- Developer tools market is experiencing 24% CAGR\n- 78% of developers prefer subscription-based pricing\n- Rising demand for AI-assisted development tools" },
  { delay: 6000, content: "\n\n## Market Analysis\n\nApplying strategic frameworks to evaluate the opportunity..." },
  { delay: 8000, content: "\n\n**SWOT Analysis in progress:**\n- Strengths: Growing market, clear demand signals\n- Weaknesses: High competition from established players\n- Opportunities: AI integration, emerging markets\n- Threats: Economic uncertainty, rapid tech changes" },
  { delay: 10000, content: "\n\n## Validation Phase\n\nCross-referencing assumptions with available data..." },
  { delay: 12000, content: "\n\n**Validation Results:**\n- 12 of 15 assumptions validated\n- 3 moderate risks identified\n- Overall confidence score: 87%" },
  { delay: 14000, content: "\n\n## Final Synthesis\n\nCompiling insights into actionable recommendations..." },
  { delay: 16000, content: "\n\n---\n\n# Executive Summary\n\n**Recommendation: Proceed with launch planning**\n\nThe analysis indicates a favorable market opportunity for a developer-focused SaaS in 2026. Key success factors include:\n\n1. **Differentiation Strategy**: Focus on AI-native features\n2. **Pricing Model**: Freemium with team tiers\n3. **Go-to-Market**: Developer community-led growth\n4. **Timeline**: Q2 2026 target launch\n\n**Risk Mitigation:**\n- Phased rollout to manage market timing risk\n- Strategic partnerships for talent acquisition\n- Enterprise pilot program for adoption validation" },
];

export default function Timeline() {
  const location = useLocation();
  const prompt = location.state?.prompt || "Analyze whether we should launch a SaaS for developers in 2026";
  
  const [steps, setSteps] = useState<ProcessStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedContent, setDisplayedContent] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Progress through steps
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= initialSteps.length - 1) {
          clearInterval(stepTimer);
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 2300);

    return () => clearInterval(stepTimer);
  }, []);

  // Update step statuses
  useEffect(() => {
    setSteps(prev => prev.map((step, index) => {
      if (index < currentStepIndex) {
        return { ...step, status: "completed", duration: `${(index + 1) * 2}s` };
      } else if (index === currentStepIndex) {
        return { ...step, status: "running" };
      }
      return { ...step, status: "pending" };
    }));
  }, [currentStepIndex]);

  // Stream content
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    streamingContent.forEach(({ delay, content }) => {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content);
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-4 border-b border-border flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-medium truncate max-w-md">{prompt}</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(elapsedTime)}
                </span>
                <span>Startup Workforce</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={isComplete ? "completed" : "running"} />
            {isComplete && (
              <Link to="/output" state={{ prompt }}>
                <Button size="sm" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <FileText className="w-3 h-3" />
                  View Results
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 border-r border-border p-6 overflow-y-auto"
          >
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Process
            </h2>
            
            <div className="space-y-1">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    step.status === "running" 
                      ? "bg-secondary/50" 
                      : step.status === "completed" 
                        ? "opacity-70" 
                        : "opacity-40"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    ) : step.status === "running" ? (
                      <Loader2 className="w-4 h-4 text-foreground animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-light truncate ${
                      step.status === "running" ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {step.duration && (
                    <span className="text-xs text-muted-foreground/50">
                      {step.duration}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round((currentStepIndex / (initialSteps.length - 1)) * 100)}%</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIndex / (initialSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-foreground/50 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Streaming Output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-6 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Output
              </h2>
              
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="font-light text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {displayedContent}
                  {!isComplete && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                      className="inline-block w-2 h-4 bg-foreground/50 ml-1"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
