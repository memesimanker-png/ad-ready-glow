import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import RobloxAccounts from "./pages/RobloxAccounts";
import PremiumKeys from "./pages/PremiumKeys";
import Oils from "./pages/Oils";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Scripts from "./pages/Scripts";
import Executors from "./pages/Executors";
import Keys from "./pages/Keys";
import Tutorials from "./pages/Tutorials";
import Docs from "./pages/Docs";
import Guides from "./pages/Guides";
import Changelog from "./pages/Changelog";
import AntiCheatGuide from "./pages/AntiCheatGuide";
import FairUse from "./pages/FairUse";
import FAQ from "./pages/FAQ";
import VerifyProviderSelect from "./pages/VerifyProviderSelect";
import VerifyStep1 from "./pages/VerifyStep1";
import VerifyStep2 from "./pages/VerifyStep2";
import VerifyStep3 from "./pages/VerifyStep3";
import AdReturn from "./pages/AdReturn";
import AccessKey from "./pages/AccessKey";
import Blocked from "./pages/Blocked";
import Register from "./pages/Register";
import ClaimAccess from "./pages/ClaimAccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { TranslationProvider } from "@/lib/translation-context";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/roblox-accounts" element={<RobloxAccounts />} />
          <Route path="/premium-keys" element={<PremiumKeys />} />
          <Route path="/oils" element={<Oils />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/executors" element={<Executors />} />
          <Route path="/keys" element={<Keys />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/anti-cheat-guide" element={<AntiCheatGuide />} />
          <Route path="/fair-use" element={<FairUse />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Key system flow */}
          <Route path="/verify/provider-select" element={<VerifyProviderSelect />} />
          <Route path="/verify/step1" element={<VerifyStep1 />} />
          <Route path="/verify/step2" element={<VerifyStep2 />} />
          <Route path="/verify/step3" element={<VerifyStep3 />} />
          <Route path="/ad-return" element={<AdReturn />} />
          <Route path="/ad-return/:step" element={<AdReturn />} />
          <Route path="/access-key" element={<AccessKey />} />
          <Route path="/blocked" element={<Blocked />} />
          <Route path="/register" element={<Register />} />
          <Route path="/claim-access" element={<ClaimAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
