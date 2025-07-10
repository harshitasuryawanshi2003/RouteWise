import React, { useState } from 'react';
import { MapPin, MessageSquare } from 'lucide-react';

const ReportForm = ({ bins, onSubmit }) => {
  const [formData, setFormData] = useState({
    binId: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.binId) newErrors.binId = 'Please select a bin location';
    if (!formData.message.trim()) {
      newErrors.message = 'Please describe the issue';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedBin = bins.find(bin => bin._id === formData.binId);
      if (!selectedBin) {
        alert("Invalid bin selected.");
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      if (!userId) {
        alert("User not logged in. Please log in again.");
        return;
      }

      await onSubmit({
        binId: formData.binId,
        reportedBy: userId,
        message: formData.message
      });

      // Reset form
      setFormData({
        binId: '',
        message: ''
      });
    } catch (error) {
      console.error("Report submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-100">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bin Selection */}
          <div>
            <label htmlFor="binId" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Select Bin Location
            </label>
            <select
              id="binId"
              name="binId"
              value={formData.binId}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.binId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a bin location...</option>
              {bins.map((bin) => (
                <option key={bin._id} value={bin._id}>
                  {bin.location.name} ({bin.type})
                </option>
              ))}
            </select>
            {errors.binId && <p className="mt-1 text-sm text-red-600">{errors.binId}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Describe the Issue
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Please provide details about the issue you're reporting..."
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            <p className="mt-1 text-sm text-gray-500">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting Report...</span>
              </div>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;

