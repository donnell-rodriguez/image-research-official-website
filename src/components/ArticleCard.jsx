import { Link } from "@tanstack/react-router";
import { formatDate } from "../lib/date";
import { getPostImageAlt } from "../lib/imageAlt";
import { Icon } from "./Icon";

export function ArticleCard({ post }) {
  const imageClassName = post.imageFit === "contain" ? "article-card-image-contained" : "";

  return (
    <article className="article-card">
      {post.featuredImage ? (
        <img
          className={imageClassName}
          src={post.featuredImage}
          alt={getPostImageAlt(post)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="image-fallback" />
      )}
      <div className="article-card-body">
        <time dateTime={post.date}>
          <Icon name="calendar" size={15} /> {formatDate(post.date)}
        </time>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <Link to={post.path} className="text-link">
          Learn More <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
