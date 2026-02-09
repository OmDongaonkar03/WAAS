import { useEffect } from "react";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Users,
  Brain,
  Shield,
  BarChart3,
  GitBranch,
  CheckCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: Users,
    title: "Multi-Agent Orchestration",
    description:
      "Deploy specialized AI agents that work together, each with clear roles.",
  },
  {
    icon: Brain,
    title: "Meta-Controller Intelligence",
    description:
      "Intelligent controller breaks down complex tasks for optimal results.",
  },
  {
    icon: GitBranch,
    title: "Iterative Refinement",
    description:
      "Agents critique and improve each other's work for better outputs.",
  },
  {
    icon: BarChart3,
    title: "Full Transparency",
    description: "Track every step. See who did what and why.",
  },
  {
    icon: Shield,
    title: "Configurable Workflows",
    description: "Turn agents on or off based on your needs.",
  },
  {
    icon: Zap,
    title: "Enterprise Ready",
    description: "Built for scale with robust APIs and security.",
  },
];

const agents = [
  { name: "Researcher", description: "Gathers signals and data" },
  { name: "Analyst", description: "Reasons through trade-offs" },
  { name: "Validator", description: "Checks assumptions and logic" },
  { name: "Synthesizer", description: "Produces refined conclusions" },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(0 0% 30%)"
        />

        <div className="container mx-auto px-6 pt-24 lg:pt-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-muted-foreground text-sm mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Workforce as a Service
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
                <span className="text-foreground">AI Teams</span>
                <br />
                <span className="text-muted-foreground text-light">
                  That Work Together
                </span>
              </h1>

              <p className="text-lg text-muted-foreground font-light max-w-lg mb-10 leading-relaxed">
                Transform AI from a single assistant into a coordinated
                workforce. Create tasks, choose agents, and watch them
                collaborate.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="btn-primary-glow gap-2 h-11 px-6"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 px-6 border-border text-foreground hover:bg-secondary"
                  >
                    View Demo
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-4 mt-12 justify-center lg:justify-start text-sm text-muted-foreground">
                <span>2,500+ teams</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>1M+ tasks completed</span>
              </div>
            </motion.div>

            {/* Right content - 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative h-[400px] lg:h-[550px] w-full"
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agent Preview Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Your AI Workforce
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto">
              Each agent has a specialized role. Combine them to tackle complex
              problems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center mb-4 group-hover:border-muted-foreground transition-colors">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">{agent.name}</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {agent.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Beyond One-Shot Prompts
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto">
              Controllable, team-based intelligence for consistent results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-lg border border-border bg-card"
              >
                <feature.icon className="w-5 h-5 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Use Case */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border bg-card p-8 md:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">
                  See It In Action
                </h2>
                <p className="text-muted-foreground font-light mb-8">
                  Ask:{" "}
                  <span className="text-foreground">
                    "Analyze whether we should launch a SaaS for developers in
                    2026."
                  </span>
                </p>

                <div className="space-y-4">
                  {[
                    {
                      agent: "Researcher",
                      action: "Gathers market signals and data",
                    },
                    { agent: "Analyst", action: "Reasons through trade-offs" },
                    {
                      agent: "Validator",
                      action: "Checks assumptions and logic",
                    },
                    {
                      agent: "Synthesizer",
                      action: "Produces actionable conclusion",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={step.agent}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="text-foreground">{step.agent}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          — {step.action}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <span className="text-foreground">→</span> Initializing
                    workforce...
                  </p>
                  <p>
                    <span className="text-success">✓</span> Researcher agent
                    active
                  </p>
                  <p>
                    <span className="text-success">✓</span> Analyst agent active
                  </p>
                  <p>
                    <span className="text-success">✓</span> Validator agent
                    active
                  </p>
                  <p>
                    <span className="text-foreground">→</span> Processing
                    task...
                  </p>
                  <p className="pt-2 text-foreground">
                    <span className="text-success">✓</span> Analysis complete.
                    Confidence: 94%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Ready to Build Your AI Workforce?
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto mb-8">
              Join thousands of teams using WAAS to transform how they work with
              AI.
            </p>
            <Link to="/signup">
              <Button size="lg" className="btn-primary-glow gap-2 h-11 px-6">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-medium tracking-tight">WAAS</span>
            <p className="text-sm text-muted-foreground">
              © 2026 WAAS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
