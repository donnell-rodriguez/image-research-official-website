export function getPostImageAlt(post, fallback = "Advantage Data Vision newsroom image") {
  if (!post?.featuredImage) return "Advantage Data Vision logo";
  return `${post.title} image`;
}

export function getArticleInlineImageAlt(post, index) {
  const title = post?.title || "Advantage Data Vision newsroom article";
  return `${title} supporting image ${index + 1}`;
}
