export function Feature({ icon, title, children }) {
  return (
    <article className="feature-item">
      <span className="feature-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
