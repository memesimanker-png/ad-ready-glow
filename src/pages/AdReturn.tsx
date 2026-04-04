import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function AdReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const step = searchParams.get("step") || localStorage.getItem("verification_step") || "step1";

    localStorage.setItem(`${step}_completed`, "true");
    localStorage.removeItem("verification_step");

    const stepNum = step.replace("step", "");
    toast({
      title: "Verification Successful",
      description: step === "step3"
        ? "All verification steps have been completed successfully!"
        : `Step ${stepNum} has been completed successfully.`,
    });

    setIsLoading(false);

    setTimeout(() => {
      if (step === "step1") navigate("/verify/step2");
      else if (step === "step2") navigate("/verify/step3");
      else if (step === "step3") navigate("/access-key");
      else navigate("/verify/provider-select");
    }, 1500);
  }, [navigate, toast, searchParams]);

  return (
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
            <CardTitle>Verification</CardTitle>
            <CardDescription>Processing your verification...</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                <p className="mt-4 text-center text-muted-foreground">Verifying your completion...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="mt-4 text-center font-medium">Step completed successfully!</p>
                <p className="text-center text-muted-foreground">Redirecting to next step...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
