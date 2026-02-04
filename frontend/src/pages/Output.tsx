import { AppLayout } from "@/components/layout/AppLayout";
import { GlowCard } from "@/components/ui/glow-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Brain,
  Shield,
  Sparkles,
  Copy,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const outputData = {
  title: "Analyze whether we should launch a SaaS for developers in 2026",
  status: "completed" as const,
  duration: "3m 24s",
  confidence: 94,
  summary: `Based on comprehensive analysis from all agents, launching a SaaS for developers in 2026 presents a strong opportunity with some key considerations.

**Recommendation: Proceed with Launch**

The developer tools market shows robust growth (24% CAGR) with clear demand signals. However, success requires strong differentiation given established competition.`,
  sections: [
    {
      title: "Market Opportunity",
      icon: Search,
      color: "#3B82F6",
      content: `The developer tools market is projected to reach $45B by 2027. Key findings:

• 78% of developers prefer subscription-based pricing models
• Cloud-native tools showing 3x faster adoption than traditional alternatives
• API-first products seeing highest developer satisfaction scores
• Growing demand for AI-augmented development workflows`,
      confidence: 92
    },
    {
      title: "Strategic Analysis",
      icon: Brain,
      color: "#8B5CF6",
      content: `SWOT analysis reveals balanced risk-reward profile:

**Strengths:** Technical expertise, market timing, emerging trends alignment
**Weaknesses:** Brand awareness gap vs. established players
**Opportunities:** AI integration wave, remote work tools consolidation
**Threats:** Big tech expansion, open-source alternatives

Market opportunity score: 8.2/10`,
      confidence: 89
    },
    {
      title: "Risk Assessment",
      icon: Shield,
      color: "#10B981",
      content: `Validated 12/15 initial assumptions. Key risks identified:

1. **Market Timing (Moderate):** Entry window optimal through Q2 2027
2. **Talent Acquisition (Low-Moderate):** Competitive but achievable with remote-first approach
3. **Enterprise Adoption (Moderate):** 6-12 month sales cycle expected

Overall risk score: 3.2/10 (Manageable)`,
      confidence: 95
    },
    {
      title: "Recommendations",
      icon: Sparkles,
      color: "#F59E0B",
      content: `**Primary Recommendations:**

1. Focus on AI-augmented features as key differentiator
2. Target mid-market initially before enterprise expansion
3. Prioritize developer experience and documentation
4. Consider freemium model with usage-based scaling

**Next Steps:**
• Conduct customer discovery interviews (2-4 weeks)
• Build MVP focusing on core differentiating features
• Establish developer community pre-launch`,
      confidence: 91
    }
  ]
};

export default function Output() {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputData.summary);
    toast({
      title: "Copied to clipboard",
      description: "The summary has been copied to your clipboard.",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={outputData.status} />
              <span className="text-sm text-muted-foreground">
                Completed in {outputData.duration}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{outputData.title}</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Executive Summary */}
            <GlowCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Executive Summary</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {outputData.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">
                  {outputData.summary}
                </p>
              </div>
            </GlowCard>

            {/* Agent Outputs */}
            <Tabs defaultValue="market" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-secondary/30">
                {outputData.sections.map((section) => (
                  <TabsTrigger 
                    key={section.title} 
                    value={section.title.toLowerCase().replace(" ", "-")}
                    className="text-xs sm:text-sm"
                  >
                    {section.title.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {outputData.sections.map((section) => (
                <TabsContent 
                  key={section.title} 
                  value={section.title.toLowerCase().replace(" ", "-")}
                  className="mt-6"
                >
                  <GlowCard>
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${section.color}20` }}
                      >
                        <section.icon 
                          className="w-5 h-5"
                          style={{ color: section.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        <span className="text-sm text-success flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {section.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </GlowCard>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Confidence Score */}
            <GlowCard>
              <h3 className="font-semibold mb-4">Overall Confidence</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(outputData.confidence / 100) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{outputData.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                High confidence based on validated data and cross-agent consensus
              </p>
            </GlowCard>

            {/* Feedback */}
            <GlowCard>
              <h3 className="font-semibold mb-4">Was this helpful?</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  No
                </Button>
              </div>
            </GlowCard>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full gap-2" variant="outline">
                <RefreshCw className="w-4 h-4" />
                Re-run with Different Agents
              </Button>
              <Link to="/new-task">
                <Button className="w-full btn-primary-glow gap-2">
                  New Task
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Warnings */}
            <div className="p-4 rounded-lg border border-warning/30 bg-warning/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-warning mb-1">Limitations</h4>
                  <p className="text-xs text-muted-foreground">
                    Analysis based on available data as of January 2026. Market conditions may change.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
