import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className, glowColor = "primary" }: GlowCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <div 
        className={cn(
          "absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500",
          glowColor === "primary" && "bg-gradient-to-r from-primary/30 to-accent/30",
          glowColor === "success" && "bg-success/30",
          glowColor === "warning" && "bg-warning/30"
        )}
      />
      <div className="relative glass-panel rounded-xl p-6 h-full">
        {children}
      </div>
    </div>
  );
}
