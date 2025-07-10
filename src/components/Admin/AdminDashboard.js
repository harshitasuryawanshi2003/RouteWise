import React, { useState, useEffect } from 'react';
import {
  MapPin,
  FileText,
  LogOut,
  Building2
} from 'lucide-react';

import axios from '../../apis/axios';
import BinMap from './BinMap';
import BinList from './BinList';
import ReportsList from './ReportsList';
import AddBinModal from './AddBinModal';
import EditBinModal from './EditBinModal';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState([]);
  const [showAddBinModal, setShowAddBinModal] = useState(false);
  const [showEditBinModal, setShowEditBinModal] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Fetch all bins and reports from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const binRes = await axios.get('/bins');
        const reportRes = await axios.get('/reports');
        setBins(binRes.data.data);
        setReports(reportRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMapClick = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setShowAddBinModal(true);
  };

  const handleAddBin = async (newBin) => {
    try {
      const res = await axios.post('/bins/add', newBin);
      setBins(prev => [...prev, res.data.data]);
      setShowAddBinModal(false);
      setSelectedLocation(null);
    } catch (err) {
      console.error('Failed to add bin:', err);
    }
  };

  const handleEditBin = async (updatedBin) => {
    try {
      const res = await axios.put(`/bins/${updatedBin.id}`, updatedBin);
      setBins(prev => prev.map(bin => bin.id === updatedBin.id ? res.data : bin));
      setShowEditBinModal(false);
      setSelectedBin(null);
    } catch (err) {
      console.error('Failed to update bin:', err);
    }
  };

  const handleDeleteBin = async (binId) => {
    if (!window.confirm('Are you sure you want to delete this bin?')) return;
    try {
      await axios.delete(`/bins/${binId}`);
      setBins(prev => prev.filter(bin => bin.id !== binId));
    } catch (err) {
      console.error('Failed to delete bin:', err);
    }
  };

  const handleEditClick = (bin) => {
    setSelectedBin(bin);
    setShowEditBinModal(true);
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.patch(`/reports/${reportId}`, { status: 'resolved' });
      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, status: 'resolved' } : report
        )
      );
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); 
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
        {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">RouteWise Admin</h1>
              </div>
            </div>
            <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'map', label: 'Map View', icon: MapPin },
              { id: 'bins', label: 'Bins', icon: Building2 },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Click on Map to Add Bin</h2>
              <div className="text-sm text-gray-600">
                Click anywhere on the map to add a new bin at that location
              </div>
            </div>
            <BinMap bins={bins} onMapClick={handleMapClick} />
          </div>
        )}

        {activeTab === 'bins' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Bin Management</h2>
              <div className="text-sm text-gray-600">
                Use the map to add new bins by clicking on locations
              </div>
            </div>
            <BinList
              bins={bins}
              onEdit={handleEditClick}
              onDelete={handleDeleteBin}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Reports Management</h2>
            <ReportsList
              reports={reports}
              onResolve={handleResolveReport}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddBinModal && (
        <AddBinModal
          onClose={() => {
            setShowAddBinModal(false);
            setSelectedLocation(null);
          }}
          onAdd={handleAddBin}
          existingBins={bins}
          selectedLocation={selectedLocation}
        />
      )}

      {showEditBinModal && selectedBin && (
        <EditBinModal
          bin={selectedBin}
          onClose={() => {
            setShowEditBinModal(false);
            setSelectedBin(null);
          }}
          onSave={handleEditBin}
          existingBins={bins}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
