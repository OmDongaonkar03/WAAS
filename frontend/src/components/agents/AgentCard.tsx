import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AgentCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AgentCard({ 
  name, 
  description, 
  icon: Icon, 
  enabled, 
  onToggle 
}: AgentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative rounded-lg p-5 transition-colors border",
        enabled ? "border-border bg-card" : "border-border bg-card/50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div 
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors",
              enabled ? "border-border bg-secondary" : "border-border bg-secondary/50"
            )}
          >
            <Icon 
              className={cn(
                "w-5 h-5 transition-colors",
                enabled ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </div>
          
          <div>
            <h3 className={cn(
              "text-sm font-medium mb-1 transition-colors",
              enabled ? "text-foreground" : "text-muted-foreground"
            )}>
              {name}
            </h3>
            <p className="text-xs text-muted-foreground font-light">
              {description}
            </p>
          </div>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-foreground"
        />
      </div>

      {enabled && (
        <div className="absolute top-3 right-14">
          <span className="w-1.5 h-1.5 rounded-full bg-success block" />
        </div>
      )}
    </motion.div>
  );
}
