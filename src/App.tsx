import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TranslationProvider } from "@/lib/translation-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BackToTop } from "@/components/BackToTop";
import { BackButton } from "@/components/BackButton";
import { RouteProgress } from "@/components/RouteProgress";
import { ExternalLinkMonetag } from "@/components/ExternalLinkMonetag";
import { EngagementTracker } from "@/components/EngagementTracker";

// Index is the landing page — keep it eager so first paint is instant.
import Index from "./pages/Index";

// Content routes (code-split).
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Scripts = lazy(() => import("./pages/Scripts"));
const ScriptDetail = lazy(() => import("./pages/ScriptDetail"));
const GameLanding = lazy(() => import("./pages/GameLanding"));
const Executors = lazy(() => import("./pages/Executors"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const Docs = lazy(() => import("./pages/Docs"));
const Guides = lazy(() => import("./pages/Guides"));
const Changelog = lazy(() => import("./pages/Changelog"));
const AntiCheatGuide = lazy(() => import("./pages/AntiCheatGuide"));
const FairUse = lazy(() => import("./pages/FairUse"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

// Admin (owner-only, noindex — for managing script content).
const Login = lazy(() => import("./pages/Login"));
const ScriptAdmin = lazy(() => import("./pages/ScriptAdmin"));
const Admin = lazy(() => import("./pages/Admin"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteProgress />
              <EngagementTracker />
              <ExternalLinkMonetag />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/scripts" element={<Scripts />} />
                  <Route path="/scripts/:slug" element={<ScriptDetail />} />
                  <Route path="/games/:game" element={<GameLanding />} />
                  <Route path="/executors" element={<Executors />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/anti-cheat-guide" element={<AntiCheatGuide />} />
                  <Route path="/fair-use" element={<FairUse />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  {/* Owner-only admin (noindex, not linked in nav) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/scripts" element={<ScriptAdmin />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <BackToTop />
              <BackButton />
            </BrowserRouter>
          </MotionConfig>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
