import { useParams } from "@tanstack/react-router";
import { InnerPageHero } from "../components/InnerPageHero";
import { PageHero } from "../components/PageHero";
import { LoadingPage, NotFound } from "../components/SystemPages";
import { siteTagline } from "../data/site";
import { usePage, usePost } from "../hooks/useContent";
import { BlogPage } from "./BlogPage";
import { HomePage } from "./HomePage";
import { PostPage } from "./PostPage";

export function LegacyPage() {
  const params = useParams({ strict: false });
  const shouldLoadPage = params.slug !== "home" && params.slug !== "blog";
  const { data: page, isLoading } = usePage(shouldLoadPage ? params.slug : null);
  const { data: post, isLoading: isPostLoading } = usePost(shouldLoadPage ? params.slug : null);

  if (params.slug === "home") return <HomePage />;
  if (params.slug === "blog") return <BlogPage />;
  if (isLoading || (!page && isPostLoading)) return <LoadingPage />;
  if (!page && post) return <PostPage />;
  if (!page) return <NotFound />;

  const isPublications = page.slug === "publications" || params.slug === "publications";

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
