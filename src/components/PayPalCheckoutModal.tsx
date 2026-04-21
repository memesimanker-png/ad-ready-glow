import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { X, Loader2, CheckCircle, Zap, Lock, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/translation-context";

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: {
    id: string;
    name: string;
    price: number;
    isSubscription?: boolean;
    subscriptionPrice?: number;
  };
  paypalClientId: string;
}

export function PayPalCheckoutModal({ isOpen, onClose, tier, paypalClientId }: PayPalCheckoutModalProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<{ key: string; expires_at: string } | null>(null);
  // No tabs anymore — for subscription tiers we default to auto-renew (the highlighted offer)
  // and let users pick "one-time" via a card click. State drives the PayPal button rendered.
  const [paymentType, setPaymentType] = useState<"onetime" | "subscription">(
    tier.isSubscription ? "subscription" : "onetime"
  );
  const [planId, setPlanId] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setProcessing(false);
      setSuccess(null);
      setPlanId(null);
      setPaymentType(tier.isSubscription ? "subscription" : "onetime");
    }
  }, [isOpen, tier]);

  useEffect(() => {
    if (!isOpen || paymentType !== "subscription" || !tier.isSubscription) return;
    const price = tier.subscriptionPrice || tier.price;
    setLoadingPlan(true);
    supabase.functions.invoke("paypal-create-subscription", { body: { amount: price } })
      .then(({ data, error: fnError }) => {
        if (fnError || !data?.plan_id) {
          setError("Failed to load subscription plan. Please try again.");
        } else {
          setPlanId(data.plan_id);
        }
      })
      .finally(() => setLoadingPlan(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, paymentType, tier.id, tier.subscriptionPrice, tier.price]);

  if (!isOpen) return null;

  const isSubscription = paymentType === "subscription" && tier.isSubscription;
  const displayPrice = isSubscription ? (tier.subscriptionPrice || tier.price) : tier.price;

  const createOrderHandler = async () => {
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("paypal-create-order", {
        body: { amount: displayPrice, tier: tier.id, description: `${tier.name} Premium Key` },
      });
      if (fnError || !data?.order_id) throw new Error("Failed to create order");
      return data.order_id;
    } catch (err: any) {
      setError(err.message || t("modal_generic_error"));
      throw err;
    }
  };

  const createSubscriptionHandler = async (_data: any, actions: any) => {
    if (!planId) throw new Error("Plan not loaded");
    return actions.subscription.create({ plan_id: planId });
  };

  const captureHandler = async (data: any) => {
    setProcessing(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;

      if (isSubscription) {
        const { data: result, error: fnError } = await supabase.functions.invoke(
          "paypal-activate-subscription",
          {
            body: {
              subscription_id: data.subscriptionID,
              tier: "monthly",
              amount: displayPrice,
              customer_email: user?.email || null,
              user_id: user?.id || null,
            },
          }
        );
        if (fnError) throw new Error("Subscription activation failed");
        setSuccess({ key: result.key, expires_at: result.expires_at });
      } else {
        const { data: result, error: fnError } = await supabase.functions.invoke(
          "paypal-capture-order",
          {
            body: {
              order_id: data.orderID,
              tier: tier.id,
              amount: displayPrice,
              customer_email: user?.email || null,
              user_id: user?.id || null,
            },
          }
        );
        if (fnError) throw new Error("Payment capture failed");
        setSuccess({ key: result.key, expires_at: result.expires_at });
      }
    } catch {
      setError(t("modal_capture_error"));
    } finally {
      setProcessing(false);
    }
  };

  const copyKey = () => {
    if (success?.key) navigator.clipboard.writeText(success.key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
              <h2 className="font-heading text-xl font-bold mb-2">{t("Payment Successful!")}</h2>
              <p className="text-sm text-muted-foreground mb-6">{t("modal_key_generated")}</p>
              <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg mb-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2 font-medium">{t("Your License Key:")}</p>
                <code className="text-sm font-mono break-all font-semibold text-primary">{success.key}</code>
              </div>
              <button onClick={copyKey} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold mb-3 hover:bg-primary/90 transition-colors">
                {t("Copy Key")}
              </button>
              <p className="text-xs text-muted-foreground">{t("Expires:")} {new Date(success.expires_at).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("modal_key_saved_dashboard")}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="font-heading text-xl font-bold">{tier.name}</h2>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1" data-no-translate>
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-bold text-lg">${displayPrice}</span>
                  <span className="text-muted-foreground text-sm">{isSubscription ? t("/month") : t(" one-time")}</span>
                </div>
              </div>

              {tier.isSubscription && (
                <div className="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-3" data-no-translate>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">{t("Choose payment")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType("onetime")}
                      className={`rounded-lg p-2.5 text-left transition-all ${paymentType === "onetime" ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary/60 hover:bg-secondary"}`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("One-Time")}</div>
                      <div className="text-base font-bold">${tier.price}<span className="text-[11px] font-normal text-muted-foreground"> / {t("month")}</span></div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType("subscription")}
                      className={`rounded-lg p-2.5 text-left transition-all ${paymentType === "subscription" ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary/60 hover:bg-secondary"}`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-accent">{t("Auto-Renew")}</div>
                      <div className="text-base font-bold">${tier.subscriptionPrice}<span className="text-[11px] font-normal text-muted-foreground"> / {t("mo")}</span></div>
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-secondary/50 border border-border rounded-lg p-3 mb-5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("What you get")}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {t("Instant license key delivery")}</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {isSubscription ? t("Auto-renewal & priority support") : t("Full duration access")}</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" /> {t("Discord VIP access")}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-[10px] text-muted-foreground"><CreditCard className="w-3 h-3 text-primary" /> {t("Credit / Debit")}</div>
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-[10px] text-muted-foreground"><Lock className="w-3 h-3 text-primary" /> PayPal</div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 text-sm text-destructive text-center">{error}</div>
              )}

              {processing || loadingPlan ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">{processing ? t("Processing your payment...") : t("Loading payment options...")}</span>
                </div>
              ) : (
                <PayPalScriptProvider
                  key={`${paymentType}-${tier.id}-${displayPrice}`}
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: isSubscription ? "subscription" : "capture",
                    vault: isSubscription ? true : undefined,
                    components: "buttons",
                    "enable-funding": "card",
                    "disable-funding": "paylater",
                  }}
                >
                  {isSubscription ? (
                    <PayPalButtons
                      style={{ layout: "vertical", shape: "rect", label: "subscribe", color: "gold", height: 45 }}
                      createSubscription={createSubscriptionHandler}
                      onApprove={captureHandler}
                      onError={() => setError(t("Payment failed. Please try again."))}
                      onCancel={() => setError(null)}
                    />
                  ) : (
                    <>
                      <PayPalButtons
                        fundingSource={FUNDING.PAYPAL}
                        style={{ layout: "vertical", shape: "rect", label: "pay", color: "gold", height: 45 }}
                        createOrder={createOrderHandler}
                        onApprove={captureHandler}
                        onError={() => setError(t("Payment failed. Please try again."))}
                        onCancel={() => setError(null)}
                      />
                      <PayPalButtons
                        fundingSource={FUNDING.CARD}
                        style={{ layout: "vertical", shape: "rect", height: 45 }}
                        createOrder={createOrderHandler}
                        onApprove={captureHandler}
                        onError={() => setError(t("Payment failed. Please try again."))}
                        onCancel={() => setError(null)}
                      />
                    </>
                  )}
                </PayPalScriptProvider>
              )}

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground">
                <Lock className="w-3 h-3" /> {t("Secure payment powered by PayPal")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
