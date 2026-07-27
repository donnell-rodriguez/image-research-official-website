import { ArticleCard } from "../../components/ArticleCard";
import { siteImages } from "../../data/site";

export function LatestEventsSection({ posts }) {
  const latest = posts.slice(0, 3);

  return (
    <section className="section latest-section" id="events">
      <div className="section-heading">
        <h2>Latest Events</h2>
        <p>
          We’re excited to share our latest company news with you. If you’re
          interested in partnering with us, just drop us an email — we’re
          always here to help.
        </p>
      </div>
      <div className="card-grid three">
        {latest.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export function HomeVideoSection() {
  return (
    <section className="home-video-section" aria-label="Advantage Data Vision video">
      <div className="home-video-frame">
        <video
          src={siteImages.demo}
          controls
          preload="none"
          poster={siteImages.demoPoster}
          playsInline
        />
      </div>
    </section>
  );
}
