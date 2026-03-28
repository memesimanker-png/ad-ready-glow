import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Shield, Lock, Eye, AlertTriangle, CheckCircle2, Key, TrendingUp, Gamepad2, Code, CreditCard } from "lucide-react";

const posts: Record<string, { title: string; category: string; date: string; readTime: string; content: React.ReactNode }> = {
  "roblox-account-security-guide": {
    title: "Complete Roblox Account Security Guide 2026",
    category: "Security",
    date: "January 20, 2026",
    readTime: "8 min read",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Protect your Roblox account with these essential security practices. With millions of active players and valuable virtual items at stake, account security has never been more important. This comprehensive guide covers everything from basic password hygiene to advanced protection strategies.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-3">
          <Lock className="h-7 w-7 text-primary" />
          1. Enable Two-Factor Authentication (2FA)
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Two-factor authentication is the single most important security feature you can enable on your Roblox account. It adds an extra verification step beyond your password, meaning even if someone obtains your password, they still can't access your account without the second factor.
        </p>
        <Card className="p-6 bg-glass mb-6">
          <h3 className="font-heading text-lg font-semibold mb-3">How to Enable 2FA:</h3>
          <ol className="space-y-2 text-muted-foreground text-sm">
            <li>1. Log in to your Roblox account on the official website (roblox.com)</li>
            <li>2. Navigate to Settings by clicking the gear icon</li>
            <li>3. Select the Security tab from the left menu</li>
            <li>4. Find "Two-Step Verification" and click to enable</li>
            <li>5. Choose your preferred method: Email verification or Authenticator App</li>
            <li>6. Follow the on-screen prompts to complete the setup</li>
            <li>7. Save your backup codes in a secure location for emergency access</li>
          </ol>
        </Card>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We strongly recommend using an authenticator app (Google Authenticator, Microsoft Authenticator, or Authy) over email-based 2FA. Authenticator apps generate time-based codes locally on your device, making them immune to email interception attacks.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-3">
          <Key className="h-7 w-7 text-primary" />
          2. Create a Strong, Unique Password
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Your password is the first line of defense against unauthorized access. Modern password-cracking tools can test billions of combinations per second, making weak passwords essentially useless. Here's how to create a password that actually protects you:
        </p>
        <Card className="p-6 bg-glass mb-8">
          <h3 className="font-heading text-lg font-semibold mb-3">Password Best Practices:</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>✓ Use at least 12 characters — 16 or more is ideal</li>
            <li>✓ Mix uppercase and lowercase letters randomly</li>
            <li>✓ Include numbers and special symbols (!@#$%^&*)</li>
            <li>✓ Make each password unique — never reuse across websites</li>
            <li>✓ Consider using a password manager (Bitwarden, 1Password, LastPass)</li>
            <li>✗ Avoid dictionary words, your name, birthday, or pet's name</li>
            <li>✗ Don't use patterns like "123456" or "qwerty"</li>
            <li>✗ Never share your password with anyone — not even friends</li>
          </ul>
        </Card>

        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-3">
          <Eye className="h-7 w-7 text-primary" />
          3. Recognize and Avoid Phishing Scams
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Phishing is when attackers create fake websites or messages that impersonate Roblox to trick you into revealing your login credentials. These scams have become increasingly sophisticated, often replicating the official Roblox website pixel-for-pixel.
        </p>
        <Card className="p-6 bg-destructive/10 border-destructive/30 mb-6">
          <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Common Phishing Tactics to Watch For:
          </h3>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li><strong>Free Robux Generators:</strong> Any website promising free Robux in exchange for your password is a scam. Roblox does not have external Robux generators.</li>
            <li><strong>Fake Login Pages:</strong> Always verify the URL is exactly roblox.com before entering credentials. Watch for misspellings like "rob1ox.com" or "roblox-free.com".</li>
            <li><strong>Impersonation Emails:</strong> Scammers send emails that look official. Always check the sender's address — legitimate Roblox emails come from @roblox.com only.</li>
            <li><strong>Discord/Social Media Scams:</strong> People claiming to be Roblox staff asking for your password or offering "admin access" are always scammers.</li>
            <li><strong>Malicious Browser Extensions:</strong> Some extensions claim to enhance Roblox but actually steal your session tokens and account data.</li>
          </ul>
        </Card>

        <h2 className="font-heading text-2xl font-bold mb-4">4. Additional Security Tips</h2>
        <ul className="space-y-3 text-muted-foreground text-sm mb-8">
          <li>• <strong>Enable Account PIN:</strong> Roblox offers a 4-digit PIN that must be entered before changing account settings, adding a barrier against unauthorized modifications.</li>
          <li>• <strong>Review Active Sessions:</strong> Regularly check Settings → Security to see all devices logged into your account. Remove any you don't recognize.</li>
          <li>• <strong>Keep Your Email Secure:</strong> Your email is the recovery method for your Roblox account. Ensure it also has 2FA enabled and a strong, unique password.</li>
          <li>• <strong>Be Cautious with Third-Party Sites:</strong> Only use official Roblox services. Third-party trading sites or "free" services often harvest account data.</li>
          <li>• <strong>Update Regularly:</strong> Keep your browser, operating system, and antivirus software up to date to protect against known vulnerabilities.</li>
        </ul>

        <Card className="p-6 bg-primary/5 border-primary/30">
          <h3 className="font-heading text-lg font-semibold mb-2">Summary</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Account security is an ongoing practice, not a one-time setup. Enable 2FA, use a strong unique password, stay vigilant against phishing, and regularly review your account's security settings. By following these steps, you'll significantly reduce the risk of unauthorized access to your Roblox account and protect your valuable virtual assets.
          </p>
        </Card>
      </>
    ),
  },
  "how-to-earn-robux-free": {
    title: "Legitimate Ways to Earn Free Robux in 2026",
    category: "Guides",
    date: "January 15, 2026",
    readTime: "7 min read",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Robux is the premium currency in Roblox, and while many players want more of it, the internet is filled with scam websites promising free Robux. This guide covers only legitimate, safe methods that actually work in 2026 — no generators, no surveys, no giving away your password.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">1. Roblox Premium Stipend</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          The most straightforward way to receive regular Robux is through Roblox Premium, the platform's official subscription service. Premium members receive a monthly Robux stipend: 450 Robux for the $4.99/month plan, 1,000 Robux for $9.99/month, and 2,200 Robux for $19.99/month. While this isn't technically "free," it provides guaranteed, predictable Robux income and additional benefits like marketplace access and a 10% bonus on Robux purchases.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">2. Create and Monetize Games</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Roblox's Developer Exchange (DevEx) program allows game creators to convert earned Robux into real money — but the reverse is also true: popular games earn Robux. When players purchase game passes, in-game items, or premium features in your game, you earn Robux. The commission rate is 70% for game pass sales. Some top Roblox developers earn millions annually, but even small games can generate meaningful amounts. Learning Roblox Studio and Lua scripting is a genuine investment in potential Robux earnings.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">3. Sell Items and Clothing</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          If you have a creative eye, you can design and sell clothing items (shirts, pants, t-shirts) on the Roblox marketplace. Premium members can upload and sell clothing designs, earning Robux from every sale. Successful clothing designers focus on trending styles, seasonal themes, and popular game-specific outfits. The marketplace is competitive, but unique, high-quality designs can generate steady income over time.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">4. Participate in Official Events</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Roblox regularly hosts events and promotions that reward participants with free items, badges, and sometimes Robux. Keep an eye on the official Roblox blog, social media channels, and in-game event banners. Events like the Bloxy Awards, seasonal celebrations, and brand partnerships often include free rewards for participation. While the Robux rewards from events are typically small, they add up over time.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">5. Microsoft Rewards Program</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Microsoft Rewards is a legitimate program that lets you earn points through Bing searches, quizzes, and other activities. These points can be redeemed for Roblox gift cards, which you can use to purchase Robux. It's completely free and safe — just time-consuming. Most users can earn enough points for a $5 Roblox gift card in about 2-3 weeks of regular activity.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">6. Affiliate Programs and Group Funds</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Roblox offers an affiliate program where you earn 5% of any Robux purchase made by a new user who signs up through your referral link. If you have a social media presence or YouTube channel focused on Roblox content, this can generate meaningful passive income. Additionally, if you're part of a Roblox group that earns Robux from group games or clothing, the group owner can distribute funds to members.
        </p>

        <Card className="p-6 bg-destructive/10 border-destructive/30 mb-6">
          <h3 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Scams to Avoid
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• <strong>"Free Robux Generator" websites</strong> — These are always scams designed to steal your password or personal information</li>
            <li>• <strong>Survey sites promising Robux</strong> — Most are data harvesting operations that never deliver</li>
            <li>• <strong>YouTube videos with "secret codes"</strong> — There are no secret Robux codes; these lead to phishing sites</li>
            <li>• <strong>Discord DMs offering free Robux</strong> — Anyone messaging you unsolicited about free Robux is a scammer</li>
            <li>• <strong>Browser extensions</strong> — No legitimate extension can generate Robux</li>
          </ul>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/30">
          <h3 className="font-heading text-lg font-semibold mb-2">The Bottom Line</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            There is no instant, effortless way to get free Robux. Every legitimate method requires either time, creativity, or a small investment. Focus on the methods above, stay away from anything that asks for your password, and remember: if it sounds too good to be true, it definitely is. Protect your account and build your Robux earnings through genuine effort.
          </p>
        </Card>
      </>
    ),
  },
  "roblox-trading-tips": {
    title: "Roblox Trading Guide: How to Profit Safely",
    category: "Trading",
    date: "January 12, 2026",
    readTime: "12 min read",
    content: (
      <>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Trading limited items on Roblox can be both exciting and profitable — if you know what you're doing. This comprehensive guide covers everything from understanding item values and market trends to avoiding common scams and building a sustainable trading strategy.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4 flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-primary" />
          Understanding Roblox Item Values
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Limited and limited-unique items form the backbone of Roblox trading. Limited items were originally sold in the Roblox catalog but are no longer available for direct purchase, making them tradeable between players. The value of a limited item depends on several factors: its original price, rarity (how many copies exist), demand among players, and its Recent Average Price (RAP). RAP is calculated based on the last few sales and provides a general benchmark, though actual trade values often differ from RAP based on current demand and market sentiment. Understanding the gap between RAP and actual value is key to profitable trading.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">Market Research Strategies</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Successful traders spend more time researching than trading. Track price histories of items you're interested in using community tools and trading forums. Join reputable Roblox trading Discord servers where experienced traders share insights and market analysis. Pay attention to broader Roblox trends — new game launches, events, and platform updates can all influence item demand. Build a watchlist of items and monitor their prices over weeks before making your first trade. Patience is the most valuable tool in a trader's toolkit.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">Safe Trading Practices</h2>
        <Card className="p-6 bg-glass mb-6">
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li>• <strong>Only use the official Roblox trading system</strong> — Never trade outside the platform, no matter what the other person promises</li>
            <li>• <strong>Verify item values independently</strong> — Don't take the other trader's word for an item's worth; check recent sales data yourself</li>
            <li>• <strong>Beware of "projected" items</strong> — Some traders claim items are "about to rise" to pressure you into unfavorable trades</li>
            <li>• <strong>Don't trade under pressure</strong> — Legitimate traders won't rush you; take time to verify every deal</li>
            <li>• <strong>Screenshot all trades</strong> — Keep records of every trade in case you need to report scams to Roblox support</li>
            <li>• <strong>Start small</strong> — Learn with lower-value items before committing significant Robux to trades</li>
          </ul>
        </Card>

        <h2 className="font-heading text-2xl font-bold mb-4">Common Scams to Avoid</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          The trading community, unfortunately, includes bad actors. Here are the most common scams you'll encounter:
        </p>
        <ul className="space-y-3 text-muted-foreground text-sm mb-8">
          <li>• <strong>The Switcheroo:</strong> A scammer shows you one item, then swaps it for a lower-value item at the last second before you confirm the trade. Always double-check every item in the trade window before confirming.</li>
          <li>• <strong>Fake Middlemen:</strong> Scammers pose as "trusted middlemen" for cross-trades. There is no safe way to do cross-trades; always use the official system.</li>
          <li>• <strong>Fake Value Claims:</strong> Someone insists their item is worth much more than its RAP suggests, citing "projected growth" or "inside information." Values are determined by actual sales, not speculation.</li>
          <li>• <strong>Trust Trading:</strong> Being asked to give items first "to prove you're trustworthy" before receiving anything in return. This is always a scam — use the simultaneous trade system.</li>
        </ul>

        <Card className="p-6 bg-primary/5 border-primary/30">
          <h3 className="font-heading text-lg font-semibold mb-2">Key Takeaway</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Profitable Roblox trading is a marathon, not a sprint. Focus on building knowledge, maintaining patience, and always prioritizing security over speed. The best traders are the most informed and most cautious — not the ones who take the biggest risks.
          </p>
        </Card>
      </>
    ),
  },
};

// Fallback for posts that don't have full content yet
const fallbackPost = {
  title: "Coming Soon",
  category: "General",
  date: "2026",
  readTime: "5 min read",
  content: (
    <p className="text-muted-foreground">This article is being written and will be published soon. Check back later for the full content!</p>
  ),
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug && posts[slug] ? posts[slug] : fallbackPost;

  return (
    <Layout>
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{post.category}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="prose-content">
            {post.content}
          </div>

          <div className="border-t border-border/50 mt-12 pt-8">
            <Card className="p-6 bg-primary/5 border-primary/30 text-center">
              <h3 className="font-heading text-xl font-bold mb-2">Looking for Verified Roblox Accounts?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ComboWick offers instant delivery of verified Roblox accounts starting at just $6 for 25 accounts.
              </p>
              <Link to="/">
                <Button>View Account Packages</Button>
              </Link>
            </Card>
          </div>
        </div>
      </article>
    </Layout>
  );
}
