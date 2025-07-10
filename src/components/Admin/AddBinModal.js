import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddBinModal = ({ onClose, onAdd, existingBins, selectedLocation }) => {
  const [formData, setFormData] = useState({
    placename: '',
    lat: '',
    lng: '',
    type: '',
    fill: '0',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedLocation) {
      setFormData(prev => ({
        ...prev,
        lat: selectedLocation.lat.toString(),
        lng: selectedLocation.lng.toString()
      }));
    }
  }, [selectedLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.placename.trim()) newErrors.placename = 'Place name is required';
    if (!formData.type) newErrors.type = 'Type is required';

    if (formData.type === 'depot') {
      const existingDepot = existingBins.find(bin => bin.type === 'depot');
      if (existingDepot) {
        newErrors.type = 'Only one depot is allowed. Delete existing depot first.';
      }
    }

    const fill = parseInt(formData.fill);
    if (isNaN(fill) || fill < 0 || fill > 100) {
      newErrors.fill = 'Fill level must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd({
        placename: formData.placename,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        type: formData.type,
        fill: parseInt(formData.fill),
        status: formData.status
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Bin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Place Name */}
          <div>
            <label htmlFor="placename" className="block text-sm font-medium text-gray-700 mb-2">Place Name</label>
            <input
              id="placename"
              name="placename"
              type="text"
              value={formData.placename}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.placename ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter place name"
            />
            {errors.placename && <p className="mt-1 text-sm text-red-600">{errors.placename}</p>}
          </div>

          {/* Coordinates (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                value={formData.lat}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Click on map"
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                value={formData.lng}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Click on map"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.type ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select type</option>
              <option value="depot">Depot</option>
              <option value="residential">Residential</option>
              <option value="school">School</option>
              <option value="hospital">Hospital</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office</option>
              <option value="public">Public</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Fill Level */}
          <div>
            <label htmlFor="fill" className="block text-sm font-medium text-gray-700 mb-2">Fill Level (%)</label>
            <input
              id="fill"
              name="fill"
              type="number"
              min="0"
              max="100"
              value={formData.fill}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fill ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.fill && <p className="mt-1 text-sm text-red-600">{errors.fill}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Bin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBinModal;
