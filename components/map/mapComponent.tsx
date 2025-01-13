import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

export default function MapComponent({ onLocationSelect, initialLocation }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const customIcon = L.icon({
    iconUrl: "https://res.cloudinary.com/dlinkc1gw/image/upload/v1736740165/location-pin_oqujbl.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([30.7652305, 76.7846207], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        leafletMap.current
      );

      leafletMap.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]); 
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMap.current);
        }
      });
    }

    if (initialLocation && leafletMap.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([initialLocation.lat, initialLocation.lng]);
      } else {
        markerRef.current = L.marker([initialLocation.lat, initialLocation.lng], { icon: customIcon }).addTo(leafletMap.current);
      }
      leafletMap.current.setView([initialLocation.lat, initialLocation.lng], 17);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.off();
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [onLocationSelect, initialLocation]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
}
