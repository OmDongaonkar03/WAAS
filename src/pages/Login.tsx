import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spotlight } from "@/components/ui/spotlight";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Github, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-lg group-hover:blur-xl transition-all" />
            </div>
            <span className="font-bold text-2xl gradient-text">WAAS</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="w-full gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Chrome className="w-4 h-4" />
              Google
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary-glow gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="loader w-4 h-4" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <Spotlight
          className="-top-40 -right-40"
          fill="hsl(199 89% 48%)"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 max-w-lg"
          >
            <blockquote className="text-xl font-medium mb-6">
              "WAAS transformed how our team approaches complex analysis. 
              The multi-agent collaboration produces insights we never could have reached with a single model."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">VP of Strategy, TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
