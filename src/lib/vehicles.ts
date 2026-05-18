import { supabase } from "@/integrations/supabase/client";

export type Vehicle = {
  id: string;
  name: string;
  seater: number;
  daily_rent: number;
  per_km_rate: string | null;
  image_url: string | null;
  description: string | null;
};

/** Shown when Supabase is down or DB has no rows — matches seed migration defaults. */
export const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: "default-zest",
    name: "Tata Zest",
    seater: 4,
    daily_rent: 1300,
    per_km_rate: "₹12/km",
    image_url: "/v-zest.jpg",
    description: "Comfortable sedan ideal for city tours and small family trips.",
  },
  {
    id: "default-innova",
    name: "Toyota Innova",
    seater: 7,
    daily_rent: 1800,
    per_km_rate: "₹8/km",
    image_url: "/v-innova.jpg",
    description: "Premium 7-seater SUV for family and group travel.",
  },
  {
    id: "default-tempo-12",
    name: "Tempo Traveller 12",
    seater: 12,
    daily_rent: 3000,
    per_km_rate: "₹8/km",
    image_url: "/v-tempo.jpg",
    description: "Spacious 12-seater for medium groups and pilgrimages.",
  },
  {
    id: "default-tempo-10",
    name: "Tempo Traveller 10",
    seater: 10,
    daily_rent: 3000,
    per_km_rate: "₹8/km",
    image_url: "/v-tempo.jpg",
    description: "10-seater tempo traveller for comfortable group travel.",
  },
  {
    id: "default-tempo-17a",
    name: "Tempo Traveller 17 (A)",
    seater: 17,
    daily_rent: 3600,
    per_km_rate: "₹6/km",
    image_url: "/v-tempo.jpg",
    description: "Large 17-seater for big family groups and tours.",
  },
  {
    id: "default-tempo-17b",
    name: "Tempo Traveller 17 (B)",
    seater: 17,
    daily_rent: 3600,
    per_km_rate: "₹6/km",
    image_url: "/v-tempo.jpg",
    description: "Premium 17-seater with reclining seats.",
  },
];

export type FetchVehiclesResult = {
  vehicles: Vehicle[];
  fromFallback: boolean;
  error: string | null;
};

export async function fetchActiveVehicles(limit?: number): Promise<FetchVehiclesResult> {
  try {
    let query = supabase
      .from("vehicles")
      .select("id,name,seater,daily_rent,per_km_rate,image_url,description")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (limit != null) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.warn("vehicles fetch:", error.message);
      const fallback = limit != null ? DEFAULT_VEHICLES.slice(0, limit) : DEFAULT_VEHICLES;
      return { vehicles: fallback, fromFallback: true, error: error.message };
    }

    if (!data?.length) {
      const fallback = limit != null ? DEFAULT_VEHICLES.slice(0, limit) : DEFAULT_VEHICLES;
      return { vehicles: fallback, fromFallback: true, error: null };
    }

    return { vehicles: data, fromFallback: false, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load vehicles";
    console.warn("vehicles fetch failed:", message);
    const fallback = limit != null ? DEFAULT_VEHICLES.slice(0, limit) : DEFAULT_VEHICLES;
    return { vehicles: fallback, fromFallback: true, error: message };
  }
}
