import Hero from "../components/hero";
import AdvancedSearch from "../components/AdvancedSearch";
import FeaturedVehicles from "../components/FeaturedVehicles";
import CategoryIcons from "../components/CategoryIcons";
import FeaturesSection from "../components/FeaturesSection";
import ContactBanner from "../components/ContactBanner";
export default function Home() {
  return (
    <>
      <Hero />
      <AdvancedSearch />
      <FeaturedVehicles />
      <CategoryIcons />
      <FeaturesSection />
      <ContactBanner />
    </>
  );
}
