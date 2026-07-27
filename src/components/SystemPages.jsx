import { Link } from "@tanstack/react-router";

export function LoadingPage() {
  return (
    <section className="section not-found">
      <h1>Loading</h1>
      <p>Preparing migrated website content.</p>
    </section>
  );
}

export function NotFound() {
  return (
    <section className="section not-found">
      <h1>Page not found</h1>
      <p>The requested page is not in the migrated site map.</p>
      <Link to="/" className="button button-primary">Back Home</Link>
    </section>
  );
}
