import { Link } from "@tanstack/react-router";
import { contactDetails } from "../data/site";
import { Icon } from "./Icon";
import { getPostImageAlt } from "../lib/imageAlt";

export function Sidebar({ posts = [], currentSlug }) {
  const recent = posts.filter((post) => post.slug !== currentSlug).slice(0, 5);

  return (
    <aside className="sidebar" aria-label="Blog sidebar">
      <section className="sidebar-widget">
        <h2>Search</h2>
        <div className="search-box">
          <span>Search …</span>
          <Icon name="search" size={18} />
        </div>
      </section>
      <section className="sidebar-widget">
        <h2>Recent Posts</h2>
        <div className="recent-list">
          {recent.map((post) => (
            <Link key={post.id} to={post.path}>
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={getPostImageAlt(post)}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span>{post.title}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="sidebar-widget">
        <h2>Categories</h2>
        <Link to="/newsroom/" className="category-link">EVENTS</Link>
      </section>
      <section className="sidebar-widget contact-widget">
        <h2>Contact</h2>
        <p>{contactDetails.address}</p>
        <p>{contactDetails.phone}</p>
        <p>{contactDetails.email}</p>
      </section>
    </aside>
  );
}
