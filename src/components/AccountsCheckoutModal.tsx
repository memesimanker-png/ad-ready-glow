import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { X, Loader2, CheckCircle, Lock, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AccountsCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: { size: number; price: number; label: string };
  paypalClientId: string;
}

export function AccountsCheckoutModal({ isOpen, onClose, pkg, paypalClientId }: AccountsCheckoutModalProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<{ delivered: number } | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setProcessing(false);
      setSuccess(null);
      setNeedsAuth(false);
      supabase.auth.getUser().then(({ data }) => { if (!data.user) setNeedsAuth(true); });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const createOrderHandler = async () => {
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("paypal-create-order", {
        body: { amount: pkg.price, tier: `accounts-${pkg.size}`, description: `${pkg.size} Roblox Accounts` },
      });
      if (fnError || !data?.order_id) throw new Error("Failed to create order");
      return data.order_id;
    } catch (err: any) {
      setError(err.message || "Could not create order");
      throw err;
    }
  };

  const captureHandler = async (data: any) => {
    setProcessing(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setError("You must be signed in to receive accounts. Please sign in and retry.");
        setProcessing(false);
        return;
      }
      const { data: result, error: fnError } = await supabase.functions.invoke("paypal-capture-accounts", {
        body: { order_id: data.orderID, package_size: pkg.size, amount: pkg.price, user_id: user.id },
      });
      if (fnError || !result || result.error) throw new Error(result?.error || "Capture failed");
      setSuccess({ delivered: result.delivered });
    } catch (e: any) {
      setError(e.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary/40" />
        <div className="p-6">
          <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1.5 hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>

          {success ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="font-heading text-xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {success.delivered} accounts have been delivered to your dashboard.
              </p>
              <button onClick={() => { onClose(); navigate("/dashboard"); }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                View My Accounts
              </button>
            </div>
          ) : needsAuth ? (
            <div className="text-center py-6">
              <h2 className="font-heading text-xl font-bold mb-3">Sign in required</h2>
              <p className="text-sm text-muted-foreground mb-6">
                You must be signed in so we can deliver your accounts to your dashboard.
              </p>
              <button onClick={() => { onClose(); navigate("/login"); }} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="font-heading text-xl font-bold">{pkg.label} • {pkg.size} Accounts</h2>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                  <span className="text-primary font-bold text-lg">${pkg.price}</span>
                  <span className="text-muted-foreground text-sm">one-time</span>
                </div>
              </div>

              <div className="bg-secondary/50 border border-border rounded-lg p-3 mb-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">What you get</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {pkg.size} verified Roblox accounts</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> Instant delivery to your dashboard</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> PayPal buyer protection</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-[10px] text-muted-foreground"><CreditCard className="w-3 h-3 text-primary" /> Credit / Debit</div>
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-[10px] text-muted-foreground"><Lock className="w-3 h-3 text-primary" /> PayPal</div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 text-sm text-destructive text-center">{error}</div>
              )}

              {processing ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">Processing your payment & delivering accounts...</span>
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                    components: "buttons",
                    "enable-funding": "card",
                    "disable-funding": "paylater",
                  }}
                >
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={{ layout: "vertical", shape: "rect", label: "pay", color: "gold", height: 45 }}
                    createOrder={createOrderHandler}
                    onApprove={captureHandler}
                    onError={() => setError("Payment failed. Please try again.")}
                    onCancel={() => setError(null)}
                  />
                  <PayPalButtons
                    fundingSource={FUNDING.CARD}
                    style={{ layout: "vertical", shape: "rect", height: 45 }}
                    createOrder={createOrderHandler}
                    onApprove={captureHandler}
                    onError={() => setError("Payment failed. Please try again.")}
                    onCancel={() => setError(null)}
                  />
                </PayPalScriptProvider>
              )}

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground">
                <Lock className="w-3 h-3" /> Secure payment powered by PayPal
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
