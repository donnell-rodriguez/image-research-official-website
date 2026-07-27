import { Link } from "@tanstack/react-router";
import { InnerPageHero } from "../components/InnerPageHero";
import { siteImages } from "../data/site";
import { usePosts } from "../hooks/useContent";
import { formatDate } from "../lib/date";

const NEWS_LIMIT = 14;

function getLabel(index) {
  if (index === 3) return "Quick Read";
  if ([4, 5, 10, 11, 12, 13].includes(index)) return "Press Release";
  return "Update";
}

function NewsImage({ post, className = "" }) {
  const src = post.featuredImage || siteImages.logo;
  const imageClassName = post.featuredImage ? className : `${className} newsroom-logo-image`;

  return (
    <div className={`newsroom-image ${imageClassName}`}>
      <img src={src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

function NewsMeta({ post, index }) {
  return (
    <>
      <p className="newsroom-label">{getLabel(index)}</p>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
    </>
  );
}

function FeaturedArticle({ post }) {
  if (!post) return null;

  return (
    <Link to={post.path} className="newsroom-card newsroom-feature-card">
      <NewsImage post={post} className="newsroom-feature-image" />
      <div className="newsroom-feature-copy">
        <NewsMeta post={post} index={0} />
        <h2>{post.title}</h2>
      </div>
    </Link>
  );
}

function LeadArticle({ post, index }) {
  if (!post) return null;

  return (
    <Link to={post.path} className="newsroom-card newsroom-lead-card">
      <NewsImage post={post} />
      <div className="newsroom-card-copy">
        <NewsMeta post={post} index={index} />
        <h2>{post.title}</h2>
      </div>
    </Link>
  );
}

function TileArticle({ post, index }) {
  if (!post) return null;

  return (
    <Link to={post.path} className="newsroom-card newsroom-tile-card">
      <NewsImage post={post} />
      <div className="newsroom-card-copy">
        <NewsMeta post={post} index={index} />
        <h2>{post.title}</h2>
      </div>
    </Link>
  );
}

function CompactArticle({ post, index }) {
  if (!post) return null;

  return (
    <Link to={post.path} className="newsroom-compact-item">
      <NewsImage post={post} />
      <div className="newsroom-compact-copy">
        <NewsMeta post={post} index={index} />
        <h2>{post.title}</h2>
      </div>
    </Link>
  );
}

export function BlogPage() {
  const { data: posts } = usePosts();
  const newsPosts = posts.slice(0, NEWS_LIMIT);
  const [featuredPost, ...remainingPosts] = newsPosts;
  const leadPosts = remainingPosts.slice(0, 2);
  const tilePosts = remainingPosts.slice(2, 5);
  const compactPosts = remainingPosts.slice(5);

  return (
    <>
      <InnerPageHero
        eyebrow="ADV Newsroom"
        title="Latest News"
        text="Follow Advantage Data Vision updates across medical AI, clinical validation, events, awards, partnerships, and product progress."
        variant="news"
      />
      <main className="newsroom-page">
        <div className="newsroom-inner">
          <section className="newsroom-section" aria-label="Featured news">
            <FeaturedArticle post={featuredPost} />
          </section>

          <section className="newsroom-lead-grid" aria-label="Latest highlights">
            {leadPosts.map((post, index) => (
              <LeadArticle key={post.id} post={post} index={index + 1} />
            ))}
          </section>

          <section className="newsroom-tile-grid" aria-label="News cards">
            {tilePosts.map((post, index) => (
              <TileArticle key={post.id} post={post} index={index + 3} />
            ))}
          </section>

          <section className="newsroom-more" aria-label="More news">
            <h2>More from ADV Newsroom</h2>
            <div className="newsroom-compact-grid">
              {compactPosts.map((post, index) => (
                <CompactArticle key={post.id} post={post} index={index + 6} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
