import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditBinModal = ({ bin, onClose, onSave, existingBins }) => {
  const [formData, setFormData] = useState({
    placename: bin.location?.name || '',
    type: bin.type,
    fill: bin.fill.toString(),
    status: bin.status,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.placename.trim()) newErrors.placename = 'Place name is required';
    if (!formData.type) newErrors.type = 'Type is required';

    if (formData.type === 'depot' && bin.type !== 'depot') {
      const existingDepot = existingBins.find((b) => b.type === 'depot' && b._id !== bin._id);
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
      onSave({
        ...bin,
        location: {
          ...bin.location,
          name: formData.placename,
        },
        type: formData.type,
        fill: parseInt(formData.fill),
        status: formData.status,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Bin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Place Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Place Name</label>
            <input
              name="placename"
              value={formData.placename}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.placename ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter place name"
            />
            {errors.placename && <p className="text-red-500 text-sm mt-1">{errors.placename}</p>}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="text"
                value={bin.location?.coordinates?.lat?.toFixed(6)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="text"
                value={bin.location?.coordinates?.lng?.toFixed(6)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
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
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          {/* Fill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fill (%)</label>
            <input
              name="fill"
              type="number"
              min="0"
              max="100"
              value={formData.fill}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.fill ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fill && <p className="text-red-500 text-sm mt-1">{errors.fill}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBinModal;
