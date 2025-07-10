import React, { useState, useEffect } from 'react';
import {
  Plus,
  LogOut,
  MessageSquare,
  User
} from 'lucide-react';
import ReportForm from './ReportForm';
import MyReports from './MyReports';
import axios from '../../apis/axios';
import { useNavigate } from 'react-router-dom';


const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [binsRes, reportsRes] = await Promise.all([
          axios.get('/bins'),
          axios.get(`/reports/user/${userId}`)
      ]);
        setBins(binsRes.data.data);
        setReports(reportsRes.data.reports);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReportSubmit = async (report) => {
    try {
      console.log("hello");
      const res = await axios.post('/reports', report);
      console.log(res);
      setReports(prev => [res.data, ...prev]);
      setActiveTab('my-reports');
    } catch (err) {
      console.error('Failed to submit report:', err);
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">RouteWise Citizen</h1>
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-green-100 max-w-xl">
            {[
              { id: 'report', label: 'Report Issue', icon: Plus },
              { id: 'my-reports', label: 'My Reports', icon: MessageSquare }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === id
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Report a Bin Issue</h2>
              <p className="text-gray-600">Help us maintain clean neighborhoods by reporting bin problems.</p>
            </div>
            <ReportForm bins={bins} onSubmit={handleReportSubmit} />
          </div>
        )}

        {activeTab === 'my-reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">My Reports</h2>
              <p className="text-gray-600">Track the status of your submitted reports.</p>
            </div>
            <MyReports reports={reports} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
