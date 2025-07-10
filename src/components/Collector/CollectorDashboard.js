import React, { useState, useEffect } from 'react';
import axios from '../../apis/axios';
import { Truck, LogOut, List, Map } from 'lucide-react';
import TaskList from './TaskList';
import RouteMap from './RouteMap';
import { useNavigate } from 'react-router-dom';

const CollectorDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [depot, setDepot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polylineCoords, setPolylineCoords] = useState();
  const navigate = useNavigate();


  // ﹥ fetch optimized route once on mount
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get('/route/optimized-route');   

        if (res.data.success && Array.isArray(res.data.route)) {

          setDepot(res.data.from);
          setPolylineCoords(res.data.polyline);

          const formatted = res.data.route.map((bin) => ({
            id: bin._id,
            placename: bin.location?.name,
            lat: bin.location?.coordinates.lat,
            lng: bin.location?.coordinates.lng,
            type: bin.type,
            fillLevel: bin.fill,
            priority:
              bin.fill >= 90 ? 'high' : bin.fill >= 80 ? 'medium' : 'low',
            status: 'pending',
          }));
          setTasks(formatted);
        }
      } catch (err) {
        console.error('Failed to load route', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };


  // local‑only status updates
  const completeTask = (taskId) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t)),
    );

  const skipTask = (taskId, reason) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: 'skipped', skipReason: reason } : t,
      ),
    );

  const stats = {
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    skipped: tasks.filter((t) => t.status === 'skipped').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              RouteWise Collector
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today’s Progress</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.completed}/{tasks.length} done
              </p>
            </div>
            <button
            onClick={handleLogout} 
            className="flex items-center text-gray-600 hover:text-gray-900 space-x-2">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* main */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* tabs */}
        <nav className="mb-6 flex bg-gray-100 p-1 rounded-lg max-w-md space-x-1">
          {[
            { id: 'tasks', label: 'Task List', icon: List },
            { id: 'map', label: 'Map View', icon: Map },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* tab content */}
        {activeTab === 'tasks' ? (
          <TaskList
            tasks={tasks}
            onTaskComplete={completeTask}
            onTaskSkip={skipTask}
          />
        ) : (
          <RouteMap  tasks={Array.isArray(tasks) ? tasks : []} from={depot} polyline={polylineCoords} onTaskComplete={completeTask} />
        )}
      </div>
    </div>
  );
};

export default CollectorDashboard;

