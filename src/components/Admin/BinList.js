import React, { useEffect, useState } from 'react';
import axios from '../../apis/axios'; 
import EditBinModal from './EditBinModal';
import { Pencil, Trash2, Building2 } from 'lucide-react';

const BinList = () => {
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchBins = async () => {
    try {
      const response = await axios.get('/bins');
      setBins(response.data.data);
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleEditClick = (bin) => {
    setSelectedBin(bin);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      try {
        await axios.delete(`/bins/${id}`);
        fetchBins();
      } catch (error) {
        console.error('Error deleting bin:', error);
      }
    }
  };

  const handleSave = async (updatedBin) => {
    try {
      await axios.put(`/bins/${updatedBin._id}`, updatedBin);
      setShowEditModal(false);
      fetchBins();
    } catch (error) {
      console.error('Error updating bin:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Bins</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Place</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Fill %</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Lat</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Lng</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin._id} className="border-t border-gray-200">
                <td className="px-4 py-2">{bin.location?.name || '-'}</td>
                <td className="px-4 py-2">{bin.type}</td>
                <td className="px-4 py-2">{bin.fill}%</td>
                <td className="px-4 py-2">{bin.location?.coordinates?.lat?.toFixed(6)}</td>
                <td className="px-4 py-2">{bin.location?.coordinates?.lng?.toFixed(6)}</td>
                <td className="px-4 py-2 capitalize">{bin.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEditClick(bin)} className="text-blue-500 hover:text-blue-700">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(bin._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedBin && (
        <EditBinModal
          bin={selectedBin}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
          existingBins={bins}
        />
      )}
    </div>
  );
};

export default BinList;
