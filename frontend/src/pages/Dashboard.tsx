import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIChat } from "@/components/ui/ai-chat";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (prompt: string, template: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a task description.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing and redirect to timeline
    setTimeout(() => {
      toast({
        title: "Task started",
        description: "Your workforce is now processing the task.",
      });
      navigate("/timeline", { state: { prompt, template } });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <AIChat onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>

        {/* Recent runs hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground font-light">
            Your recent runs and history are available in your profile
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
