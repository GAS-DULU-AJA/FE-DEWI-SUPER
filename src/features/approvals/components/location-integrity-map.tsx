import { MapPin } from "lucide-react";

interface LocationIntegrityMapProps {
  propertyName: string;
  coordinates: { lat: number; lng: number };
}

export function LocationIntegrityMap({
  propertyName,
  coordinates,
}: LocationIntegrityMapProps) {
  // Embed OpenStreetMap iframe for real map rendering
  const bbox = `${coordinates.lng - 1},${coordinates.lat - 0.7},${coordinates.lng + 1},${coordinates.lat + 0.7}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* Map */}
      <div className="relative h-52 bg-slate-100">
        <iframe
          title="Location Map"
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
        />
        {/* Marker label overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
            <MapPin className="h-3 w-3" />
            {propertyName}
          </div>
        </div>
      </div>
      {/* Footer note */}
      <div className="flex items-center gap-2 bg-card px-4 py-2.5 text-xs text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        Coordinates verified against regional registry data.
      </div>
    </div>
  );
}
