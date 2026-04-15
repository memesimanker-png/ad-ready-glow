import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ChevronRight, TrendingUp } from "lucide-react";
import { useScriptBySlug, useRelatedScripts } from "@/hooks/useScripts";
import { Layout } from "@/components/Layout";
import { CopyButton } from "@/components/CopyButton";
import { ScriptCard } from "@/components/ScriptCard";
import { GameThumbnail } from "@/components/GameThumbnail";
import { isInCooldown, triggerDirectLink } from "@/lib/direct-link-gate";

const POPUNDER_ZONE = 10877295;
const POPUNDER_SESSION_KEY = "combowick-popunder-fired";

export default function ScriptDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: script, isLoading } = useScriptBySlug(slug);
  const { data: related = [] } = useRelatedScripts(
    script?.id || "",
    script?.game || "",
    script?.category || ""
  );

  // Fire popunder once per session on page load
  useEffect(() => {
    if (sessionStorage.getItem(POPUNDER_SESSION_KEY)) return;
    const script = document.createElement("script");
    script.src = `https://alwingulla.com/88/tag.min.js`;
    script.dataset.zone = String(POPUNDER_ZONE);
    script.async = true;
    document.body.appendChild(script);
    sessionStorage.setItem(POPUNDER_SESSION_KEY, "1");
    return () => { document.body.removeChild(script); };
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </main>
      </Layout>
    );
  }

  if (!script) {
    return (
      <Layout>
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Script Not Found</h1>
          <p className="text-muted-foreground mt-2">The script you're looking for doesn't exist.</p>
          <Link to="/scripts" className="text-primary text-sm mt-4 inline-block hover:underline">
            Browse all scripts
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/scripts" className="hover:text-primary transition-colors">Scripts</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="truncate max-w-xs">{script.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <article className="flex-1 min-w-0">
            <header className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <GameThumbnail gameName={script.game} universeId={(script as any).game_universe_id} size="lg" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {script.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {script.game}
                    </span>
                    {script.trending && (
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <TrendingUp className="h-3 w-3" /> Trending
                      </span>
                    )}
                    {script.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold font-heading" style={{ textWrap: "balance" as any }}>
                    {script.title}
                  </h1>
                </div>
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed">{script.longDescription || script.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>Added {script.createdAt}</span>
                <span>Updated {script.updatedAt}</span>
              </div>
            </header>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Script Code</h2>
                <CopyButton text={script.code} onBeforeCopy={() => {
                  if (!isInCooldown()) { triggerDirectLink(); }
                }} />
              </div>
              <div className="rounded-lg border border-border bg-secondary/50 p-4 overflow-x-auto">
                <pre className="text-sm text-muted-foreground whitespace-pre font-mono leading-relaxed">
                  {script.code}
                </pre>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {script.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/scripts?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>

            {script.faqs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {script.faqs.map((faq, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold mb-3">Script Info</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Game</dt><dd>{script.game}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd>{script.category}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Added</dt><dd>{script.createdAt}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Updated</dt><dd>{script.updatedAt}</dd></div>
                </dl>
              </div>

              <CopyButton text={script.code} className="w-full justify-center" onBeforeCopy={() => {
                if (!isInCooldown()) { triggerDirectLink(); }
              }} />

              {related.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold mb-4 text-primary">Related Scripts</h3>
                  <div className="space-y-4">
                    {related.map((s) => (
                      <Link
                        key={s.id}
                        to={`/scripts/${s.slug}`}
                        className="block rounded-lg border border-border bg-secondary/30 p-3 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <GameThumbnail gameName={s.game} universeId={(s as any).game_universe_id} size="sm" />
                          <span className="text-xs text-muted-foreground">{s.game}</span>
                          {s.verified && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-400/10 text-green-400 font-medium">Safe</span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold leading-snug mb-1">{s.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
