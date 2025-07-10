import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from '../../apis/axios'; 
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const BinMap = ({ onMapClick }) => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get('/bins');
        setBins(response.data.data || []); 
      } catch (error) {
        console.error('Error fetching bins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  const createBinIcon = (fill) => {
    let color = '#10B981'; // green
    if (fill >= 70) color = '#EF4444'; // red
    else if (fill >= 40) color = '#F59E0B'; // orange

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 10px;">B</div>`,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const createDepotIcon = () => {
    return L.divIcon({
      html: `<div style="background-color: #3B82F6; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px;">D</div>`,
      className: 'custom-div-icon',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  const center = bins.length > 0
    ? [
        bins[0]?.location?.coordinates?.lat || 22.9734,
        bins[0]?.location?.coordinates?.lng || 78.6569
      ]
    : [22.9734, 78.6569]; // Default to India center

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-600">
        Loading map...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Bin Locations</h3>
      </div>

      <div style={{ height: '500px' }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={onMapClick} />

          {bins.map((bin) => {
            const lat = bin.location?.coordinates?.lat;
            const lng = bin.location?.coordinates?.lng;

            if (lat == null || lng == null) return null;

            return (
              <Marker
                key={bin._id}
                position={[lat, lng]}
                icon={bin.type === 'depot' ? createDepotIcon() : createBinIcon(bin.fill)}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {bin.type === 'depot' ? 'Depot' : 'Bin'} - {bin.location?.name || 'Unknown'}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Type:</strong> {bin.type}</p>
                      <p><strong>Fill Level:</strong> {bin.fill}%</p>
                      <p><strong>Status:</strong> {bin.status}</p>
                      <p><strong>Location:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default BinMap;
