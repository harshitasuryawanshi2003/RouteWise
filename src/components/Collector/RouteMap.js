import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ tasks, from, polyline }) => {
  const center = from?.location.coordinates
    ? [from.location.coordinates.lat, from.location.coordinates.lng]
    :[21.1458, 79.0882]; // default fallback->Nagpur,India

  const createIcon = (fillLevel) => {
    let color = '#10B981'; // green
    if (fillLevel >= 70) color = '#EF4444'; // red
    else if (fillLevel >= 40) color = '#F59E0B'; // orange

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid #fff;">B</div>`,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900">Optimized Collection Route</h3>
      </div>

      <div style={{ height: '600px' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Draw optimized polyline */}
          {polyline && (
            <Polyline
              positions={polyline.map(([lng, lat]) => [lat, lng])}
              pathOptions={{ color: 'blue', weight: 5 }}
            />
          )}

          {/* Depot Marker */}
          {from && (
            <Marker
              position={[from.location.coordinates.lat, from.location.coordinates.lng]}
              icon={L.divIcon({
                html: `<div style="background-color: #2563EB; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid #fff;">D</div>`,
                className: 'depot-icon',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
              })}
            >
              <Popup>
                <strong>Depot:</strong> {from.location.name}
              </Popup>
            </Marker>
          )}

          {/* Bin Markers */}
          {tasks.map((bin) => (
            <Marker
              key={bin.id}
              position={[bin.lat, bin.lng]}
              icon={createIcon(bin.fillLevel)}
            >
              <Popup>
                <strong>{bin.placename}</strong><br />
                Fill Level: {bin.fillLevel}%
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
