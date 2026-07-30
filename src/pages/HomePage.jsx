import { usePosts } from "../hooks/useContent";
import { useSeo } from "../hooks/useSeo";
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
  useSeo({
    title: "AI Healthcare Decision Support",
    description:
      "Advantage Data Vision develops virtual patient simulation, personalized deep features, and real-world data search systems for precision oncology workflows.",
    path: "/",
  });

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
