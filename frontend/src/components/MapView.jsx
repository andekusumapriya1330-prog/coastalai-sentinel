import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const RISK_COLOR = { high: "#FB7185", moderate: "#F5A524", low: "#5EEAD4" };

export default function MapView({ regions, onSelect, selectedId }) {
  const center = regions.length
    ? [regions[0].lat, regions[0].lng]
    : [18.5, 84.0];

  return (
    <div className="rounded-lg overflow-hidden border border-line h-full">
      <MapContainer center={center} zoom={6} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {regions.map((r) => (
          <CircleMarker
            key={r.id}
            center={[r.lat, r.lng]}
            radius={r.id === selectedId ? 14 : 10}
            pathOptions={{
              color: RISK_COLOR[r.riskLevel] || "#22D3EE",
              fillColor: RISK_COLOR[r.riskLevel] || "#22D3EE",
              fillOpacity: 0.55,
              weight: r.id === selectedId ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect?.(r.id) }}
          >
            <Popup>
              <div className="font-mono text-xs">
                <div className="font-semibold">{r.name}</div>
                <div>Risk: {r.riskLevel}</div>
                <div>Erosion rate: {r.lastErosionRateM} m/yr</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
