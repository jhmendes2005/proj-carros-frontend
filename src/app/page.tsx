import Hero from "@/src/components/hero";
import AdvancedSearch from "@/src/components/AdvancedSearch";
import FeaturedVehicles from "@/src/components/FeaturedVehicles";
import CategoryIcons from "@/src/components/CategoryIcons"; 
import FeaturesSection from "@/src/components/FeaturesSection"; 

export default function Home() {
  return (
    <main>
      {/* 1. Hero (Banner Principal) */}
      <Hero />

      {/* 2. Busca Avançada (Sobreposta ao Hero) */}
      <AdvancedSearch />

      {/* 4. Destaques Principais (Top 3) */}
      {/* Adicionamos 'pt-24' aqui para compensar a margem negativa da busca,
          garantindo que os carros não fiquem escondidos atrás dela. */}
      <div className="pt-24 bg-gray-50">
        <FeaturedVehicles count={3} />
      </div>

      {/* 3. Categorias */}
      <div className="bg-white border-y border-gray-100">
        <CategoryIcons />
      </div>

      {/* 4. Mais Destaques (6) */}
      <div className="bg-gray-50">
        <FeaturedVehicles count={6} />
      </div>
      
      {/* 5. Diferenciais */}
      <FeaturesSection />

    </main>
  );
}