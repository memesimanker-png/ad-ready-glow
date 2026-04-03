import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function AdReturn() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const stepNumber = step || "step1";
  const stepLabel = stepNumber === "step1" ? "Step 1" : stepNumber === "step2" ? "Step 2" : "Final Step";
  const isLast = stepNumber === "step3";

  useEffect(() => {
    // Mark the step as completed
    localStorage.setItem(`${stepNumber}_completed`, "true");
    localStorage.removeItem("verification_step");

    toast({
      title: "Verification Successful",
      description: `${stepLabel} has been completed successfully.`,
    });

    setIsLoading(false);

    const timeout = setTimeout(() => {
      if (isLast) {
        navigate("/access-key");
      } else if (stepNumber === "step1") {
        navigate("/verify/step2");
      } else if (stepNumber === "step2") {
        navigate("/verify/step3");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate, toast, stepNumber, stepLabel, isLast]);

  return (
    <div className="min-h-screen bg-[url('/images/hacker-background.jpg')] bg-cover bg-center bg-fixed flex flex-col">
      <div className="min-h-screen bg-black/70 flex flex-col">
        <header className="container py-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SecureVerify</h1>
          </div>
        </header>
        <main className="flex-1 container flex flex-col items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verification {stepLabel}</CardTitle>
              <CardDescription>Processing your verification...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-4 text-center text-muted-foreground">Verifying your completion...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <p className="mt-4 text-center font-medium">{stepLabel} completed successfully!</p>
                  <p className="text-center text-muted-foreground">
                    {isLast ? "Redirecting to access key page..." : `Redirecting to next step...`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
