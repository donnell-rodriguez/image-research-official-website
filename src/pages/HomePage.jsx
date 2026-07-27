import { usePosts } from "../hooks/useContent";
import { LatestEventsSection, HomeVideoSection } from "./home/EventsSection";
import { HeroSection } from "./home/HeroSection";
import { HomeContactSection } from "./home/HomeContactSection";
import {
  PartnersSection,
  ProductsOverviewSection,
  ProjectsSection,
  SolutionStepsSection,
  SummarySection,
} from "./home/ProductSections";
import { ServicesSection } from "./home/ServicesSection";

export function HomePage() {
  const { data: posts } = usePosts();

  return (
    <>
      <HeroSection />
      <LatestEventsSection posts={posts} />
      <HomeVideoSection />
      <ServicesSection />
      <ProjectsSection />
      <SolutionStepsSection />
      <ProductsOverviewSection />
      <SummarySection />
      <PartnersSection />
      <HomeContactSection />
    </>
  );
}
