import React, { useEffect, useState } from 'react';
import axios from '../../apis/axios';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/reports');
      const data = res?.data.reports;
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        console.warn('Reports is not an array:', data);
        setReports([]);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const confirm = window.confirm(`Are you sure you want to mark this report as "${newStatus}"?`);
    if (!confirm) return;

    try {
      await axios.put(`/reports/${id}`, { status: newStatus });
      fetchReports(); // Refresh list
    } catch (err) {
      console.error('Failed to update report status:', err);
    }
  };

  if (loading) return <div className="p-4">Loading reports...</div>;
  if (reports.length === 0) return <div className="p-4">No reports available.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Citizen Reports</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Bin</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Reported At</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="border p-2">
                {report.binId?.location.name || report.binId?._id || 'Unknown'}
              </td>
              <td className="border p-2">{report.message}</td>
              <td className="border p-2">
                {new Date(report.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">{report.status || 'Open'}</td>
              <td className="border p-2">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={report.status || 'Open'}
                  onChange={(e) => handleStatusChange(report._id, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsList;

