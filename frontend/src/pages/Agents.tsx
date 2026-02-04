import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlowCard } from "@/components/ui/glow-card";
import { AgentCard } from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Search,
  Brain,
  Shield,
  Sparkles,
  Save,
  RotateCcw,
  Settings,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const agentConfigs = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Gathers signals, data, and relevant information from various sources",
    icon: Search,
    color: "#3B82F6",
    settings: {
      depth: 75,
      sources: true,
      citations: true
    }
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Reasons through trade-offs, patterns, and strategic considerations",
    icon: Brain,
    color: "#8B5CF6",
    settings: {
      depth: 80,
      frameworks: true,
      quantitative: false
    }
  },
  {
    id: "validator",
    name: "Validator",
    description: "Checks assumptions, identifies risks, and validates logic",
    icon: Shield,
    color: "#10B981",
    settings: {
      depth: 85,
      strict: true,
      riskScoring: true
    }
  },
  {
    id: "synthesizer",
    name: "Synthesizer",
    description: "Combines insights and produces refined, actionable conclusions",
    icon: Sparkles,
    color: "#F59E0B",
    settings: {
      depth: 70,
      structured: true,
      confidence: true
    }
  },
];

export default function Agents() {
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>({
    researcher: true,
    analyst: true,
    validator: true,
    synthesizer: true
  });
  const [agentSettings, setAgentSettings] = useState<Record<string, any>>({
    researcher: agentConfigs[0].settings,
    analyst: agentConfigs[1].settings,
    validator: agentConfigs[2].settings,
    synthesizer: agentConfigs[3].settings,
  });
  const [selectedAgent, setSelectedAgent] = useState<string | null>("researcher");
  const { toast } = useToast();

  const handleToggleAgent = (agentId: string, enabled: boolean) => {
    setEnabledAgents(prev => ({ ...prev, [agentId]: enabled }));
  };

  const handleSave = () => {
    toast({
      title: "Configuration saved",
      description: "Your agent settings have been updated.",
    });
  };

  const handleReset = () => {
    setAgentSettings({
      researcher: agentConfigs[0].settings,
      analyst: agentConfigs[1].settings,
      validator: agentConfigs[2].settings,
      synthesizer: agentConfigs[3].settings,
    });
    toast({
      title: "Settings reset",
      description: "Agent configurations have been reset to defaults.",
    });
  };

  const selectedAgentConfig = agentConfigs.find(a => a.id === selectedAgent);

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
            <h1 className="text-3xl font-bold mb-1">Agent Configuration</h1>
            <p className="text-muted-foreground">
              Customize how each agent behaves and processes tasks
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="btn-primary-glow gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Agent List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold">Your Agents</h2>
            {agentConfigs.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className="cursor-pointer"
              >
                <AgentCard
                  name={agent.name}
                  description={agent.description}
                  icon={agent.icon}
                  enabled={enabledAgents[agent.id]}
                  onToggle={(enabled) => handleToggleAgent(agent.id, enabled)}
                />
              </div>
            ))}
          </motion.div>

          {/* Right Column - Agent Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {selectedAgentConfig && (
              <GlowCard>
                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: `${selectedAgentConfig.color}20` }}
                  >
                    <selectedAgentConfig.icon 
                      className="w-7 h-7"
                      style={{ color: selectedAgentConfig.color }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedAgentConfig.name} Agent</h2>
                    <p className="text-muted-foreground">{selectedAgentConfig.description}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Analysis Depth */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Analysis Depth
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {agentSettings[selectedAgent!]?.depth || 75}%
                      </span>
                    </div>
                    <Slider
                      value={[agentSettings[selectedAgent!]?.depth || 75]}
                      max={100}
                      step={5}
                      onValueChange={(value) => {
                        setAgentSettings(prev => ({
                          ...prev,
                          [selectedAgent!]: {
                            ...prev[selectedAgent!],
                            depth: value[0]
                          }
                        }));
                      }}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher depth means more thorough analysis but longer processing time
                    </p>
                  </div>

                  {/* Agent-specific settings */}
                  <div className="border-t border-border pt-6 space-y-6">
                    <h3 className="font-medium flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" />
                      Agent-Specific Settings
                    </h3>

                    {selectedAgent === "researcher" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Include Sources</Label>
                            <p className="text-xs text-muted-foreground">Provide links to source material</p>
                          </div>
                          <Switch
                            checked={agentSettings.researcher?.sources}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                researcher: { ...prev.researcher, sources: checked }
                              }));
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Citation Format</Label>
                            <p className="text-xs text-muted-foreground">Add inline citations to findings</p>
                          </div>
                          <Switch
                            checked={agentSettings.researcher?.citations}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                researcher: { ...prev.researcher, citations: checked }
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}

                    {selectedAgent === "analyst" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Use Frameworks</Label>
                            <p className="text-xs text-muted-foreground">Apply strategic frameworks (SWOT, Porter's, etc.)</p>
                          </div>
                          <Switch
                            checked={agentSettings.analyst?.frameworks}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                analyst: { ...prev.analyst, frameworks: checked }
                              }));
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Quantitative Mode</Label>
                            <p className="text-xs text-muted-foreground">Focus on numerical analysis and metrics</p>
                          </div>
                          <Switch
                            checked={agentSettings.analyst?.quantitative}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                analyst: { ...prev.analyst, quantitative: checked }
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}

                    {selectedAgent === "validator" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Strict Mode</Label>
                            <p className="text-xs text-muted-foreground">Apply rigorous validation criteria</p>
                          </div>
                          <Switch
                            checked={agentSettings.validator?.strict}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                validator: { ...prev.validator, strict: checked }
                              }));
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Risk Scoring</Label>
                            <p className="text-xs text-muted-foreground">Assign risk scores to identified issues</p>
                          </div>
                          <Switch
                            checked={agentSettings.validator?.riskScoring}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                validator: { ...prev.validator, riskScoring: checked }
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}

                    {selectedAgent === "synthesizer" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Structured Output</Label>
                            <p className="text-xs text-muted-foreground">Generate organized, sectioned reports</p>
                          </div>
                          <Switch
                            checked={agentSettings.synthesizer?.structured}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                synthesizer: { ...prev.synthesizer, structured: checked }
                              }));
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Confidence Scores</Label>
                            <p className="text-xs text-muted-foreground">Include confidence levels for conclusions</p>
                          </div>
                          <Switch
                            checked={agentSettings.synthesizer?.confidence}
                            onCheckedChange={(checked) => {
                              setAgentSettings(prev => ({
                                ...prev,
                                synthesizer: { ...prev.synthesizer, confidence: checked }
                              }));
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Instructions */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <Label>Custom Instructions (Optional)</Label>
                    <Input
                      placeholder="Add specific instructions for this agent..."
                      className="bg-secondary/50 border-border/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      These instructions will be included in every task this agent processes
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
