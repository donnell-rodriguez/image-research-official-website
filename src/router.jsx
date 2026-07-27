import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import { SiteLayout } from "./components/SiteLayout";
import { NotFound } from "./components/SystemPages";
import { HomePage } from "./pages/HomePage";

const rootRoute = createRootRoute({
  component: SiteLayout,
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about-us/",
  component: lazyRouteComponent(() => import("./pages/AboutPage"), "AboutPage"),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact/",
  component: lazyRouteComponent(() => import("./pages/ContactPage"), "ContactPage"),
});

const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career",
  component: lazyRouteComponent(() => import("./pages/CareerPage"), "CareerPage"),
});

const advRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/adv-medicare-limited/",
  component: lazyRouteComponent(() => import("./pages/AdvMedicarePage"), "AdvMedicarePage"),
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/",
  component: lazyRouteComponent(() => import("./pages/BlogPage"), "BlogPage"),
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$year/$month/$day/$slug/",
  component: lazyRouteComponent(() => import("./pages/PostPage"), "PostPage"),
});

const legacyCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$slug",
  component: lazyRouteComponent(() => import("./pages/LegacyPage"), "LegacyPage"),
});

const legacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$slug/",
  component: lazyRouteComponent(() => import("./pages/LegacyPage"), "LegacyPage"),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  contactRoute,
  careerRoute,
  advRoute,
  blogRoute,
  postRoute,
  legacyCanonicalRoute,
  legacyRoute,
]);

export const router = createRouter({ routeTree });
