import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, X, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function VerificationBanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  // Don't show if user is verified or banner was dismissed
  if (!user || user.verified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: user.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email sent!",
          description: data.message || "Check your inbox for the verification link.",
        });
      } else {
        if (response.status === 429) {
          toast({
            title: "Too many requests",
            description: data.message || "Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to send verification email.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
      <div className="flex items-start gap-4">
        <Mail className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="text-sm">
            <strong className="font-semibold">Verify your email address</strong>
            <p className="mt-1 text-muted-foreground">
              We sent a verification link to <strong>{user.email}</strong>.
              Please check your inbox and click the link to verify your account.
            </p>
            <div className="mt-3 flex gap-3">
              <Button
                onClick={handleResend}
                disabled={resending}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}