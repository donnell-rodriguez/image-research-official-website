import { createRootRoute, createRoute, createRouter, lazyRouteComponent, Navigate } from "@tanstack/react-router";
import { SiteLayout } from "./components/SiteLayout";
import { productPath } from "./data/site";
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

function AboutRedirect() {
  return <Navigate to="/about-us/" replace />;
}

const aboutCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about-us",
  component: AboutRedirect,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact/",
  component: lazyRouteComponent(() => import("./pages/ContactPage"), "ContactPage"),
});

function ContactRedirect() {
  return <Navigate to="/contact/" replace />;
}

const contactCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactRedirect,
});

const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career",
  component: lazyRouteComponent(() => import("./pages/CareerPage"), "CareerPage"),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: productPath,
  component: lazyRouteComponent(() => import("./pages/AdvMedicarePage"), "AdvMedicarePage"),
});

function LegacyProductRedirect() {
  return <Navigate to={productPath} replace />;
}

const legacyAdvRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/adv-medicare-limited/",
  component: LegacyProductRedirect,
});

const legacyAdvCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/adv-medicare-limited",
  component: LegacyProductRedirect,
});

const newsroomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/newsroom/",
  component: lazyRouteComponent(() => import("./pages/BlogPage"), "BlogPage"),
});

function NewsroomRedirect() {
  return <Navigate to="/newsroom/" replace />;
}

const newsroomCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/newsroom",
  component: NewsroomRedirect,
});

const legacyBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/",
  component: NewsroomRedirect,
});

const legacyBlogCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: NewsroomRedirect,
});

function HomeRedirect() {
  return <Navigate to="/" replace />;
}

const staleHomeFreeOneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-1/",
  component: HomeRedirect,
});

const staleHomeFreeOneCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-1",
  component: HomeRedirect,
});

const staleHomeFreeTwoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-2/",
  component: HomeRedirect,
});

const staleHomeFreeTwoCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-2",
  component: HomeRedirect,
});

const staleHomeFreeThreeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-3/",
  component: HomeRedirect,
});

const staleHomeFreeThreeCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-3",
  component: HomeRedirect,
});

const staleHomeFreeFourRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-4/",
  component: HomeRedirect,
});

const staleHomeFreeFourCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-free-4",
  component: HomeRedirect,
});

const staleCheckoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout-2/",
  component: HomeRedirect,
});

const staleCheckoutCanonicalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout-2",
  component: HomeRedirect,
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
  aboutCanonicalRoute,
  contactRoute,
  contactCanonicalRoute,
  careerRoute,
  productRoute,
  legacyAdvRoute,
  legacyAdvCanonicalRoute,
  newsroomRoute,
  newsroomCanonicalRoute,
  legacyBlogRoute,
  legacyBlogCanonicalRoute,
  staleHomeFreeOneRoute,
  staleHomeFreeOneCanonicalRoute,
  staleHomeFreeTwoRoute,
  staleHomeFreeTwoCanonicalRoute,
  staleHomeFreeThreeRoute,
  staleHomeFreeThreeCanonicalRoute,
  staleHomeFreeFourRoute,
  staleHomeFreeFourCanonicalRoute,
  staleCheckoutRoute,
  staleCheckoutCanonicalRoute,
  postRoute,
  legacyCanonicalRoute,
  legacyRoute,
]);

export const router = createRouter({ routeTree });
