import React from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { footerLegalLinks, footerSections, navItems, productPath, siteImages } from "../data/site";
import { usePosts } from "../hooks/useContent";
import { useRevealAnimations, useSummaryMotion } from "../hooks/usePageEffects";
import { CookieConsent } from "./CookieConsent";
import { Icon } from "./Icon";

function isCurrentPostPath(post, pathname) {
  return (
    post.path === pathname ||
    pathname === `/${post.slug}` ||
    pathname === `/${post.slug}/` ||
    pathname.endsWith(`/${post.slug}/`) ||
    pathname.endsWith(`/${post.slug}`)
  );
}

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [headerScrolled, setHeaderScrolled] = React.useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isHome = pathname === "/" || pathname === "/home/";
  const normalizedPathname = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const hasHeroHeader =
    isHome ||
    [
      `${productPath}/`,
      "/newsroom/",
      "/career/",
      "/contact/",
      "/publications/",
    ].includes(normalizedPathname);
  const headerNavItems = isHome ? navItems.filter(([label]) => label !== "Home") : navItems;
  const { data: posts } = usePosts();
  const currentPost = posts.find((post) => isCurrentPostPath(post, pathname));

  React.useEffect(() => {
    const updateHeaderState = () => {
      setHeaderScrolled(window.scrollY > 18);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("nav-lock", menuOpen);
    return () => document.documentElement.classList.remove("nav-lock");
  }, [menuOpen]);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useRevealAnimations();
  useSummaryMotion(pathname);

  const shellClassName = [
    "site-shell",
    isHome ? "home-shell" : "",
    hasHeroHeader ? "hero-header-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClassName}>
      <header className={headerScrolled ? "site-header header-scrolled" : "site-header"}>
        <div className="site-header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Advantage Data Vision home"
            onClick={() => setMenuOpen(false)}
          >
            <img className="brand-logo" src={siteImages.logo} alt="ADV" decoding="async" />
            <span className="brand-text">Advantage Data Vision</span>
          </Link>
          <button
            className="icon-button menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
          </button>
          <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
            {headerNavItems.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "active" }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer currentPost={currentPost} />
      <CookieConsent />
    </div>
  );
}

function Footer({ currentPost }) {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-inner">
        <div className="footer-breadcrumb" aria-label="Footer breadcrumb">
          <Link to="/" className="footer-logo-link" aria-label="Advantage Data Vision home">
            <img src={siteImages.logo} alt="ADV" decoding="async" />
          </Link>
          <span className="footer-chevron" aria-hidden="true">
            ›
          </span>
          {currentPost ? (
            <>
              <Link to="/newsroom/">Newsroom</Link>
              <span className="footer-chevron" aria-hidden="true">
                ›
              </span>
              <span>{currentPost.title}</span>
            </>
          ) : (
            <span>Advantage Data Vision</span>
          )}
        </div>

        <nav className="footer-directory" aria-label="Footer directory">
          {footerSections.map((section) => (
            <section className="footer-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className="footer-legal">
          <p>Copyright © 2026 Adv Inc. All rights reserved.</p>
          <nav aria-label="Legal links">
            {footerLegalLinks.map((link) => (
              link.to ? (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              )
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
