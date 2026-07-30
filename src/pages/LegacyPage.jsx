import { Navigate, useParams } from "@tanstack/react-router";
import { InnerPageHero } from "../components/InnerPageHero";
import { PageHero } from "../components/PageHero";
import { LoadingPage, NotFound } from "../components/SystemPages";
import { siteTagline } from "../data/site";
import { usePage, usePost } from "../hooks/useContent";
import { useSeo } from "../hooks/useSeo";
import { BlogPage } from "./BlogPage";
import { HomePage } from "./HomePage";
import { PostPage } from "./PostPage";

const legacyPostRedirects = {
  "aliquam-erat-volutpat": "/team-hiking-retreat-sai-kung-december-2024",
  "aliquam-id-dolor": "/technical-exchange-guangzhou-pharmaceutical-university-sun-yat-sen-cancer-center",
  "quis-autem-vel-eum-iure": "/biohk-2024-ai-powered-liver-cancer-treatment-solution",
  "etiam-bibendum-elit-eget-erat": "/clinical-adoption-cuhk-shenzhen-affiliated-hospital",
  "lorem-ipsum-dolor-sit-amet": "/ascend-ai-innovation-competition-2023-huawei-ecosystem-award",
};

export function LegacyPage() {
  const params = useParams({ strict: false });
  const legacyRedirect = legacyPostRedirects[params.slug];
  if (legacyRedirect) return <Navigate to={legacyRedirect} replace />;

  const shouldLoadPage = params.slug !== "home" && params.slug !== "blog" && params.slug !== "newsroom";
  const { data: page, isLoading } = usePage(shouldLoadPage ? params.slug : null);
  const { data: post, isLoading: isPostLoading } = usePost(shouldLoadPage ? params.slug : null);
  const isPublications = page?.slug === "publications" || params.slug === "publications";
  const legalHeroSlugs = new Set(["privacy-policy", "terms-of-use", "legal", "site-map"]);
  const isLegalPage = Boolean(page && (legalHeroSlugs.has(page.slug) || legalHeroSlugs.has(params.slug)));
  const legacyDescriptions = {
    publications:
      "Explore Advantage Data Vision granted patents and research updates supporting medical AI, precision oncology, and secure clinical data exchange.",
    "privacy-policy": "Read the Advantage Data Vision privacy policy for website visitors and business enquiries.",
    "terms-of-use": "Review the Advantage Data Vision website terms of use.",
    legal: "Review legal information for Advantage Data Vision website visitors and partners.",
    "site-map": "Browse the Advantage Data Vision website sitemap and key routes.",
  };

  useSeo({
    title: page ? (isPublications ? "Granted Patents" : page.title) : "Advantage Data Vision",
    description: page ? legacyDescriptions[page.slug] || siteTagline : siteTagline,
    path: page?.path || `/${params.slug || ""}`,
  });

  if (params.slug === "home") return <HomePage />;
  if (params.slug === "blog" || params.slug === "newsroom") return <BlogPage />;
  if (isLoading || (!page && isPostLoading)) return <LoadingPage />;
  if (!page && post) return <PostPage />;
  if (!page) return <NotFound />;

  return (
    <>
      {page.kind !== "home-variant" && (
        isPublications ? (
          <InnerPageHero
            eyebrow="ADV Publications"
            title="Granted Patents"
            text="Explore ADV intellectual property and research updates supporting AI-driven clinical decision support, precision oncology workflows, and secure medical data exchange."
            variant="publications"
          />
        ) : isLegalPage ? (
          <InnerPageHero
            eyebrow="Advantage Data Vision"
            title={page.title}
            text={siteTagline}
            variant="news"
          />
        ) : (
          <PageHero eyebrow="Advantage Data Vision" title={page.title} text={siteTagline} />
        )
      )}
      <section className={page.kind === "home-variant" ? "template-shell template-shell-full" : "section template-shell"}>
        <article className="article-page content-main">
          {page.html ? (
            <div className="rich-content imported-content" dangerouslySetInnerHTML={{ __html: page.html }} />
          ) : (
            <p className="empty-copy">This imported page did not contain published body content.</p>
          )}
        </article>
      </section>
    </>
  );
}
