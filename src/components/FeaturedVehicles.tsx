import Link from "next/link";
import Image from "next/image";
import { Gauge, Calendar, Star, ChevronsRight } from "lucide-react";
import { api } from "@/src/lib/api"; // ⚙️ nova versão do cliente para SSR

// 1. Interface para os dados do card
interface VehicleCardProps {
  slug: string;
  marca: string;
  modelo: string;
  anoModelo: number | null;
  preco: number;
  quilometragem: number | null;
  fotos: string[];
}

// 2. Função de busca de dados (Server-side)
async function getFeaturedVehicles(count: number) {
  try {
    // Chama o backend via Axios (no servidor)
    const res = await api.get(`/vehicles/featured?count=${count}`);
    return res.data;
  } catch (error) {
    console.error("❌ Falha ao buscar destaques:", error);
    return [];
  }
}

// 3. O Componente de Card (reutilizável)
function VehicleCard({ vehicle }: { vehicle: VehicleCardProps }) {
  return (
    <Link
      href={`/veiculo/${vehicle.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full">
        <Image
          src={vehicle.fotos[0]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform group-hover:scale-110"
        />
        <span className="absolute top-2 left-2 z-20 bg-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
          <Star size={14} className="text-white-300" />
          Novidade
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-blue-800">
          {vehicle.marca} {vehicle.modelo}
        </h3>

        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          {vehicle.anoModelo && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {vehicle.anoModelo}
            </span>
          )}
          {vehicle.quilometragem !== null && (
            <span className="flex items-center gap-1">
              <Gauge size={14} />
              {vehicle.quilometragem.toLocaleString("pt-BR")} KM
            </span>
          )}
        </div>

        <p className="mt-4 text-2xl font-bold text-blue-600">
          R${" "}
          {vehicle.preco.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <button
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-800  
                    text-white font-semibold py-2.5 shadow-md transition-all duration-300 
                    hover:from-blue-800  hover:to-blue-600 hover:scale-[1.02] active:scale-95
                    flex items-center justify-center gap-2"
        >
          Ver mais
          <ChevronsRight className="w-4 h-4 text-white-300" />
        </button>
      </div>
    </Link>
  );
}

// 4. O Componente Principal (Server Component)
export default async function FeaturedVehicles({ count = 6 }: { count?: number }) {
  const vehicles: VehicleCardProps[] = await getFeaturedVehicles(count);

  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Destaques do Estoque
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
