import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "@/lib/scripts-data";
import { useSearchScripts } from "@/hooks/useScripts";
import { ScriptCard } from "@/components/ScriptCard";
import { Layout } from "@/components/Layout";
import { DirectLinkOverlay } from "@/components/DirectLinkOverlay";

const POPUNDER_ZONE = 10877295;
const POPUNDER_SESSION_KEY = "combowick-popunder-scripts";

export default function Scripts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  // Fire popunder once per session
  useEffect(() => {
    if (sessionStorage.getItem(POPUNDER_SESSION_KEY)) return;
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.dataset.zone = String(POPUNDER_ZONE);
    s.async = true;
    document.body.appendChild(s);
    sessionStorage.setItem(POPUNDER_SESSION_KEY, "1");
    return () => { document.body.removeChild(s); };
  }, []);

  const { data: results = [], isLoading } = useSearchScripts(query, category);

  const handleSearch = (q: string) => {
    setQuery(q);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "All") params.set("category", category);
    setSearchParams(params, { replace: true });
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (cat !== "All") params.set("category", cat);
    setSearchParams(params, { replace: true });
  };

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading" style={{ textWrap: "balance" as any }}>
            Free Roblox Scripts
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse verified Roblox scripts by COMBO_WICK. Copy and execute instantly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Filter by Category</span>
              </div>
              <ul className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        category === cat
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search scripts, games, or tags..."
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {isLoading ? "Loading..." : `${results.length} script${results.length !== 1 ? "s" : ""} found`}
              {query && <span> for &ldquo;{query}&rdquo;</span>}
              {category !== "All" && <span> in {category}</span>}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground text-lg font-medium">No scripts found</p>
                <p className="text-muted-foreground text-sm mt-2">Try a different search term or category.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                    setSearchParams({});
                  }}
                  className="mt-4 text-primary text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </Layout>
  );
}
